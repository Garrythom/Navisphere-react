// Hand-written to match supabase/migrations/*.sql. Regenerate with
// `supabase gen types typescript` once the Supabase CLI is set up.

export type OrderStatus =
  | "order_received"
  | "order_picked_up"
  | "processing"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "delayed";

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      orders: {
        Row: {
          id: string;
          tracking_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          origin: string;
          destination_street: string;
          destination_country: string;
          destination_city: string;
          destination_state: string;
          destination_zip_code: string;
          notes: string;
          current_status: OrderStatus;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          tracking_number?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          origin: string;
          destination_street: string;
          destination_country: string;
          destination_city: string;
          destination_state?: string;
          destination_zip_code?: string;
          notes?: string;
          current_status?: OrderStatus;
          created_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product: string;
          quantity?: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      tracking_updates: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          location: string;
          note: string;
          timestamp: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: OrderStatus;
          location: string;
          note?: string;
          timestamp?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["tracking_updates"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Functions: {
      get_order_by_tracking_number: {
        Args: { p_tracking_number: string };
        Returns: {
          tracking_number: string;
          customer_name: string;
          origin: string;
          destination_street: string;
          destination_country: string;
          destination_city: string;
          destination_state: string;
          destination_zip_code: string;
          current_status: OrderStatus;
          created_at: string;
          items: { product: string; quantity: number }[];
          updates: {
            status: OrderStatus;
            location: string;
            note: string;
            timestamp: string;
          }[];
        }[];
      };
    };
  };
}
