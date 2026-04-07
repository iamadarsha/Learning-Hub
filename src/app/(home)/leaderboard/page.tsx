import { HydrateClient } from "@/trpc/server";
import { LeaderboardView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <LeaderboardView />
    </HydrateClient>
  );
};

export default Page;
