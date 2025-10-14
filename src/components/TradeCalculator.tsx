import { useState, useMemo } from "react";
import { Item, items } from "@/data/items";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, X, TrendingUp, TrendingDown, Minus, List, Save, Share2, Scale, ChevronRight, Coins, Flame, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";
import { ItemsList } from "./ItemsList";
import { ThemeToggle } from "./ui/theme-toggle";
import { TradeHistory } from "./TradeHistory";
import { useTradeHistory } from "@/hooks/use-trade-history";
import { Recommendations } from "./Recommendations";
import { getItemRecommendations } from "@/lib/recommendation-utils";
import { IconLegend } from "./IconLegend";

interface TradeItem {
  item: Item;
  quantity: number;
}

export const TradeCalculator = () => {
  const [yourOffer, setYourOffer] = useState<TradeItem[]>([]);
  const [theirOffer, setTheirOffer] = useState<TradeItem[]>([]);
  const [openYours, setOpenYours] = useState(false);
  const [openTheirs, setOpenTheirs] = useState(false);
  const [tradeNotes, setTradeNotes] = useState("");
  const [expandedYourItems, setExpandedYourItems] = useState<Set<string>>(new Set());
  const [expandedTheirItems, setExpandedTheirItems] = useState<Set<string>>(new Set());
  const [yourOfferActive, setYourOfferActive] = useState(false);
  const [theirOfferActive, setTheirOfferActive] = useState(false);
  const { addTrade } = useTradeHistory();
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const addToYourOffer = (item: Item) => {
    const existing = yourOffer.find(t => t.item.name === item.name);
    if (existing) {
      setYourOffer(yourOffer.map(t => 
        t.item.name === item.name ? { ...t, quantity: t.quantity + 1 } : t
      ));
    } else {
      setYourOffer([...yourOffer, { item, quantity: 1 }]);
    }
    setOpenYours(false);
  };

  const addToTheirOffer = (item: Item) => {
    const existing = theirOffer.find(t => t.item.name === item.name);
    if (existing) {
      setTheirOffer(theirOffer.map(t => 
        t.item.name === item.name ? { ...t, quantity: t.quantity + 1 } : t
      ));
    } else {
      setTheirOffer([...theirOffer, { item, quantity: 1 }]);
    }
    setOpenTheirs(false);
  };

  const removeFromYourOffer = (itemName: string) => {
    setYourOffer(yourOffer.filter(t => t.item.name !== itemName));
  };

  const removeFromTheirOffer = (itemName: string) => {
    setTheirOffer(theirOffer.filter(t => t.item.name !== itemName));
  };

  const calculateTotal = (offer: TradeItem[]) => {
    return offer.reduce((sum, { item, quantity }) => sum + (item.value * quantity), 0);
  };

  const calculateDemandTotal = (offer: TradeItem[]) => {
    return offer.reduce((sum, { item, quantity }) => sum + (item.demand * quantity), 0);
  };

  const yourTotal = calculateTotal(yourOffer);
  const theirTotal = calculateTotal(theirOffer);
  const difference = theirTotal - yourTotal;
  const percentageDiff = yourTotal > 0 ? ((difference / yourTotal) * 100) : 0;

  // UI helpers
  const yourValueColorClass = difference < 0 ? 'text-success' : difference > 0 ? 'text-destructive' : 'text-warning';
  const theirValueColorClass = difference > 0 ? 'text-success' : difference < 0 ? 'text-destructive' : 'text-warning';
  const totalItemCount = yourOffer.reduce((c, t) => c + t.quantity, 0) + theirOffer.reduce((c, t) => c + t.quantity, 0);
  const progressPercent = Math.min((totalItemCount / 20) * 100, 100);

  const yourDemandTotal = calculateDemandTotal(yourOffer);
  const theirDemandTotal = calculateDemandTotal(theirOffer);
  const demandDifference = theirDemandTotal - yourDemandTotal;
  const demandPercentageDiff = yourDemandTotal > 0 ? ((demandDifference / yourDemandTotal) * 100) : 0;

  const getTradeStatus = () => {
    if (difference > 0) return { status: "win", text: "WIN", color: "success" };
    if (difference < 0) return { status: "loss", text: "LOSS", color: "destructive" };
    return { status: "fair", text: "FAIR", color: "warning" };
  };

  const getDemandTradeStatus = () => {
    if (demandDifference > 0) return { status: "win", text: "WIN", color: "success" };
    if (demandDifference < 0) return { status: "loss", text: "LOSS", color: "destructive" };
    return { status: "fair", text: "FAIR", color: "warning" };
  };

  const tradeStatus = getTradeStatus();
  const demandTradeStatus = getDemandTradeStatus();
  
  // Generate recommendations based on trade balance
  const yourRecommendations = useMemo(() => 
    getItemRecommendations(yourOffer, true, theirOffer), 
    [yourOffer, theirOffer]
  );
  
  const theirRecommendations = useMemo(() => 
    getItemRecommendations(theirOffer, false, yourOffer), 
    [theirOffer, yourOffer]
  );

  // Sort Your Offer so favorites appear on top while preserving original order within groups
  const sortedYourOffer = useMemo(() => {
    const fav = yourOffer.filter(({ item }) => isFavorite(item.name));
    const non = yourOffer.filter(({ item }) => !isFavorite(item.name));
    return [...fav, ...non];
  }, [yourOffer, favorites]);

  const saveTrade = () => {
    if (yourOffer.length === 0 || theirOffer.length === 0) {
      toast({
        title: "Cannot save trade",
        description: "Both sides must have at least one item",
        variant: "destructive"
      });
      return;
    }
    
    addTrade({
      yourOffer: {
        items: yourOffer.map(t => `${t.quantity}x ${t.item.name}`),
        totalValue: yourTotal
      },
      theirOffer: {
        items: theirOffer.map(t => `${t.quantity}x ${t.item.name}`),
        totalValue: theirTotal
      },
      notes: tradeNotes || undefined
    });
    
    toast({
      title: "Trade saved!",
      description: "Your trade has been saved to history",
    });
    
    // Clear the form
    setYourOffer([]);
    setTheirOffer([]);
    setTradeNotes("");
  };

  const shareTrade = () => {
    if (yourOffer.length === 0 || theirOffer.length === 0) {
      toast({
        title: "Cannot share trade",
        description: "Both sides must have at least one item",
        variant: "destructive"
      });
      return;
    }

    const tradeText = `Fisch Trade Calculator\n\nYour Offer (${yourTotal.toFixed(1)} value):\n${yourOffer.map(t => `• ${t.quantity}x ${t.item.name} (${(t.item.value * t.quantity).toFixed(1)})`).join('\n')}\n\nTheir Offer (${theirTotal.toFixed(1)} value):\n${theirOffer.map(t => `• ${t.quantity}x ${t.item.name} (${(t.item.value * t.quantity).toFixed(1)})`).join('\n')}\n\nResult: ${tradeStatus.text} (${difference > 0 ? '+' : ''}${difference.toFixed(1)})`;
    
    navigator.clipboard.writeText(tradeText);
    toast({
      title: "Trade copied to clipboard!",
      description: "Share it with your friends",
    });
  };

  const balanceTrade = () => {
    if (yourOffer.length === 0 || theirOffer.length === 0) {
      toast({
        title: "Cannot balance trade",
        description: "Both sides must have at least one item",
        variant: "destructive"
      });
      return;
    }

    const diff = Math.abs(difference);
    const suggestions = [];

    if (difference > 0) {
      // You're winning, suggest items to add to your offer
      const sortedItems = items
        .filter(item => !yourOffer.some(t => t.item.name === item.name))
        .sort((a, b) => Math.abs(a.value - diff) - Math.abs(b.value - diff))
        .slice(0, 3);
      
      suggestions.push(`You're winning by ${diff.toFixed(1)}. Consider adding:`);
      sortedItems.forEach(item => suggestions.push(`• ${item.name} (${item.value})`));
    } else if (difference < 0) {
      // You're losing, suggest items they should add
      const sortedItems = items
        .filter(item => !theirOffer.some(t => t.item.name === item.name))
        .sort((a, b) => Math.abs(a.value - diff) - Math.abs(b.value - diff))
        .slice(0, 3);
      
      suggestions.push(`You're losing by ${diff.toFixed(1)}. They should add:`);
      sortedItems.forEach(item => suggestions.push(`• ${item.name} (${item.value})`));
    } else {
      suggestions.push("Trade is perfectly balanced!");
    }

    toast({
      title: "Trade Balance Analysis",
      description: suggestions.join('\n'),
    });
  };

  const toggleYourItemExpanded = (itemName: string) => {
    setExpandedYourItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const toggleTheirItemExpanded = (itemName: string) => {
    setExpandedTheirItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const getTierColor = (tier: string) => {
    const colors: { [key: string]: string } = {
      SS: "bg-accent text-accent-foreground border-accent",
      S: "bg-primary text-primary-foreground border-primary",
      A: "bg-success text-success-foreground border-success",
      B: "bg-secondary text-secondary-foreground border-secondary",
      C: "bg-muted text-muted-foreground border-muted",
      D: "bg-border text-foreground border-border",
      F: "bg-border text-muted-foreground border-border"
    };
    return colors[tier] || colors.C;
  };

  const getDemandColor = (demand: number) => {
    if (demand >= 8) return "text-success";
    if (demand >= 5) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative text-center space-y-6">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-ocean bg-clip-text text-transparent tracking-tight">
            Fisch Trade Calculator
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            Calculate win/loss for your trades
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ItemsList />
            <TradeHistory />
            <IconLegend />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 relative">
          {/* Trade Fairness Indicator */}
          {(yourOffer.length > 0 || theirOffer.length > 0) && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <div className="bg-background border-2 border-primary rounded-full p-4 shadow-lg">
                <div className="text-center">
                  {tradeStatus.status === "win" && <TrendingUp className="h-6 w-6 text-success mx-auto mb-1" />}
                  {tradeStatus.status === "loss" && <TrendingDown className="h-6 w-6 text-destructive mx-auto mb-1" />}
                  {tradeStatus.status === "fair" && <Minus className="h-6 w-6 text-warning mx-auto mb-1" />}
                  <div className={`text-sm font-bold ${
                    tradeStatus.status === "win" ? "text-success" :
                    tradeStatus.status === "loss" ? "text-destructive" :
                    "text-warning"
                  }`}>
                    {tradeStatus.text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {difference > 0 ? "+" : ""}{difference.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Your Offer */}
          <Card 
            className={`panel-enhanced glass-card p-6 space-y-4 transition-all duration-300 ${
              yourOfferActive ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(0,206,209,0.3)] pulse-glow' : ''
            }`}
            onFocus={() => setYourOfferActive(true)}
            onBlur={() => setYourOfferActive(false)}
            onMouseEnter={() => setYourOfferActive(true)}
            onMouseLeave={() => setYourOfferActive(false)}
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-primary/20">
              <h2 className="text-3xl font-black text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Offer
              </h2>
              <div className="text-right space-y-2">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        <Coins className="h-3 w-3 text-primary" />
                        <span>Total Value</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sum of item values on your side</TooltipContent>
                  </Tooltip>
                  <div className={`text-3xl font-black value-glow ${yourValueColorClass}`}>{yourTotal.toFixed(1)}</div>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        <Flame className="h-3 w-3 text-accent" />
                        <span>Total Demand</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sum of demand (0–10 scale) on your side</TooltipContent>
                  </Tooltip>
                  <div className="text-2xl font-black demand-display">{yourDemandTotal.toFixed(1)}/10</div>
                </div>
              </div>
            </div>

            <Popover open={openYours} onOpenChange={setOpenYours}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between btn-enhanced">
                  Add Item
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput className="shimmer-placeholder" placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup heading="Boats">
                      {items.filter(i => i.category === "boat").map((item) => (
                        <CommandItem
                          key={item.name}
                          value={item.name}
                          onSelect={() => addToYourOffer(item)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTierColor(item.tier)}>
                                {item.tier}
                              </Badge>
                              <span className="text-xs text-muted-foreground">D: {item.demand}</span>
                              <span className="text-primary font-semibold">{item.value}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Rod Skins">
                      {items.filter(i => i.category === "skin").map((item) => (
                        <CommandItem
                          key={item.name}
                          value={item.name}
                          onSelect={() => addToYourOffer(item)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTierColor(item.tier)}>
                                {item.tier}
                              </Badge>
                              <span className="text-xs text-muted-foreground">D: {item.demand}</span>
                              <span className="text-primary font-semibold">{item.value}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="space-y-2 min-h-[200px]">
              {yourOffer.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No items added
                </div>
              ) : (
                sortedYourOffer.map(({ item, quantity }) => (
                  <Collapsible
                    key={item.name}
                    open={expandedYourItems.has(item.name)}
                    onOpenChange={() => toggleYourItemExpanded(item.name)}
                  >
                    <div className="bg-secondary rounded-lg border border-border hover:border-primary transition-all duration-200 animate-fade-in hover:shadow-lg">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1 flex items-center gap-3">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedYourItems.has(item.name) ? 'rotate-90' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                              <Badge className={getTierColor(item.tier)} variant="outline">{item.tier}</Badge>
                              {isFavorite(item.name) && <Star className="h-4 w-4 text-yellow-400" />}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              {item.value} × {quantity} = <span className="text-primary font-bold">{(item.value * quantity).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(item.name)}
                            className={`transition-colors ${isFavorite(item.name) ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-muted-foreground hover:bg-secondary/50'}`}
                            title={isFavorite(item.name) ? 'Unfavorite' : 'Favorite'}
                          >
                            <Star className={`h-4 w-4 ${isFavorite(item.name) ? 'text-yellow-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromYourOffer(item.name)}
                            className="hover:bg-destructive/20 hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CollapsibleContent className="px-3 pb-3 space-y-2 animate-accordion-down">
                        <div className="pl-9 space-y-1 text-sm bg-background/50 rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-semibold capitalize">{item.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Individual Value:</span>
                            <span className="font-bold text-primary">{item.value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Demand Level:</span>
                            <span className={`font-bold ${getDemandColor(item.demand)}`}>{item.demand}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rarity Tier:</span>
                            <Badge className={getTierColor(item.tier)} variant="outline">{item.tier}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="text-xs">{item.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold">{quantity}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="text-muted-foreground font-semibold">Total Contribution:</span>
                            <span className="font-black text-primary text-lg">{(item.value * quantity).toFixed(1)}</span>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))
              )}
            </div>
            
            {/* Your Recommendations */}
            <Recommendations 
              title="Recommended items to add to your offer:" 
              items={yourRecommendations}
              onAddItem={addToYourOffer}
            />
          </Card>

          {/* Their Offer */}
          <Card 
            className={`panel-enhanced glass-card p-6 space-y-4 transition-all duration-300 ${
              theirOfferActive ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(0,206,209,0.3)] pulse-glow' : ''
            }`}
            onFocus={() => setTheirOfferActive(true)}
            onBlur={() => setTheirOfferActive(false)}
            onMouseEnter={() => setTheirOfferActive(true)}
            onMouseLeave={() => setTheirOfferActive(false)}
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-primary/20">
              <h2 className="text-3xl font-black text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Their Offer
              </h2>
              <div className="text-right space-y-2">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        <Coins className="h-3 w-3 text-primary" />
                        <span>Total Value</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sum of item values on their side</TooltipContent>
                  </Tooltip>
                  <div className={`text-3xl font-black value-glow ${theirValueColorClass}`}>{theirTotal.toFixed(1)}</div>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        <Flame className="h-3 w-3 text-accent" />
                        <span>Total Demand</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sum of demand (0–10 scale) on their side</TooltipContent>
                  </Tooltip>
                  <div className="text-2xl font-black demand-display">{theirDemandTotal.toFixed(1)}/10</div>
                </div>
              </div>
            </div>

            <Popover open={openTheirs} onOpenChange={setOpenTheirs}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between btn-enhanced">
                  Add Item
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput className="shimmer-placeholder" placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup heading="Boats">
                      {items.filter(i => i.category === "boat").map((item) => (
                        <CommandItem
                          key={item.name}
                          value={item.name}
                          onSelect={() => addToTheirOffer(item)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTierColor(item.tier)}>
                                {item.tier}
                              </Badge>
                              <span className="text-xs text-muted-foreground">D: {item.demand}</span>
                              <span className="text-primary font-semibold">{item.value}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Rod Skins">
                      {items.filter(i => i.category === "skin").map((item) => (
                        <CommandItem
                          key={item.name}
                          value={item.name}
                          onSelect={() => addToTheirOffer(item)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTierColor(item.tier)}>
                                {item.tier}
                              </Badge>
                              <span className="text-xs text-muted-foreground">D: {item.demand}</span>
                              <span className="text-primary font-semibold">{item.value}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="space-y-2 min-h-[200px]">
              {theirOffer.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No items added
                </div>
              ) : (
                theirOffer.map(({ item, quantity }) => (
                  <Collapsible
                    key={item.name}
                    open={expandedTheirItems.has(item.name)}
                    onOpenChange={() => toggleTheirItemExpanded(item.name)}
                  >
                    <div className="bg-secondary rounded-lg border border-border hover:border-primary transition-all duration-200 animate-fade-in hover:shadow-lg">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1 flex items-center gap-3">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedTheirItems.has(item.name) ? 'rotate-90' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                              {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                              <Badge className={getTierColor(item.tier)} variant="outline">{item.tier}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              {item.value} × {quantity} = <span className="text-primary font-bold">{(item.value * quantity).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromTheirOffer(item.name)}
                          className="hover:bg-destructive/20 hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CollapsibleContent className="px-3 pb-3 space-y-2 animate-accordion-down">
                        <div className="pl-9 space-y-1 text-sm bg-background/50 rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-semibold capitalize">{item.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Individual Value:</span>
                            <span className="font-bold text-primary">{item.value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Demand Level:</span>
                            <span className={`font-bold ${getDemandColor(item.demand)}`}>{item.demand}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rarity Tier:</span>
                            <Badge className={getTierColor(item.tier)} variant="outline">{item.tier}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="text-xs">{item.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold">{quantity}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="text-muted-foreground font-semibold">Total Contribution:</span>
                            <span className="font-black text-primary text-lg">{(item.value * quantity).toFixed(1)}</span>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Trade Result */}
        {(yourOffer.length > 0 || theirOffer.length > 0) && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Offer Build Progress</span>
                <span className="text-xs text-muted-foreground">{totalItemCount} items</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            <Card className="panel-enhanced p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="text-xl text-muted-foreground mb-3 font-bold uppercase tracking-wider">Trade Status</div>
                
                {/* Value-based Trade Status */}
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1 font-semibold uppercase tracking-wide">By Value</div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    {tradeStatus.status === "win" && <TrendingUp className="h-8 w-8 text-success" />}
                    {tradeStatus.status === "loss" && <TrendingDown className="h-8 w-8 text-destructive" />}
                    {tradeStatus.status === "fair" && <Minus className="h-8 w-8 text-warning" />}
                    <div className="text-center">
                      <span 
                        className={`text-4xl font-black tracking-tight value-glow ${
                          tradeStatus.status === "win" ? "text-success" :
                          tradeStatus.status === "loss" ? "text-destructive" :
                          "text-warning"
                        }`}
                      >
                        {tradeStatus.text}
                      </span>
                      <div 
                        className={`text-base font-bold tracking-wide ${
                          tradeStatus.status === "win" ? "text-success" :
                          tradeStatus.status === "loss" ? "text-destructive" :
                          "text-warning"
                        }`}
                      >
                        {difference > 0 ? "+" : ""}{difference.toFixed(1)} ({percentageDiff > 0 ? "+" : ""}{percentageDiff.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demand-based Trade Status */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1 font-semibold uppercase tracking-wide">By Demand</div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    {demandTradeStatus.status === "win" && <TrendingUp className="h-8 w-8 text-success" />}
                    {demandTradeStatus.status === "loss" && <TrendingDown className="h-8 w-8 text-destructive" />}
                    {demandTradeStatus.status === "fair" && <Minus className="h-8 w-8 text-warning" />}
                    <div className="text-center">
                      <span 
                        className={`text-4xl font-black tracking-tight value-glow ${
                          demandTradeStatus.status === "win" ? "text-success" :
                          demandTradeStatus.status === "loss" ? "text-destructive" :
                          "text-warning"
                        }`}
                      >
                        {demandTradeStatus.text}
                      </span>
                      <div 
                        className={`text-base font-bold tracking-wide ${
                          demandTradeStatus.status === "win" ? "text-success" :
                          demandTradeStatus.status === "loss" ? "text-destructive" :
                          "text-warning"
                        }`}
                      >
                        {demandDifference > 0 ? "+" : ""}{demandDifference.toFixed(1)} ({demandPercentageDiff > 0 ? "+" : ""}{demandPercentageDiff.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-right">
                <div className="text-xl text-muted-foreground mb-3 font-bold uppercase tracking-wider">Summary</div>
                <div className="text-foreground space-y-2 text-lg">
                  <div>You give: <span className="text-primary font-black value-glow text-2xl">{yourTotal.toFixed(1)}</span></div>
                  <div>You get: <span className="text-primary font-black value-glow text-2xl">{theirTotal.toFixed(1)}</span></div>
                  <div className="pt-2 border-t border-border">Difference: <span className={`font-black text-2xl ${difference > 0 ? 'text-success' : difference < 0 ? 'text-destructive' : 'text-warning'}`}>{difference > 0 ? "+" : ""}{difference.toFixed(1)}</span></div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border">
              <div className="flex-1">
                <textarea
                  placeholder="Add notes about this trade (optional)"
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm md:text-base resize-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  rows={2}
                  value={tradeNotes}
                  onChange={(e) => setTradeNotes(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 md:w-auto">
                <Button 
                  className="gap-2 text-sm md:text-base py-2 md:py-3 btn-enhanced font-bold" 
                  onClick={saveTrade}
                  disabled={yourOffer.length === 0 || theirOffer.length === 0}
                >
                  <Save className="h-4 w-4" />
                  Save Trade
                </Button>
                <Button 
                  variant="outline"
                  className="gap-2 text-sm md:text-base py-2 md:py-3 btn-enhanced font-bold" 
                  onClick={shareTrade}
                  disabled={yourOffer.length === 0 || theirOffer.length === 0}
                >
                  <Share2 className="h-4 w-4" />
                  Share Trade
                </Button>
                <Button 
                  variant="secondary"
                  className="gap-2 text-sm md:text-base py-2 md:py-3 btn-enhanced font-bold" 
                  onClick={balanceTrade}
                  disabled={yourOffer.length === 0 || theirOffer.length === 0}
                >
                  <Scale className="h-4 w-4" />
                  Balance Trade
                </Button>
              </div>
            </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
