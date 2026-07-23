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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      collection_projects: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          project_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          project_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_projects_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_collection_projects_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description_en: string | null
          description_id: string | null
          hero_media_id: string | null
          id: string
          is_default: boolean
          name: string
          seo_description_en: string | null
          seo_description_id: string | null
          seo_title_en: string | null
          seo_title_id: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_id?: string | null
          hero_media_id?: string | null
          id?: string
          is_default?: boolean
          name: string
          seo_description_en?: string | null
          seo_description_id?: string | null
          seo_title_en?: string | null
          seo_title_id?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_id?: string | null
          hero_media_id?: string | null
          id?: string
          is_default?: boolean
          name?: string
          seo_description_en?: string | null
          seo_description_id?: string | null
          seo_title_en?: string | null
          seo_title_id?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_en: string | null
          alt_id: string | null
          created_at: string | null
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          size: number | null
          storage_path: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          alt_en?: string | null
          alt_id?: string | null
          created_at?: string | null
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          size?: number | null
          storage_path: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          alt_en?: string | null
          alt_id?: string | null
          created_at?: string | null
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          size?: number | null
          storage_path?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      project_blocks: {
        Row: {
          caption_en: string | null
          caption_id: string | null
          content_en: string | null
          content_id: string | null
          created_at: string | null
          embed_url: string | null
          id: string
          media_id: string | null
          section_id: string
          sort_order: number | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at: string | null
        }
        Insert: {
          caption_en?: string | null
          caption_id?: string | null
          content_en?: string | null
          content_id?: string | null
          created_at?: string | null
          embed_url?: string | null
          id?: string
          media_id?: string | null
          section_id: string
          sort_order?: number | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at?: string | null
        }
        Update: {
          caption_en?: string | null
          caption_id?: string | null
          content_en?: string | null
          content_id?: string | null
          created_at?: string | null
          embed_url?: string | null
          id?: string
          media_id?: string | null
          section_id?: string
          sort_order?: number | null
          type?: Database["public"]["Enums"]["block_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_blocks_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_blocks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "project_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      project_meta_badges: {
        Row: {
          created_at: string | null
          icon: string | null
          icon_color: string | null
          id: string
          label: string
          meta_row_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          icon_color?: string | null
          id?: string
          label: string
          meta_row_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          icon_color?: string | null
          id?: string
          label?: string
          meta_row_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_meta_badges_meta_row_id_fkey"
            columns: ["meta_row_id"]
            isOneToOne: false
            referencedRelation: "project_meta_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      project_meta_rows: {
        Row: {
          created_at: string | null
          id: string
          label_en: string
          label_id: string
          project_id: string
          sort_order: number
          updated_at: string | null
          value_en: string | null
          value_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label_en: string
          label_id: string
          project_id: string
          sort_order?: number
          updated_at?: string | null
          value_en?: string | null
          value_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label_en?: string
          label_id?: string
          project_id?: string
          sort_order?: number
          updated_at?: string | null
          value_en?: string | null
          value_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_meta_rows_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sections: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          sort_order: number | null
          title_en: string
          title_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          sort_order?: number | null
          title_en: string
          title_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          sort_order?: number | null
          title_en?: string
          title_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company: string | null
          cover_media_id: string | null
          created_at: string | null
          description_en: string | null
          description_id: string | null
          featured: boolean | null
          id: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["project_status"]
          thumbnail_media_id: string | null
          title_en: string
          title_id: string
          type_en: string | null
          type_id: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          company?: string | null
          cover_media_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_id?: string | null
          featured?: boolean | null
          id?: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail_media_id?: string | null
          title_en: string
          title_id: string
          type_en?: string | null
          type_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          company?: string | null
          cover_media_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_id?: string | null
          featured?: boolean | null
          id?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail_media_id?: string | null
          title_en?: string
          title_id?: string
          type_en?: string | null
          type_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_thumbnail_media_id_fkey"
            columns: ["thumbnail_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          coming_soon_description_en: string | null
          coming_soon_description_id: string | null
          coming_soon_title_en: string | null
          coming_soon_title_id: string | null
          created_at: string | null
          default_collection_id: string | null
          dribbble_url: string | null
          email: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          medium_url: string | null
          not_found_description_en: string | null
          not_found_description_id: string | null
          not_found_title_en: string | null
          not_found_title_id: string | null
          resume_url: string | null
          site_name: string | null
          updated_at: string | null
        }
        Insert: {
          coming_soon_description_en?: string | null
          coming_soon_description_id?: string | null
          coming_soon_title_en?: string | null
          coming_soon_title_id?: string | null
          created_at?: string | null
          default_collection_id?: string | null
          dribbble_url?: string | null
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          medium_url?: string | null
          not_found_description_en?: string | null
          not_found_description_id?: string | null
          not_found_title_en?: string | null
          not_found_title_id?: string | null
          resume_url?: string | null
          site_name?: string | null
          updated_at?: string | null
        }
        Update: {
          coming_soon_description_en?: string | null
          coming_soon_description_id?: string | null
          coming_soon_title_en?: string | null
          coming_soon_title_id?: string | null
          created_at?: string | null
          default_collection_id?: string | null
          dribbble_url?: string | null
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          medium_url?: string | null
          not_found_description_en?: string | null
          not_found_description_id?: string | null
          not_found_title_en?: string | null
          not_found_title_id?: string | null
          resume_url?: string | null
          site_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_default_collection_id_fkey"
            columns: ["default_collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      dashboard_summary: { Args: never; Returns: Json }
      get_homepage: { Args: { p_collection_slug: string }; Returns: Json }
      get_project_detail: { Args: { p_slug: string }; Returns: Json }
      publish_project: { Args: { p_project: string }; Returns: boolean }
      reorder_blocks: {
        Args: { p_block: string; p_order: number }
        Returns: undefined
      }
      reorder_projects: {
        Args: { p_order: number; p_project: string }
        Returns: undefined
      }
      search_media: {
        Args: { p_keyword: string }
        Returns: {
          alt_en: string | null
          alt_id: string | null
          created_at: string | null
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          size: number | null
          storage_path: string
          updated_at: string | null
          width: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "media_assets"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      block_type:
        | "paragraph"
        | "image"
        | "quote"
        | "video"
        | "embed"
        | "heading"
      project_status: "draft" | "published" | "archived"
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
    Enums: {
      block_type: ["paragraph", "image", "quote", "video", "embed", "heading"],
      project_status: ["draft", "published", "archived"],
    },
  },
} as const
