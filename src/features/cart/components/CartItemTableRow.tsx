import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import {
  getCartItemCode,
  getProductStockBadge,
  getServiceAvailabilityBadge,
} from "@/features/cart/utils/cartDisplay";
import { getLineSubtotal } from "@/features/cart/utils/cartTotals";
import {
  CartItem,
  CartItemType,
  formatPrice,
  getCartLineItem,
} from "@/features/products/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";

interface CartItemTableRowProps {
  item: CartItem;
  updating: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function QuantityControl({
  quantity,
  updating,
  stockLimit,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  quantity: number;
  updating: boolean;
  stockLimit: number | null;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="mx-auto flex w-[108px] flex-col items-center">
      <div className="inline-flex h-10 w-full items-center overflow-hidden rounded-md border border-[#d7dce5] bg-white">
        <button
          type="button"
          onClick={onDecrease}
          disabled={updating || quantity <= 1}
          className="flex h-full w-9 shrink-0 items-center justify-center text-[#17245c] transition hover:bg-slate-50 disabled:opacity-40"
          aria-label="Disminuir cantidad"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-full flex-1 items-center justify-center border-x border-[#d7dce5] text-sm font-semibold text-[#17245c]">
          {quantity}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={updating || (stockLimit !== null && quantity >= stockLimit)}
          className="flex h-full w-9 shrink-0 items-center justify-center text-[#17245c] transition hover:bg-slate-50 disabled:opacity-40"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={updating}
        className="mt-2 text-sm font-medium text-[#2563eb] hover:underline disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}

export default function CartItemTableRow({
  item,
  updating,
  onQuantityChange,
  onRemove,
}: CartItemTableRowProps) {
  const line = getCartLineItem(item);
  if (!line) return null;

  const isService = item.itemType === CartItemType.SERVICE;
  const code = getCartItemCode(item);
  const subtotal = getLineSubtotal(item);
  const excludesIgv = !isService && item.product?.priceIncludesIgv === false;
  const imageUrl = getUploadImageUrl(line.imageUrl);
  const stockBadge =
    !isService && item.product
      ? getProductStockBadge(item.product.stock)
      : item.service
        ? getServiceAvailabilityBadge(item.service.isActive)
        : null;

  return (
    <tr className="border-b border-[#e8ebf0] last:border-b-0">
      <td className="py-5 pl-5 pr-4 align-top">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-[#e8ebf0] bg-[#f8fafc]">
            {imageUrl ? (
              <Image src={imageUrl} alt={line.name} fill className="object-cover" sizes="72px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                Sin imagen
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold leading-5 text-[#17245c]">{line.name}</h3>
            <p className="mt-1 text-[13px] text-[#8b93a1]">Código: {code}</p>
            {stockBadge ? (
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stockBadge.className}`}
              >
                {stockBadge.label}
              </span>
            ) : null}

            {isService ? (
              <div className="mt-3 space-y-1 text-[13px] leading-5 text-[#6b7280]">
                {item.service?.description ? (
                  <p>
                    <span className="font-semibold text-[#4b5563]">Tipo de servicio:</span>{" "}
                    {item.service.description}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-[#4b5563]">Cantidad de equipos:</span>{" "}
                  {item.quantity} unidad{item.quantity === 1 ? "" : "es"}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </td>

      <td className="w-[118px] px-2 py-5 align-top text-center">
        <p className="text-[15px] font-semibold leading-5 text-[#17245c]">
          {formatPrice(line.price)}
        </p>
        {isService ? (
          <p className="mt-1 text-[12px] leading-4 text-[#8b93a1]">por equipo</p>
        ) : (
          <p className="mt-1 text-[12px] leading-4 text-transparent select-none" aria-hidden="true">
            &nbsp;
          </p>
        )}
      </td>

      <td className="w-[136px] px-2 py-5 align-top">
        <QuantityControl
          quantity={item.quantity}
          updating={updating}
          stockLimit={line.stockLimit}
          onDecrease={() => onQuantityChange(item.quantity - 1)}
          onIncrease={() => onQuantityChange(item.quantity + 1)}
          onRemove={onRemove}
        />
      </td>

      <td className="w-[108px] py-5 pl-2 pr-5 align-top text-right">
        <p className="text-[15px] font-bold leading-5 text-[#d71920]">{formatPrice(subtotal)}</p>
        {excludesIgv ? (
          <p className="mt-1 text-[11px] font-medium text-[#8b93a1]">+ IGV al total</p>
        ) : null}
      </td>
    </tr>
  );
}
