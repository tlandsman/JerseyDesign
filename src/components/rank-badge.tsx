import { Badge } from "@/components/ui/badge";

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <Badge
      className="h-8 w-8 rounded-full text-lg font-bold
                 bg-primary text-primary-foreground
                 flex items-center justify-center shrink-0"
    >
      {rank}
    </Badge>
  );
}
