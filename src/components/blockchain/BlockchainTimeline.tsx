import { Blocks } from "lucide-react";

import type { BlockchainBlock } from "@/types/blockchain";
import {
  BLOCKCHAIN_ACTION_STYLES,
  DEFAULT_BLOCK_STYLE,
} from "@/types/blockchain";
import { BlockCard } from "./BlockCard";

interface BlockchainTimelineProps {
  blocks: BlockchainBlock[];
  showOrderId?: boolean;
  emptyMessage?: string;
}

export function BlockchainTimeline({
  blocks,
  showOrderId = false,
  emptyMessage = "No hay bloques registrados.",
}: BlockchainTimelineProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Blocks className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 max-w-xs">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {blocks.map((block, index) => {
        const styles = BLOCKCHAIN_ACTION_STYLES[block.action] ?? DEFAULT_BLOCK_STYLE;
        const isLast = index === blocks.length - 1;

        return (
          <div key={block.id} className="relative flex gap-4 sm:gap-6 pb-8 last:pb-0">
            {/* Línea vertical de la cadena */}
            {!isLast && (
              <div
                className="absolute left-[15px] sm:left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100"
                aria-hidden
              />
            )}

            {/* Nodo del bloque */}
            <div className="relative z-10 shrink-0 pt-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-4 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md ${styles.dot}`}
              >
                {block.blockIndex}
              </div>
            </div>

            {/* Tarjeta */}
            <div className="flex-1 min-w-0">
              <BlockCard block={block} showOrderId={showOrderId} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
