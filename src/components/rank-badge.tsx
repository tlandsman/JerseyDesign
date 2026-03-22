import { Badge } from "@/components/ui/badge";

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <Badge
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 h-16 w-16 rounded-full text-3xl font-bold
                 bg-primary text-primary-foreground
                 flex items-center justify-center
                 shadow-lg z-10"
    >
      {rank}
    </Badge>
  );
}
