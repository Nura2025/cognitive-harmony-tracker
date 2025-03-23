export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          difficulty: number
          duration: number
          id: string
          score: number
          session_id: string
          type: string
        }
        Insert: {
          created_at?: string
          difficulty: number
          duration: number
          id?: string
          score: number
          session_id: string
          type: string
        }
        Update: {
          created_at?: string
          difficulty?: number
          duration?: number
          id?: string
          score?: number
          session_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_concerns: {
        Row: {
          concern: string
          created_at: string
          id: string
          patient_metric_id: string
        }
        Insert: {
          concern: string
          created_at?: string
          id?: string
          patient_metric_id: string
        }
        Update: {
          concern?: string
          created_at?: string
          id?: string
          patient_metric_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_concerns_patient_metric_id_fkey"
            columns: ["patient_metric_id"]
            isOneToOne: false
            referencedRelation: "patient_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_metrics: {
        Row: {
          attention: number
          behavioral: number
          created_at: string
          date: string
          executive_function: number
          id: string
          memory: number
          patient_id: string
          percentile: number | null
          progress: number
          sessions_completed: number
          sessions_duration: number
        }
        Insert: {
          attention: number
          behavioral: number
          created_at?: string
          date?: string
          executive_function: number
          id?: string
          memory: number
          patient_id: string
          percentile?: number | null
          progress?: number
          sessions_completed?: number
          sessions_duration?: number
        }
        Update: {
          attention?: number
          behavioral?: number
          created_at?: string
          date?: string
          executive_function?: number
          id?: string
          memory?: number
          patient_id?: string
          percentile?: number | null
          progress?: number
          sessions_completed?: number
          sessions_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_metrics_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          adhd_subtype: string
          age: number
          created_at: string
          diagnosis_date: string
          gender: string
          id: string
          name: string
        }
        Insert: {
          adhd_subtype: string
          age: number
          created_at?: string
          diagnosis_date: string
          gender: string
          id?: string
          name: string
        }
        Update: {
          adhd_subtype?: string
          age?: number
          created_at?: string
          diagnosis_date?: string
          gender?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          attention: number
          behavioral: number
          completion_status: string
          created_at: string
          device: string
          duration: number
          end_time: string
          environment: string
          executive_function: number
          id: string
          memory: number
          overall_score: number
          patient_id: string
          start_time: string
        }
        Insert: {
          attention: number
          behavioral: number
          completion_status: string
          created_at?: string
          device: string
          duration: number
          end_time: string
          environment: string
          executive_function: number
          id?: string
          memory: number
          overall_score: number
          patient_id: string
          start_time: string
        }
        Update: {
          attention?: number
          behavioral?: number
          completion_status?: string
          created_at?: string
          device?: string
          duration?: number
          end_time?: string
          environment?: string
          executive_function?: number
          id?: string
          memory?: number
          overall_score?: number
          patient_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
