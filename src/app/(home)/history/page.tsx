import { HydrateClient } from "@/trpc/server";
import { HistoryView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default Page;
