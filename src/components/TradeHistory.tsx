import { useState } from "react";
import { useTradeHistory, TradeRecord } from "@/hooks/use-trade-history";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, Trash2, X, Download, FileDown } from "lucide-react";
import { exportTradeAsCSV, exportTradeHistoryAsCSV } from "@/lib/export-utils";

export const TradeHistory = () => {
  const { tradeHistory, removeTrade, clearHistory } = useTradeHistory();
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 btn-enhanced">
          <History className="h-4 w-4" />
          Trade History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] panel-enhanced">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-2xl font-bold tracking-wide">
            <span>Trade History</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 flex-1 sm:flex-auto btn-enhanced" 
                disabled={tradeHistory.length === 0}
                onClick={() => exportTradeHistoryAsCSV(tradeHistory)}
              >
                <FileDown className="h-4 w-4" />
                Export All
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1 flex-1 sm:flex-auto btn-enhanced" disabled={tradeHistory.length === 0}>
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your entire trade history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory}>Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {tradeHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trade history yet. Complete a trade to record it here.
            </div>
          ) : (
            <div className="space-y-4">
              {tradeHistory.map((trade) => (
                <Card key={trade.id} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                      <span>Trade on {new Date(trade.date).toLocaleDateString()}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(trade.date).toLocaleTimeString()}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Value: Your {trade.yourOffer.totalValue} ↔ Their {trade.theirOffer.totalValue}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Your Offer:</h4>
                        <ul className="text-sm">
                          {trade.yourOffer.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Their Offer:</h4>
                        <ul className="text-sm">
                          {trade.theirOffer.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {trade.notes && (
                      <div className="mt-2">
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm">{trade.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 justify-end">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => exportTradeAsCSV(trade)}
                        title="Export trade"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeTrade(trade.id)}
                        title="Remove trade"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};