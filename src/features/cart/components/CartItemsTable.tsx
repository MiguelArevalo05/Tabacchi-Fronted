import { CartItem } from "@/features/products/types/ecommerce";

import CartItemMobileRow from "./CartItemMobileRow";
import CartItemTableRow from "./CartItemTableRow";

interface CartItemsTableProps {
  items: CartItem[];
  updatingId: string | null;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItemsTable({
  items,
  updatingId,
  onQuantityChange,
  onRemove,
}: CartItemsTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#e8ebf0] lg:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col />
            <col className="w-[118px]" />
            <col className="w-[136px]" />
            <col className="w-[108px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#e8ebf0] bg-[#f8fafc]">
              <th className="px-5 py-3.5 text-left text-[13px] font-semibold text-[#8b93a1]">
                Producto / Servicio
              </th>
              <th className="px-2 py-3.5 text-center text-[13px] font-semibold text-[#8b93a1]">
                Precio unitario
              </th>
              <th className="px-2 py-3.5 text-center text-[13px] font-semibold text-[#8b93a1]">
                Cantidad
              </th>
              <th className="px-5 py-3.5 text-right text-[13px] font-semibold text-[#8b93a1]">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((item) => (
              <CartItemTableRow
                key={item.id}
                item={item}
                updating={updatingId === item.id}
                onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e8ebf0] bg-white lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="px-4">
            <CartItemMobileRow
              item={item}
              updating={updatingId === item.id}
              onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
              onRemove={() => onRemove(item.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
