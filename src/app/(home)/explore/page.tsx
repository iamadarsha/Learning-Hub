import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ExploreView } from "./client";

const Page = () => {
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <HydrateClient>
      <ExploreView />
    </HydrateClient>
  );
};

export default Page;
