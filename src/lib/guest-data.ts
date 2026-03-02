import type { Tables } from "@/integrations/supabase/types";

export type DashboardProject = Tables<"projects"> & { grades: Tables<"grades">[] };

const createdAt = new Date("2026-02-20T12:00:00.000Z").toISOString();

export const guestProjects: DashboardProject[] = [
  {
    id: "guest-project-1",
    user_id: "guest",
    title: "Adaptive Road Safety Model for Urban Intersections",
    description:
      "Built a computer vision pipeline that detects near-miss traffic events and predicts collision risk using temporal scene graphs from roadside camera feeds.",
    target_university: "MIT",
    file_url: null,
    status: "graded",
    created_at: createdAt,
    updated_at: createdAt,
    grades: [
      {
        id: "guest-grade-1",
        project_id: "guest-project-1",
        created_at: createdAt,
        overall_score: 91,
        letter_grade: "A-",
        technical_depth: 93,
        innovation: 90,
        relevance: 94,
        presentation: 86,
        methodology: 92,
        feedback:
          "Your approach shows strong engineering judgment and a clear understanding of real-world constraints. The temporal modeling choice is well-motivated and aligns with current research in intelligent transportation systems.\n\nTo improve further, add stronger error analysis across edge conditions (night, rain, heavy occlusion) and compare your model against at least one additional baseline focused on calibration quality. A short ablation section would make the work more publication-ready.",
        comparison_note:
          "This project is competitive for advanced undergraduate research programs in top CS/EE departments with stronger robustness analysis.",
      },
    ],
  },
  {
    id: "guest-project-2",
    user_id: "guest",
    title: "Low-Cost Indoor Air Quality Monitoring Mesh",
    description:
      "Designed a distributed sensor network with anomaly alerts for PM2.5 and VOC spikes in shared student housing.",
    target_university: "Stanford",
    file_url: null,
    status: "pending",
    created_at: createdAt,
    updated_at: createdAt,
    grades: [],
  },
];

export const getGuestProjectById = (projectId: string): DashboardProject | null => {
  return guestProjects.find((project) => project.id === projectId) ?? null;
};
