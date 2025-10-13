import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export const IconLegend = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full sm:w-auto btn-enhanced">
          <Info className="h-4 w-4" />
          Icon Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] panel-enhanced">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-wide">Icon Legend</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <span className="text-3xl">🚤</span>
            <div>
              <div className="font-semibold text-foreground">Boat</div>
              <div className="text-sm text-muted-foreground">Indicates a boat item</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <span className="text-3xl">🎣</span>
            <div>
              <div className="font-semibold text-foreground">Rod Skin</div>
              <div className="text-sm text-muted-foreground">Indicates a rod skin item</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <span className="text-3xl">⚠️</span>
            <div>
              <div className="font-semibold text-destructive">Mass Duped</div>
              <div className="text-sm text-muted-foreground">Item has been mass duplicated</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
