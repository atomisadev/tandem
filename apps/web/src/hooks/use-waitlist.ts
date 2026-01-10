"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import { toast } from "sonner";

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await api.api.waitlist.post({ email });

      if (error) {
        throw new Error(
          error.value instanceof Error ? error.value.message : "Failed to join"
        );
      }

      return data;
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    },
  });
}
