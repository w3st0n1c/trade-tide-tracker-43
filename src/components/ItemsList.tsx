import { useState, useMemo } from "react";
import { Item, items } from "@/data/items";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Star } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export const ItemsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "ascending" | "descending";
  }>({ key: "tier", direction: "ascending" });

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        (!showFavoritesOnly || isFavorite(item.name))
      )
      .sort((a, b) => {
        if (sortConfig.key === "tier") {
          // Special handling for tier sorting (SS, S, A, B, C, D, F)
          const tierOrder = { "SS": 0, "S": 1, "A": 2, "B": 3, "C": 4, "D": 5, "F": 6 };
          const valueA = tierOrder[a.tier as keyof typeof tierOrder] || 999;
          const valueB = tierOrder[b.tier as keyof typeof tierOrder] || 999;
          return sortConfig.direction === "ascending" 
            ? valueA - valueB 
            : valueB - valueA;
        }
        
        if (sortConfig.key === "value" || sortConfig.key === "demand") {
          return sortConfig.direction === "ascending"
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        
        // For string values
        const valueA = String(a[sortConfig.key]).toLowerCase();
        const valueB = String(b[sortConfig.key]).toLowerCase();
        
        if (valueA < valueB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
  }, [items, searchQuery, sortConfig]);

  const requestSort = (key: keyof Item) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full sm:w-auto btn-enhanced">
          <Search className="h-4 w-4" />
          View All Items
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] w-[95vw] panel-enhanced">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-wide">All Tradable Items</DialogTitle>
        </DialogHeader>
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 w-full sm:w-auto btn-enhanced ${showFavoritesOnly ? "bg-primary/10" : ""}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {showFavoritesOnly ? "Show All Items" : "Show Favorites Only"}
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("name")}
                >
                  Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("value")}
                >
                  Value {sortConfig.key === "value" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("tier")}
                >
                  Tier {sortConfig.key === "tier" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("demand")}
                >
                  Demand {sortConfig.key === "demand" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("status")}
                >
                  Status {sortConfig.key === "status" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("category")}
                >
                  Category {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.name);
                      }}
                    >
                      <Star className={`h-4 w-4 ${isFavorite(item.name) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </Button>
                    {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                  </TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(item.tier)}>{item.tier}</Badge>
                  </TableCell>
                  <TableCell>{item.demand}/10</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};