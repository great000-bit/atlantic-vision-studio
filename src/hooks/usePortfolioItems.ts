import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PortfolioItem = Tables<"portfolio_items">;
export type PortfolioItemInsert = TablesInsert<"portfolio_items">;
export type PortfolioItemUpdate = TablesUpdate<"portfolio_items">;

// Fetch all portfolio items
export const usePortfolioItems = (category?: string) => {
  return useQuery({
    queryKey: ["portfolio-items", category],
    queryFn: async () => {
      let query = supabase
        .from("portfolio_items")
        .select("*")
        .eq("is_deleted", false)
        .order("sort_order", { ascending: true });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PortfolioItem[];
    },
  });
};

// Fetch single portfolio item
export const usePortfolioItem = (id: string) => {
  return useQuery({
    queryKey: ["portfolio-item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("id", id)
        .eq("is_deleted", false)
        .maybeSingle();

      if (error) throw error;
      return data as PortfolioItem | null;
    },
    enabled: !!id,
  });
};

// Create portfolio item
export const useCreatePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: PortfolioItemInsert) => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
    },
  });
};

// Update portfolio item
export const useUpdatePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PortfolioItemUpdate }) => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
    },
  });
};

// Delete portfolio item (soft delete)
export const useDeletePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolio_items")
        .update({ is_deleted: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
    },
  });
};

// Upload video to storage
export const uploadPortfolioVideo = async (file: File, portfolioItemId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${portfolioItemId}-${Date.now()}.${fileExt}`;
  const filePath = `portfolio/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("cms-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("cms-uploads")
    .getPublicUrl(filePath);

  return publicUrl;
};

// Upload image to storage
export const uploadPortfolioImage = async (file: File, portfolioItemId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${portfolioItemId}-thumb-${Date.now()}.${fileExt}`;
  const filePath = `portfolio/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("cms-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("cms-uploads")
    .getPublicUrl(filePath);

  return publicUrl;
};
