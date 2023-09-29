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
      stlPhotoCommentDetail: {
        Row: {
          content: string
          hubPhotoCommentId: string
          hubPhotoId: string
          timeCreated: string
          timeUpdated: string | null
          userId: string
        }
        Insert: {
          content: string
          hubPhotoCommentId: string
          hubPhotoId: string
          timeCreated?: string
          timeUpdated?: string | null
          userId: string
        }
        Update: {
          content?: string
          hubPhotoCommentId?: string
          hubPhotoId?: string
          timeCreated?: string
          timeUpdated?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "stlPhotoCommentDetail_hubPhotoId_fkey"
            columns: ["hubPhotoId"]
            referencedRelation: "stlPhotoDetail"
            referencedColumns: ["hubPhotoId"]
          },
          {
            foreignKeyName: "stlPhotoCommentDetail_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stlPhotoDetail: {
        Row: {
          hubPhotoId: string
          photoUrl: string
          timeCreated: string
          userId: string
        }
        Insert: {
          hubPhotoId: string
          photoUrl: string
          timeCreated?: string
          userId: string
        }
        Update: {
          hubPhotoId?: string
          photoUrl?: string
          timeCreated?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "stlPhotoDetail_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
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
