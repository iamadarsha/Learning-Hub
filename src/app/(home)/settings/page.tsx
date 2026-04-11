import { HydrateClient } from "@/trpc/server";
import { SettingsView } from "./client";

const Page = () => {
  return (
    <HydrateClient>
      <SettingsView />
    </HydrateClient>
  );
};

export default Page;
