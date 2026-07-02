"use client";

import { ArrowLeft, ArrowRight, Home, MapPin, MessageCircle, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CheckoutField,
  CheckoutFormSection,
  checkoutActionsClassName,
  checkoutFieldGridClassName,
  checkoutInputClassName,
  checkoutNoticeClassName,
  CheckoutSelect,
  CheckoutStepHeader,
  CheckoutStepShell,
  RequiredMark,
} from "@/features/checkout/components/checkoutUi";
import {
  getDistrictsForProvince,
  getProvincesForDepartment,
  hasPredefinedDistricts,
  PERU_DEPARTMENTS,
} from "@/features/checkout/data/peru-locations";
import type { CheckoutShippingForm, DeliveryType } from "@/features/checkout/types";

interface CheckoutShippingStepProps {
  form: CheckoutShippingForm;
  onChange: (form: CheckoutShippingForm) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const DELIVERY_OPTIONS: {
  value: DeliveryType;
  label: string;
  description: string;
  icon: typeof Home;
}[] = [
  {
    value: "home",
    label: "Entrega a domicilio",
    description: "Recibe tu pedido en la dirección que indiques.",
    icon: Home,
  },
  {
    value: "pickup",
    label: "Recojo en tienda / almacén",
    description: "Puedes recoger tu pedido en nuestro almacén.",
    icon: Store,
  },
];

export default function CheckoutShippingStep({
  form,
  onChange,
  onBack,
  onSubmit,
}: CheckoutShippingStepProps) {
  const provinces = getProvincesForDepartment(form.department);
  const districts = getDistrictsForProvince(form.department, form.province);
  const showDistrictSelect = hasPredefinedDistricts(form.department, form.province);
  const isHomeDelivery = form.deliveryType === "home";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const updateField = <K extends keyof CheckoutShippingForm>(
    key: K,
    value: CheckoutShippingForm[K]
  ) => {
    onChange({ ...form, [key]: value });
  };

  const handleDepartmentChange = (department: string) => {
    const nextProvinces = getProvincesForDepartment(department);
    const province = nextProvinces[0] ?? "";
    const nextDistricts = getDistrictsForProvince(department, province);

    onChange({
      ...form,
      department,
      province,
      district: nextDistricts[0] ?? "",
    });
  };

  const handleProvinceChange = (province: string) => {
    const nextDistricts = getDistrictsForProvince(form.department, province);

    onChange({
      ...form,
      province,
      district: nextDistricts[0] ?? "",
    });
  };

  const footer = (
    <div className={checkoutActionsClassName}>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="h-12 rounded-xl border-[#d7dce5] px-6 text-[#17245c] hover:bg-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>
      <Button
        type="submit"
        form="checkout-shipping-form"
        className="h-12 rounded-xl bg-[#17245c] px-10 text-[15px] font-bold hover:bg-[#111a45]"
      >
        Continuar
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <CheckoutStepShell footer={footer}>
      <form id="checkout-shipping-form" onSubmit={handleSubmit} className="space-y-10">
        <CheckoutStepHeader
          icon={MapPin}
          title="Información de envío"
          subtitle="¿Dónde lo entregamos? Selecciona el tipo de entrega y completa la dirección."
        />

        <CheckoutFormSection title="Tipo de entrega">
          <div className="grid gap-4 lg:grid-cols-2">
            {DELIVERY_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = form.deliveryType === option.value;

              return (
                <label
                  key={option.value}
                  className={[
                    "flex min-h-[108px] cursor-pointer gap-4 rounded-2xl border p-5 transition",
                    isSelected
                      ? "border-[#17245c] bg-[#f3f8ff] ring-1 ring-[#17245c]"
                      : "border-[#e3e7ee] bg-white hover:border-[#c5ccd8]",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => updateField("deliveryType", option.value)}
                    className="mt-1 h-4 w-4 accent-[#17245c]"
                  />
                  <span className="flex min-w-0 gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2f7] text-[#17245c]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-[#17245c]">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-[#8b93a1]">
                        {option.description}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </CheckoutFormSection>

        {isHomeDelivery ? (
          <CheckoutFormSection
            title="Dirección de entrega"
            description="Indica la ubicación exacta donde deseas recibir tu pedido."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <CheckoutField label={<>Departamento <RequiredMark /></>} htmlFor="department">
                  <CheckoutSelect
                    id="department"
                    required
                    value={form.department}
                    onChange={(event) => handleDepartmentChange(event.target.value)}
                  >
                    {PERU_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </CheckoutSelect>
                </CheckoutField>

                <CheckoutField label={<>Provincia <RequiredMark /></>} htmlFor="province">
                  <CheckoutSelect
                    id="province"
                    required
                    value={form.province}
                    onChange={(event) => handleProvinceChange(event.target.value)}
                    disabled={provinces.length === 0}
                  >
                    {provinces.length === 0 ? (
                      <option value="">Sin provincias disponibles</option>
                    ) : (
                      provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))
                    )}
                  </CheckoutSelect>
                </CheckoutField>

                <CheckoutField label={<>Distrito <RequiredMark /></>} htmlFor="district">
                  {showDistrictSelect ? (
                    <CheckoutSelect
                      id="district"
                      required
                      value={form.district}
                      onChange={(event) => updateField("district", event.target.value)}
                    >
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </CheckoutSelect>
                  ) : (
                    <input
                      id="district"
                      type="text"
                      required
                      value={form.district}
                      onChange={(event) => updateField("district", event.target.value)}
                      className={checkoutInputClassName}
                      placeholder="Escribe tu distrito"
                    />
                  )}
                </CheckoutField>
              </div>

              <CheckoutField label={<>Dirección <RequiredMark /></>} htmlFor="address">
                <input
                  id="address"
                  type="text"
                  required
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  className={checkoutInputClassName}
                  placeholder="Av. Industrial 123, Parque Industrial"
                />
              </CheckoutField>

              <div className={checkoutFieldGridClassName}>
                <CheckoutField
                  label={
                    <>
                      Referencia <span className="font-normal text-[#8b93a1]">(opcional)</span>
                    </>
                  }
                  htmlFor="reference"
                >
                  <input
                    id="reference"
                    type="text"
                    value={form.reference}
                    onChange={(event) => updateField("reference", event.target.value)}
                    className={checkoutInputClassName}
                    placeholder="Altura de la puerta 3, al costado del almacén principal"
                  />
                </CheckoutField>

                <CheckoutField
                  label={
                    <>
                      Código postal <span className="font-normal text-[#8b93a1]">(opcional)</span>
                    </>
                  }
                  htmlFor="postalCode"
                >
                  <input
                    id="postalCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.postalCode}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                    className={checkoutInputClassName}
                    placeholder="15823"
                  />
                </CheckoutField>
              </div>
            </div>
          </CheckoutFormSection>
        ) : (
          <div className="rounded-2xl border border-[#e8ebf0] bg-[#f8fafc] px-6 py-5 text-[15px] leading-relaxed text-[#5b6472]">
            Podrás recoger tu pedido en nuestro almacén. Te enviaremos la ubicación y horarios de
            atención una vez confirmado el pedido.
          </div>
        )}

        <CheckoutFormSection title="Contacto para la entrega">
          <CheckoutField
            label={<>Teléfono de contacto para la entrega <RequiredMark /></>}
            htmlFor="contactPhone"
          >
            <div className="relative max-w-xl">
              <MessageCircle className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#25d366]" />
              <input
                id="contactPhone"
                type="tel"
                required
                value={form.contactPhone}
                onChange={(event) => updateField("contactPhone", event.target.value)}
                className={`${checkoutInputClassName} pl-11`}
                placeholder="987 654 321"
              />
            </div>
          </CheckoutField>
        </CheckoutFormSection>

        <div className={checkoutNoticeClassName}>
          <span className="font-semibold">Importante:</span>{" "}
          {isHomeDelivery
            ? "Asegúrate de que alguien pueda recibir el pedido o brindar acceso al lugar indicado."
            : "Te contactaremos para coordinar la fecha y hora de recojo en almacén."}
        </div>
      </form>
    </CheckoutStepShell>
  );
}
