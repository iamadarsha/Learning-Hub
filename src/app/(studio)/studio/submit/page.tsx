import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubmitResourceView } from "./client";

const Page = () => {
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <HydrateClient>
      <SubmitResourceView />
    </HydrateClient>
  );
};

export default Page;
