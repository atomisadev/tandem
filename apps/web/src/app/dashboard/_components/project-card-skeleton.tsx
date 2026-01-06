import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between min-h-[160px]">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center gap-1 5 mt-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="mt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6 mt-1" />
        </div>
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-3 w-16" />
      </CardFooter>
    </Card>
  );
}
