import { Badge } from "@/components/common";
import type { TradeStatus } from "@/types";
import { TRADE_STATUS_META } from "./meta";

export function TradeStatusBadge({ status }: { status: TradeStatus }) {
  const meta = TRADE_STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}
