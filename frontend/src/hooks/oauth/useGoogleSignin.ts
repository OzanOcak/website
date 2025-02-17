import axiosInstance from "@/utils/AxiosInterceptor";
import { generateCodeChallenge, generateCodeVerifier } from "@/utils/pkce";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGoogleSignInUrl = (enabled: boolean) => {
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  return useQuery({
    queryKey: ["googleSignInUrl"], // Pass an array of strings
    queryFn: async () => {
      // Generate code verifier and code challenge
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);

      // Store the code verifier in session storage
      sessionStorage.setItem("codeVerifier", verifier);
      setCodeVerifier(verifier);

      // Pass the code challenge to the backend
      const response = await axiosInstance.get("/oauth/url", {
        params: { code_challenge: challenge, code_verifier: verifier },
      });

      console.log(codeVerifier);
      return response.data; // {url,state} -> to client to use in a tag
    },
    enabled: enabled, // Fetch only if this is true
  });
};

/*
The data.url already includes the state parameter
(e.g., https://accounts.google.com/o/oauth2/v2/auth?state=...).
You don’t need to handle the state parameter explicitly in the frontend at this stage. 
*/

/* Change In useQuery

      onSuccess: (data:string) => {
        console.log('Google sign-in URL fetched successfully:', data);
      },
      onError: (error:Error) => {
        console.error('Error fetching Google sign-in URL:', error.message);
      },

The API for useQuery has changed, and the onSuccess and onError callbacks are no longer supported. 
This change was made to address several issues with the previous implementation.

Why was the API changed?

Callbacks were not deduplicated: When using onSuccess or onError callbacks, they would be called 
multiple times if the same query was used in multiple components. This could lead to unexpected 
behavior and errors.
State syncing issues: Using onSuccess or onError callbacks to sync state with other libraries 
(like Redux) could lead to out-of-sync state and bugs that are hard to track.
Additional render cycles: Using onSuccess or onError callbacks could introduce additional render 
cycles, which could lead to performance issues and unexpected behavior.
*/

// In QueryClientContext wrapper of main, all the query are cached (chack main.tsx then go to Provider)
