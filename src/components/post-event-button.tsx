import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  iconOnly?: boolean;
};

export function PostEventButton({
  className,
  size = "default",
  label = "Postar evento",
  iconOnly = false,
}: Props) {
  if (iconOnly) {
    return (
      <Button
        asChild
        size="icon"
        className={cn(className)}
        title={label}
        aria-label={label}
      >
        <Link href="/painel/novo">
          <PlusCircle className="size-5" />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size={size} className={cn(className)}>
      <Link href="/painel/novo">
        <PlusCircle className="size-4" />
        {label}
      </Link>
    </Button>
  );
}
