import { updatePaint, createPaint, deletePaint } from "@/lib/paintApi";
import { Paint } from "@/typings";
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

  const updateData = async (
    result: any,
    paint: Paint,
    paints: Paint[],
    updatePaintMutation: any
  ) => {
    if (result === undefined) {
      updatePaintMutation.mutate({
        id: paint.id,
        name: paint.name,
        status: paint.status,
        updatedAt: new Date(),
        stock: paint.stock,
      });
    } else {
      updatePaintMutation.mutate({
        id: result.draggableId,
        status: result.destination.droppableId,
        updatedAt: new Date(),
        stock: paint.stock,
      });
      const items = [...paints];

      const [reorderedItem] = items.splice(result.source.index, 1);

      items.splice(result.destination.index, 0, reorderedItem);

      const idsOrderArray = items.map((task) => task.id);
      localStorage.setItem("paintOrder", JSON.stringify(idsOrderArray));
    }
  };

  return {
    updatePaintMutation,
    createPaintMutation,
    deletePaintMutation,
    updateData,
  };
};
