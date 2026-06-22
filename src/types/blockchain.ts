export interface BlockPerformer {
  id: string;
  fullName: string;
  email: string;
}

export interface BlockchainBlock {
  id: string;
  blockIndex: number;
  timestamp: string;
  orderId: string;
  action: string;
  performedBy: string;
  performedByUser?: BlockPerformer | null;
  data: Record<string, unknown>;
  previousHash: string;
  hash: string;
  createdAt: string;
}

export interface BlockchainValidationResult {
  valid: boolean;
}

export interface DeleteOrderHistoryResult {
  message: string;
  orderId: string;
  deletedBlocks: number;
}

export interface OrderItemSnapshot {
  itemType: string;
  productId: string | null;
  serviceId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderSnapshot {
  total: number;
  notes: string | null;
  shippingAddress: string | null;
  contactPhone: string | null;
  items: OrderItemSnapshot[];
}

export interface OrderVerificationResult {
  orderId: string;
  chainValid: boolean;
  orderExists: boolean;
  hasCreatedBlock: boolean;
  orderTampered: boolean;
  differences: string[];
  snapshot?: OrderSnapshot;
  current?: OrderSnapshot;
}

export const ORDER_DIFFERENCE_LABELS: Record<string, string> = {
  total: "Total",
  items: "Productos / precios",
  notes: "Notas",
  shippingAddress: "Dirección de envío",
  contactPhone: "Teléfono de contacto",
};

export const BLOCKCHAIN_ACTION_LABELS: Record<string, string> = {
  GENESIS: "Génesis",
  CREATED: "Orden creada",
  STATUS_CHANGED: "Cambio de estado",
  DELETED: "Orden eliminada",
};

export const BLOCKCHAIN_ACTION_STYLES: Record<
  string,
  { badge: string; accent: string; dot: string }
> = {
  GENESIS: {
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    accent: "border-violet-500 bg-violet-50",
    dot: "bg-violet-500 ring-violet-100",
  },
  CREATED: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    accent: "border-emerald-500 bg-emerald-50",
    dot: "bg-emerald-500 ring-emerald-100",
  },
  STATUS_CHANGED: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    accent: "border-blue-500 bg-blue-50",
    dot: "bg-blue-500 ring-blue-100",
  },
  DELETED: {
    badge: "bg-red-100 text-red-800 border-red-200",
    accent: "border-red-500 bg-red-50",
    dot: "bg-red-500 ring-red-100",
  },
};

export const DEFAULT_BLOCK_STYLE = {
  badge: "bg-slate-100 text-slate-800 border-slate-200",
  accent: "border-slate-400 bg-slate-50",
  dot: "bg-slate-400 ring-slate-100",
};
