import { HydrateClient } from "@/trpc/server";
import { ExpertsView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <ExpertsView />
    </HydrateClient>
  );
};

export default Page;
