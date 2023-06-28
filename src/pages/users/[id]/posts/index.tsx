import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const { query } = useRouter();

  const utils = api.useContext();

  const createPostMutation = api.posts.createPost.useMutation({
    async onMutate(newPost) {
      await utils.posts.listPosts.cancel();

      const params = sessionData?.user.id.toString();

      const prevData = utils.posts.listPosts.getData(params);

      utils.posts.listPosts.setData(params, (old) => [...old, newPost]);

      return { prevData };
    },
    onError(err, newPost, ctx) {
      void utils.posts.listPosts.setData(
        sessionData?.user.id.toString(),
        ctx?.prevData
      );
    },
    onSettled() {
      void utils.posts.listPosts.invalidate();
    },
  });
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createPostMutation.mutate({
      title: e.target.title.value,
      content: e.target.content.value,
      userId: query.id as string,
      published: false,
    });
  }
  return (
    <>
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
          <p>published: {p.published ? "true" : "false"}</p>
        </div>
      ))}
    </>
  );
};
export default PostPage;
