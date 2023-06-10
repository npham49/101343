import { updatePaint, createPaint, deletePaint } from "@/lib/paintApi";
import { Paint } from "@/typings";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

// Contain the react-query mutations for any API calls
export const usePaintMutations = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  // Mutation for updating a paint, show a toast on success or error
  const updatePaintMutation = useMutation(updatePaint, {
    onMutate: async () => {
      getToken().then((token) => {
        console.log(token);
        localStorage.setItem("token", token || "");
      });
    },
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint updated successfully");
    },
    onError: (e: any) => {
      getToken().then((token) => {
        localStorage.setItem("token", token || "");
      });
      queryClient.invalidateQueries("paints");
      toast.error("Error updating paint", e.response.data.message);
    },
  });

  // Mutation for creating a paint, show a toast on success or error
  const createPaintMutation = useMutation(createPaint, {
    onMutate: async () => {
      getToken().then((token) => {
        console.log(token);
        localStorage.setItem("token", token || "");
      });
    },
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint created successfully");
    },
    onError: (e: any) => {
      getToken().then((token) => {
        localStorage.setItem("token", token || "");
      });
      queryClient.invalidateQueries("paints");
      toast.error("Error creating paint", e.response.data.message);
    },
  });

  // Mutation for deleting a paint, show a toast on success or error
  const deletePaintMutation = useMutation(deletePaint, {
    onMutate: async () => {
      getToken().then((token) => {
        console.log(token);
        localStorage.setItem("token", token || "");
      });
    },
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
      toast.success("Paint deleted successfully");
    },
    onError: (e: any) => {
      getToken().then((token) => {
        localStorage.setItem("token", token || "");
      });
      queryClient.invalidateQueries("paints");
      toast.error("Error deleting paint", e.response.data.message);
    },
  });

  // Helper function to update paint data, it is resued across all forms and boards
  const updateData = async (
    result: any,
    paint: Paint,
    paints: Paint[],
    updatePaintMutation: any
  ) => {
    // If result is undefined, this is an update request from the form with a new paint attached
    if (result === undefined) {
      updatePaintMutation.mutate({
        id: paint.id,
        name: paint.name,
        status: paint.status,
        updatedAt: new Date(),
        stock: paint.stock,
      });
      // If result is defined, this is a drag and drop request
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
