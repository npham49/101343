import { updatePaint, createPaint, deletePaint } from "@/lib/paintApi";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export const usePaintMutations = () => {
  const queryClient = useQueryClient();
  const updatePaintMutation = useMutation(updatePaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint updated successfully");
    },
    onError: (e: any) => {
      toast.error("Error updating paint", e.response.data.message);
    },
  });

  const createPaintMutation = useMutation(createPaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint created successfully");
    },
    onError: (e: any) => {
      toast.error("Error creating paint", e.response.data.message);
    },
  });

  const deletePaintMutation = useMutation(deletePaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint deleted successfully");
    },
    onError: (e: any) => {
      toast.error("Error deleting paint", e.response.data.message);
    },
  });
  return { updatePaintMutation, createPaintMutation, deletePaintMutation };
};
