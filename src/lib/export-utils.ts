import { TradeRecord } from "@/hooks/use-trade-history";

// Function to export a single trade as CSV
export function exportTradeAsCSV(trade: TradeRecord): void {
  const headers = ["Date", "Your Items", "Your Total Value", "Their Items", "Their Total Value", "Notes"];
  
  const data = [
    new Date(trade.date).toLocaleString(),
    trade.yourOffer.items.join("; "),
    trade.yourOffer.totalValue.toString(),
    trade.theirOffer.items.join("; "),
    trade.theirOffer.totalValue.toString(),
    trade.notes || ""
  ];
  
  const csvContent = [
    headers.join(","),
    data.map(item => `"${item.replace(/"/g, '""')}"`).join(",")
  ].join("\n");
  
  downloadCSV(csvContent, `trade-${trade.id.slice(0, 8)}.csv`);
}

// Function to export multiple trades as CSV
export function exportTradeHistoryAsCSV(trades: TradeRecord[]): void {
  if (trades.length === 0) return;
  
  const headers = ["Date", "Your Items", "Your Total Value", "Their Items", "Their Total Value", "Notes"];
  
  const rows = trades.map(trade => {
    return [
      new Date(trade.date).toLocaleString(),
      trade.yourOffer.items.join("; "),
      trade.yourOffer.totalValue.toString(),
      trade.theirOffer.items.join("; "),
      trade.theirOffer.totalValue.toString(),
      trade.notes || ""
    ].map(item => `"${item.replace(/"/g, '""')}"`).join(",");
  });
  
  const csvContent = [
    headers.join(","),
    ...rows
  ].join("\n");
  
  downloadCSV(csvContent, "trade-history.csv");
}

// Helper function to trigger download
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}