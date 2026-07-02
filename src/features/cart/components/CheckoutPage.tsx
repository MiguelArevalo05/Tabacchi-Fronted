"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import StorePageShell from "@/components/layout/StorePageShell";
import { Toast } from "@/components/ui/toast";
import { updateAccountProfile } from "@/features/account/services/accountService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CheckoutConfirmStep from "@/features/checkout/components/CheckoutConfirmStep";
import CheckoutCustomerStep from "@/features/checkout/components/CheckoutCustomerStep";
import CheckoutOrderSuccess from "@/features/checkout/components/CheckoutOrderSuccess";
import CheckoutPaymentStep from "@/features/checkout/components/CheckoutPaymentStep";
import CheckoutShippingStep from "@/features/checkout/components/CheckoutShippingStep";
import CheckoutStepper from "@/features/checkout/components/CheckoutStepper";
import CheckoutSummarySidebar from "@/features/checkout/components/CheckoutSummarySidebar";
import OrderSummarySidebar from "@/features/checkout/components/OrderSummarySidebar";
import {
  DocumentType,
  type CheckoutFormState,
  type CheckoutStep,
} from "@/features/checkout/types";
import { joinFullName, splitFullName } from "@/features/checkout/utils/name";
import { DEFAULT_PAYMENT_FORM } from "@/features/checkout/utils/payment";
import { getOrderSummaryFromCart, getOrderSummaryFromOrder } from "@/features/checkout/utils/orderSummary";
import {
  DEFAULT_SHIPPING_FORM,
  formatShippingAddress,
} from "@/features/checkout/utils/shipping";
import { validatePaymentForm } from "@/features/checkout/utils/payment";
import { useCart } from "@/features/cart/hooks/useCart";
import { createOrder } from "@/features/cart/services/orderService";
import type { EcommerceOrder } from "@/features/products/types/ecommerce";

const SUPPORT_PHONE = "987 654 321";

const INITIAL_FORM: CheckoutFormState = {
  customer: {
    firstName: "",
    lastName: "",
    documentType: DocumentType.DNI,
    documentNumber: "",
    email: "",
    phone: "",
  },
  shipping: { ...DEFAULT_SHIPPING_FORM },
  payment: { ...DEFAULT_PAYMENT_FORM },
  orderNotes: "",
};

function CheckoutPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-[#f3f5f9]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-10 xl:px-12">
        {children}
      </div>
    </div>
  );
}

function CheckoutBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-[#8b93a1]">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/landing" className="hover:text-[#17245c]">
            Inicio
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/carrito" className="hover:text-[#17245c]">
            Carrito de compras
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="font-medium text-[#17245c]">Generar pedido</li>
      </ol>
    </nav>
  );
}

