"use client";

import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {useUser} from "@clerk/nextjs";
import {useMutation} from "convex/react";
import {ConvexError} from "convex/values";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";

const Join = () => {
  const {isLoaded, isSignedIn, user} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const grantAccessByToken = useMutation(api.token.grantAccessByToken);
  const {toast} = useToast();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
    }
    const callGrantAcess = async () => {
      if (token) {
        try {
          const planId = await grantAccessByToken({
            token,
          });

          router.push(`/plans/${planId}/plan`);
          return new Response(null, {
            status: 200,
          });
        } catch (error) {
          console.error(error);
          if (error instanceof ConvexError) {
            toast({
              title: "Error",
              description: (error.data as {message: string}).message,
            });
          }
          return new Response("token error", {
            status: 400,
          });
        }
      }
    };

    callGrantAcess();
  }, [isLoaded, isSignedIn, token]);
  return <div>Joining...</div>;
};

export default Join;
