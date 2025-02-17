//import { useUserName } from "@/hooks/roles/useProfile";

import Layout from "@/components/custom/layout";
//import { Pending } from "@/components/custom/isPending";
//import { Erroring } from "@/components/custom/isError";

export default function ProfilePage() {
  //const { data: profile, isPending, isError, error } = useUserName();

  // if (isPending) return <Pending />;
  //if (isError) return <Erroring />;
  //if (!profile) return <div>No profile found, {error}</div>;

  return (
    <Layout>
      <div>
        {/* Display user name or other profile info */}
        <p>Sorry!, not so many things to do for you</p>
      </div>
    </Layout>
  );
}
