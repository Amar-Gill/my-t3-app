import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FormEvent } from "react";

const UserPage: NextPage = () => {
  const { query } = useRouter();

  const userQuery = api.users.getById.useQuery(query.id as string);
  const createPostMutation = api.posts.createPost.useMutation();

  const { data: sessionData } = useSession();

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createPostMutation.mutate({
      title: e.target.title.value,
      content: e.target.content.value,
      userId: userQuery.data?.id,
      published: false,
    });
  }

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
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col border border-black bg-sky-600 p-2"
      >
        <label>Title</label>
        <input name="title" type="text" className="m-1" />
        <label>Content</label>
        <input name="content" type="text" className="m-1" />
        <button type="submit">Post</button>
      </form>
      {sessionData && <PostsLists />}
    </>
  );
};

const PostsLists: React.FC = () => {
  const { data: sessionData } = useSession();
  const listPostsQuery = api.posts.listPosts.useQuery(sessionData?.user.id);

  if (!listPostsQuery.data) {
    return <div>WOOPS</div>;
  }

  return (
    <>
      {listPostsQuery.data.map((p) => (
        <div key={p.id}>
          <p>id: {p.id}</p>
          <p>title: {p.title}</p>
          <p>content: {p.content}</p>
          <p>published: {p.published}</p>
        </div>
      ))}
    </>
  );
};

export default UserPage;
