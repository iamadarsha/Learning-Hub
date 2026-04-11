import { HydrateClient } from "@/trpc/server";
import { XPHistoryView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <XPHistoryView />
    </HydrateClient>
  );
};

export default Page;
