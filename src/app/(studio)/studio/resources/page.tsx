import { DEFAULT_LIMIT } from "@/constants";
import { StudioResourcesView } from "./client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  prefetch(trpc.studio.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <StudioResourcesView />
    </HydrateClient>
  );
};

export default Page;
