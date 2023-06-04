import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type NextPage } from "next";

const UserPage: NextPage = () => {
  const { query } = useRouter();
  const userQuery = api.users.getById.useQuery(query.id as string);

  return (
    <div>
      <h1>User info for: {userQuery.data?.name}</h1>
    </div>
  );
};

export default UserPage;
