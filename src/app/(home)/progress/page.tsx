import { HydrateClient } from "@/trpc/server";
import { ProgressView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <ProgressView />
    </HydrateClient>
  );
};

export default Page;
