export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      grades: {
        Row: {
          comparison_note: string | null
          created_at: string
          feedback: string | null
          id: string
          innovation: number | null
          letter_grade: string | null
          methodology: number | null
          overall_score: number | null
          presentation: number | null
          project_id: string
          relevance: number | null
          technical_depth: number | null
        }
        Insert: {
          comparison_note?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          innovation?: number | null
          letter_grade?: string | null
          methodology?: number | null
          overall_score?: number | null
          presentation?: number | null
          project_id: string
          relevance?: number | null
          technical_depth?: number | null
        }
        Update: {
          comparison_note?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          innovation?: number | null
          letter_grade?: string | null
          methodology?: number | null
          overall_score?: number | null
          presentation?: number | null
          project_id?: string
          relevance?: number | null
          technical_depth?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string
          department: string
          email: string | null
          id: string
          name: string
          profile_url: string | null
          research_areas: string[] | null
          university: string
        }
        Insert: {
          created_at?: string
          department: string
          email?: string | null
          id?: string
          name: string
          profile_url?: string | null
          research_areas?: string[] | null
          university: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string | null
          id?: string
          name?: string
          profile_url?: string | null
          research_areas?: string[] | null
          university?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          field_of_study: string | null
          id: string
          name: string | null
          target_universities: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_of_study?: string | null
          id: string
          name?: string | null
          target_universities?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_of_study?: string | null
          id?: string
          name?: string | null
          target_universities?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          status: string
          target_university: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          status?: string
          target_university?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          status?: string
          target_university?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_suggestions: {
        Row: {
          alignment_reason: string | null
          created_at: string
          description: string | null
          id: string
          outreach_tips: string | null
          professor_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          alignment_reason?: string | null
          created_at?: string
          description?: string | null
          id?: string
          outreach_tips?: string | null
          professor_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          alignment_reason?: string | null
          created_at?: string
          description?: string | null
          id?: string
          outreach_tips?: string | null
          professor_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_suggestions_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
