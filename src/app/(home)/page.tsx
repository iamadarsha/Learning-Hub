import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
