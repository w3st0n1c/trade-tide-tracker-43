import { useState, useMemo } from "react";
import { Item, items } from "@/data/items";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, X, TrendingUp, TrendingDown, Minus, List, Save } from "lucide-react";
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
  const { addTrade } = useTradeHistory();

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

  const yourTotal = calculateTotal(yourOffer);
  const theirTotal = calculateTotal(theirOffer);
  const difference = theirTotal - yourTotal;
  const percentageDiff = yourTotal > 0 ? ((difference / yourTotal) * 100) : 0;

  const getTradeStatus = () => {
    if (difference > 0) return { status: "win", text: "WIN", color: "success" };
    if (difference < 0) return { status: "loss", text: "LOSS", color: "destructive" };
    return { status: "fair", text: "FAIR", color: "warning" };
  };

  const tradeStatus = getTradeStatus();
  
  // Generate recommendations based on trade balance
  const yourRecommendations = useMemo(() => 
    getItemRecommendations(yourOffer, true, theirOffer), 
    [yourOffer, theirOffer]
  );
  
  const theirRecommendations = useMemo(() => 
    getItemRecommendations(theirOffer, false, yourOffer), 
    [theirOffer, yourOffer]
  );

  const saveTrade = () => {
    if (yourOffer.length === 0 || theirOffer.length === 0) return;
    
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
    
    // Clear the form
    setYourOffer([]);
    setTheirOffer([]);
    setTradeNotes("");
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
          <Card className="panel-enhanced p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground tracking-wide">Your Offer</h2>
              <div className="text-right">
                <div className="text-sm text-muted-foreground font-medium">Total Value</div>
                <div className="text-2xl font-bold text-primary value-glow">{yourTotal.toFixed(1)}</div>
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
                  <CommandInput placeholder="Search items..." />
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
                yourOffer.map(({ item, quantity }) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                        {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.value} × {quantity} = {(item.value * quantity).toFixed(1)} | Demand: {item.demand}/10
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTierColor(item.tier)}>{item.tier}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromYourOffer(item.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
          <Card className="panel-enhanced p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground tracking-wide">Their Offer</h2>
              <div className="text-right">
                <div className="text-sm text-muted-foreground font-medium">Total Value</div>
                <div className="text-2xl font-bold text-primary value-glow">{theirTotal.toFixed(1)}</div>
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
                  <CommandInput placeholder="Search items..." />
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
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {item.name} {item.category === "boat" ? "🚤" : "🎣"}
                        {item.status.toLowerCase().includes("mass duped") && " ⚠️"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.value} × {quantity} = {(item.value * quantity).toFixed(1)} | Demand: {item.demand}/10
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTierColor(item.tier)}>{item.tier}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromTheirOffer(item.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Trade Result */}
        {(yourOffer.length > 0 || theirOffer.length > 0) && (
          <Card className="panel-enhanced p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="text-lg text-muted-foreground mb-2 font-medium">Trade Status</div>
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
                      className={`text-lg font-bold tracking-wide ${
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
              
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <textarea
                  placeholder="Add notes about this trade (optional)"
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm md:text-base resize-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  rows={2}
                  value={tradeNotes}
                  onChange={(e) => setTradeNotes(e.target.value)}
                />
                <Button 
                  className="gap-2 text-sm md:text-base py-2 md:py-3 btn-enhanced" 
                  onClick={saveTrade}
                  disabled={yourOffer.length === 0 || theirOffer.length === 0}
                >
                  <Save className="h-4 w-4" />
                  Save Trade
                </Button>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-lg text-muted-foreground mb-2 font-medium">Value Difference</div>
                <div className="text-4xl font-bold text-primary value-glow">
                  {difference > 0 ? "+" : ""}{difference.toFixed(1)}
                </div>
                <div className="text-lg text-muted-foreground mt-1 font-medium">
                  ({percentageDiff > 0 ? "+" : ""}{percentageDiff.toFixed(1)}%)
                </div>
              </div>

              <div className="flex-1 text-center md:text-right">
                <div className="text-lg text-muted-foreground mb-2 font-medium">Summary</div>
                <div className="text-foreground space-y-1">
                  <div>You give: <span className="text-primary font-bold value-glow">{yourTotal.toFixed(1)}</span></div>
                  <div>You get: <span className="text-primary font-bold value-glow">{theirTotal.toFixed(1)}</span></div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
