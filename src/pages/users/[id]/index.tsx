import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";

const UserPage: NextPage = () => {
  const { query } = useRouter();

  const userQuery = api.users.getById.useQuery(query.id as string);

  const { data: sessionData } = useSession();

  if (!sessionData) {
    return <div>Not logged in.</div>;
  }

  return (
    <>
      <div>
        <h1>User info for: {userQuery.data?.name}</h1>
        <Image
          src={userQuery.data?.image}
          width={240}
          height={240}
          alt="profile image"
        />
      </div>
    </>
  );
};

export default UserPage;
