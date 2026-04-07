import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ResourceDetailView } from "./client";

interface PageProps {
  params: Promise<{
    resourceId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { resourceId } = await params;
  prefetch(trpc.resources.getOne.queryOptions({ id: resourceId }));

  return (
    <HydrateClient>
      <ResourceDetailView resourceId={resourceId} />
    </HydrateClient>
  );
};

export default Page;
