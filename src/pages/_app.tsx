import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Link from "next/link";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  console.log(session);
  return (
    <SessionProvider session={session}>
      <AppNav />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

const AppNav: React.FC = () => {
  const { data: session } = useSession();
  if (!session?.user) {
    return null;
  }
  return (
    <nav>
      <ul>
        <li>
          <Link className="mx-2" href="/">
            Home
          </Link>
          <Link className="mx-2" href={"/users/" + session?.user.id.toString()}>
            User
          </Link>
          <Link
            className="mx-2"
            href={"/users/" + session?.user.id.toString() + "/posts"}
          >
            Posts
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default api.withTRPC(MyApp);
