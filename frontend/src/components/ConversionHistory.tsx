import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";
import type { ConversionHistory } from "@/types";

type ConversionHistoryListProps = {
  history: ConversionHistory[];
  onReplay: (item: ConversionHistory) => void;
};

export function ConversionHistoryList({
  history,
  onReplay,
}: ConversionHistoryListProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          Conversion History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.text}</p>
                      <p className="text-xs text-muted-foreground">
                        Voice: {item.voiceName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReplay(item)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>Rate: {item.rate}x</span>
                    <span>Pitch: {item.pitch}</span>
                    <span>Volume: {item.volume}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
