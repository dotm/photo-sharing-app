export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stlUserDetail: {
        Row: {
          profilePhotoUrl: string | null
          userId: string
          userName: string
        }
        Insert: {
          profilePhotoUrl?: string | null
          userId: string
          userName: string
        }
        Update: {
          profilePhotoUrl?: string | null
          userId?: string
          userName?: string
        }
        Relationships: [
          {
            foreignKeyName: "stlUserDetail_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