export default function CheckoutPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [completedOrder, setCompletedOrder] = useState<EcommerceOrder | null>(null);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const isSuccessView = completedOrder !== null;
  const isInitialStepRender = useRef(true);

  useEffect(() => {
    if (isInitialStepRender.current) {
      isInitialStepRender.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentStep]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && cart && cart.items.length === 0 && !isSuccessView) {
      router.push("/carrito");
    }
  }, [cart, user, authLoading, router, isSuccessView]);

  useEffect(() => {
    if (!user) return;

    const { firstName, lastName } = splitFullName(user.fullName);

    setForm((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        documentType: user.documentType ?? DocumentType.DNI,
        documentNumber: user.documentNumber || "",
      },
      shipping: {
        ...prev.shipping,
        address: user.shippingAddress || prev.shipping.address,
        contactPhone: user.phone || prev.shipping.contactPhone,
      },
    }));
  }, [user]);

  const handleSaveCustomerStep = async () => {
    setSavingCustomer(true);
    try {
      await updateAccountProfile({
        fullName: joinFullName(form.customer.firstName, form.customer.lastName),
        phone: form.customer.phone.trim(),
        documentType: form.customer.documentType,
        documentNumber: form.customer.documentNumber.trim(),
      });
      await refreshUser();
      setForm((prev) => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          contactPhone: prev.shipping.contactPhone || prev.customer.phone,
        },
      }));
      setCurrentStep(2);
    } catch {
      setToast({
        type: "error",
        message: "No se pudieron guardar tus datos. Revisa los campos e intenta de nuevo.",
      });
    } finally {
      setSavingCustomer(false);
    }
  };

  const handleConfirmOrder = async () => {
    const paymentValidationError = validatePaymentForm(form.payment);
    if (paymentValidationError) {
      setToast({ type: "error", message: paymentValidationError });
      setCurrentStep(3);
      return;
    }

    const paymentMethod = form.payment.method;
    if (!paymentMethod) {
      setToast({ type: "error", message: "Selecciona un método de pago." });
      setCurrentStep(3);
      return;
    }

    setSubmittingOrder(true);
    try {
      const order = await createOrder({
        shippingAddress: formatShippingAddress(form.shipping),
        contactPhone: form.shipping.contactPhone.trim(),
        paymentMethod,
        notes: form.orderNotes.trim() || undefined,
        paymentProof: form.payment.proofFile,
      });
      await refreshCart();
      setCompletedOrder(order);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setToast({
        type: "error",
        message: "No se pudo crear el pedido. Verifica tu carrito e intenta de nuevo.",
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (authLoading || !user || (!cart && !isSuccessView)) {
    return (
      <StorePageShell showTrustBadges={false}>
        <CheckoutPageLayout>
          <p className="py-16 text-[#8b93a1]">Cargando checkout...</p>
        </CheckoutPageLayout>
      </StorePageShell>
    );
  }

  if (isSuccessView && completedOrder) {
    return (
      <StorePageShell>
        <CheckoutPageLayout>
          <CheckoutBreadcrumb />
          <div className="mt-8">
            <CheckoutStepper currentStep={4} allStepsCompleted />
          </div>
          <div className="mt-8 grid w-full gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
            <div className="min-w-0 w-full">
              <CheckoutOrderSuccess
                order={completedOrder}
                form={form}
                supportPhone={form.customer.phone || SUPPORT_PHONE}
              />
            </div>
            <OrderSummarySidebar
              summary={getOrderSummaryFromOrder(completedOrder)}
              detailHref={`/cuenta/ordenes/${completedOrder.id}`}
            />
          </div>
        </CheckoutPageLayout>
      </StorePageShell>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <StorePageShell>
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <CheckoutPageLayout>
        <CheckoutBreadcrumb />

        <h1 className="mt-4 text-[30px] font-black text-[#17245c] sm:text-[34px]">
          Generar pedido
        </h1>

        <div className="mt-8">
          <CheckoutStepper currentStep={currentStep} />
        </div>

        <div className="mt-8 grid w-full gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
          <div className="min-w-0 w-full">
            {currentStep === 1 ? (
              <CheckoutCustomerStep
                form={form.customer}
                loading={savingCustomer}
                onChange={(customer) => setForm((prev) => ({ ...prev, customer }))}
                onSubmit={handleSaveCustomerStep}
              />
            ) : null}

            {currentStep === 2 ? (
              <CheckoutShippingStep
                form={form.shipping}
                onChange={(shipping) => setForm((prev) => ({ ...prev, shipping }))}
                onBack={() => setCurrentStep(1)}
                onSubmit={() => setCurrentStep(3)}
              />
            ) : null}

            {currentStep === 3 ? (
              <CheckoutPaymentStep
                form={form.payment}
                orderTotal={getOrderSummaryFromCart(cart).breakdown.total}
                onChange={(payment) => setForm((prev) => ({ ...prev, payment }))}
                onBack={() => setCurrentStep(2)}
                onSubmit={() => setCurrentStep(4)}
              />
            ) : null}

            {currentStep === 4 ? (
              <CheckoutConfirmStep
                form={form}
                loading={submittingOrder}
                onEditStep={setCurrentStep}
                onBack={() => setCurrentStep(3)}
                onSubmit={handleConfirmOrder}
                onOrderNotesChange={(orderNotes) =>
                  setForm((prev) => ({ ...prev, orderNotes }))
                }
              />
            ) : null}
          </div>

          <CheckoutSummarySidebar cart={cart} />
        </div>
      </CheckoutPageLayout>
    </StorePageShell>
  );
}
