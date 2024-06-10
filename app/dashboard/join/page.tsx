"use client";

import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {useUser} from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";
import {ConvexError} from "convex/values";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import joinNow from "@/public/join-now.svg";

const Join = () => {
  const {isLoaded, isSignedIn, user} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const grantAccessByToken = useMutation(api.token.grantAccessByToken);
  const {toast} = useToast();

  const currentUser = useQuery(api.users.currentUser);

  useEffect(() => {
    if (!isLoaded || !currentUser || !token) return;

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
              description: error.data as string,
            });
          }
          return new Response("token error", {
            status: 400,
          });
        }
      }
    };

    callGrantAcess();
  }, [isLoaded, isSignedIn, token, currentUser]);
  return (
    <div className="w-full h-full flex flex-1 justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5 bg-muted rounded-full p-10 shadow-">
        <Image
          alt="Joining the plan image"
          src={joinNow}
          width={300}
          height={300}
          className="bg-contain"
        />
        <h2 className="text-foreground animate-pulse font-bold text-lg">Joining the Plan...</h2>
      </div>
    </div>
  );
};

export default Join;
