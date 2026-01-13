import { ReactNode } from "react";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  footer?: {
    primary: string;
    secondary?: string;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  footer,
  icon,
  className,
}: StatCardProps) {
  const TrendIcon = change?.trend === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {change && (
          <CardAction>
            <Badge
              variant="outline"
              className={cn(
                change.trend === "up" && "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950",
                change.trend === "down" && "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950"
              )}
            >
              <TrendIcon className="size-3" />
              {change.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {footer && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {footer.primary}
            {icon || (change?.trend && <TrendIcon className="size-4" />)}
          </div>
          {footer.secondary && (
            <div className="text-muted-foreground">{footer.secondary}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
