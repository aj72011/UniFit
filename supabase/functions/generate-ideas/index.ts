import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { professorId } = await req.json();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get professor
    const { data: professor, error: profErr } = await supabase
      .from("professors").select("*").eq("id", professorId).single();
    if (profErr || !professor) throw new Error("Professor not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI not configured");

    const prompt = `You are an academic research advisor. Generate 3 project ideas for a student who wants to work with Professor ${professor.name} in the ${professor.department} department at ${professor.university}. Their research areas include: ${(professor.research_areas || []).join(", ")}.

For each idea, provide a title, brief description, why it aligns with the professor's work, and tips for reaching out.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a helpful academic research advisor." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_ideas",
            description: "Submit research project ideas",
            parameters: {
              type: "object",
              properties: {
                ideas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      alignment_reason: { type: "string" },
                      outreach_tips: { type: "string" },
                    },
                    required: ["title", "description", "alignment_reason", "outreach_tips"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["ideas"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_ideas" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error: " + status);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No ideas returned from AI");

    const { ideas } = JSON.parse(toolCall.function.arguments);

    // Save suggestions
    const suggestions = ideas.map((idea: any) => ({
      user_id: user.id,
      professor_id: professorId,
      title: idea.title,
      description: idea.description,
      alignment_reason: idea.alignment_reason,
      outreach_tips: idea.outreach_tips,
    }));

    const { error: insertErr } = await supabase.from("saved_suggestions").insert(suggestions);
    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ success: true, ideas }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ideas error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
