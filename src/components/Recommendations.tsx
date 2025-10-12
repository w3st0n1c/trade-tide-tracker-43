import { Item } from "@/data/items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface RecommendationsProps {
  title: string;
  items: Item[];
  onAddItem: (item: Item) => void;
}

export const Recommendations = ({ title, items, onAddItem }: RecommendationsProps) => {
  if (items.length === 0) return null;

  const getTierColor = (tier: string) => {
    const colors: { [key: string]: string } = {
      SS: "bg-accent text-accent-foreground",
      S: "bg-primary text-primary-foreground",
      A: "bg-success text-success-foreground",
      B: "bg-secondary text-secondary-foreground",
      C: "bg-muted text-muted-foreground",
      D: "bg-border text-foreground",
      F: "bg-border text-muted-foreground"
    };
    return colors[tier] || colors.C;
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.name}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-auto py-1"
            onClick={() => onAddItem(item)}
          >
            <span>
              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
            </span>
            <Badge className={getTierColor(item.tier)}>{item.tier}</Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};