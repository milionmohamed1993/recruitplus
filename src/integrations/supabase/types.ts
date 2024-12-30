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
      applications: {
        Row: {
          candidate_id: number | null
          date_applied: string | null
          id: number
          job_id: number | null
          notes: string | null
          status: string | null
        }
        Insert: {
          candidate_id?: number | null
          date_applied?: string | null
          id?: number
          job_id?: number | null
          notes?: string | null
          status?: string | null
        }
        Update: {
          candidate_id?: number | null
          date_applied?: string | null
          id?: number
          job_id?: number | null
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_attachments: {
        Row: {
          analysis: string | null
          candidate_id: number | null
          created_at: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: number
        }
        Insert: {
          analysis?: string | null
          candidate_id?: number | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: number
        }
        Update: {
          analysis?: string | null
          candidate_id?: number | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "candidate_attachments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_education: {
        Row: {
          candidate_id: number | null
          created_at: string | null
          degree: string
          end_date: string | null
          field_of_study: string | null
          id: number
          institution: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: number | null
          created_at?: string | null
          degree: string
          end_date?: string | null
          field_of_study?: string | null
          id?: number
          institution: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: number | null
          created_at?: string | null
          degree?: string
          end_date?: string | null
          field_of_study?: string | null
          id?: number
          institution?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_education_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_work_history: {
        Row: {
          candidate_id: number | null
          company: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: number
          is_current: boolean | null
          position: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: number | null
          company: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean | null
          position: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: number | null
          company?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean | null
          position?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_work_history_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          address: string | null
          birthdate: string | null
          company: string | null
          created_at: string
          department: string | null
          education: string | null
          email: string
          experience: string | null
          gender: string | null
          id: number
          industry: string | null
          location: string | null
          name: string
          nationality: string | null
          phone: string | null
          position: string | null
          skill_ratings: Json | null
          skills: string[] | null
          source: string | null
          status: string | null
          university: string | null
          updated_at: string
          work_reference: string | null
          work_reference_evaluation: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          education?: string | null
          email: string
          experience?: string | null
          gender?: string | null
          id?: number
          industry?: string | null
          location?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          position?: string | null
          skill_ratings?: Json | null
          skills?: string[] | null
          source?: string | null
          status?: string | null
          university?: string | null
          updated_at?: string
          work_reference?: string | null
          work_reference_evaluation?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          education?: string | null
          email?: string
          experience?: string | null
          gender?: string | null
          id?: number
          industry?: string | null
          location?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          position?: string | null
          skill_ratings?: Json | null
          skills?: string[] | null
          source?: string | null
          status?: string | null
          university?: string | null
          updated_at?: string
          work_reference?: string | null
          work_reference_evaluation?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          id: number
          industry: string | null
          name: string
          notes: string | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: number
          industry?: string | null
          name: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: number
          industry?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          client_id: number | null
          created_at: string
          description: string
          id: number
          location: string | null
          requirements: string[] | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          description: string
          id?: number
          location?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: number | null
          created_at?: string
          description?: string
          id?: number
          location?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: number
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          value?: string
        }
        Relationships: []
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
