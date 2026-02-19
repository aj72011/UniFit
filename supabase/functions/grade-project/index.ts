import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { projectId } = await req.json();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get project
    const { data: project, error: projErr } = await supabase
      .from("projects").select("*").eq("id", projectId).single();
    if (projErr || !project) throw new Error("Project not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI not configured");

    const systemPrompt = `You are an academic project evaluator. Grade the following project on a scale of 0-100 for each category. Be rigorous but fair. Consider the target university's standards if specified.

Return a JSON object using this tool call.`;

    const userPrompt = `Project Title: ${project.title}
Target University: ${project.target_university || "General"}
Description: ${project.description || "No description provided."}

Evaluate this project thoroughly.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_grade",
            description: "Submit the grading results for the project",
            parameters: {
              type: "object",
              properties: {
                overall_score: { type: "number", description: "Overall score 0-100" },
                letter_grade: { type: "string", enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"] },
                technical_depth: { type: "number", description: "Technical depth score 0-100" },
                innovation: { type: "number", description: "Innovation score 0-100" },
                relevance: { type: "number", description: "Relevance to target university 0-100" },
                presentation: { type: "number", description: "Presentation quality 0-100" },
                methodology: { type: "number", description: "Research methodology score 0-100" },
                feedback: { type: "string", description: "Detailed feedback with improvement suggestions (2-3 paragraphs)" },
                comparison_note: { type: "string", description: "How this project compares to the target university's standards" },
              },
              required: ["overall_score", "letter_grade", "technical_depth", "innovation", "relevance", "presentation", "methodology", "feedback", "comparison_note"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_grade" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error: " + status);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No grade returned from AI");

    const gradeData = JSON.parse(toolCall.function.arguments);

    // Use service role to insert grade (RLS only allows SELECT for users)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: gradeErr } = await adminClient.from("grades").insert({
      project_id: projectId,
      ...gradeData,
    });
    if (gradeErr) throw gradeErr;

    // Update project status
    await supabase.from("projects").update({ status: "graded" }).eq("id", projectId);

    return new Response(JSON.stringify({ success: true, grade: gradeData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("grade-project error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
