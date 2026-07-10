import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";
import type { BagiFormData } from "@/wizard/bagiFormSchema";
import { Section1Header } from "@/wizard/Section1Header";
import { Section2Members } from "@/wizard/Section2Members";
import { Section3Items } from "@/wizard/Section3Items";
import { useCreateBagi } from "@/hooks/useCreateBagi";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { useUpdateBagi } from "@/hooks/useUpdateBagi";
import { userbagiApi } from "@/api/userbagiApi";
import { itemApi } from "@/api/itemApi";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const DEFAULT_VALUES: BagiFormData = {
  name: "",
  inputMode: "form",
  showTaxService: false,
  members: [],
  items: [],
};

const BagiFormPage = () => {
  const navigate = useNavigate();
  const { bagiId } = useParams<{ bagiId: string }>();
  const isEdit = !!bagiId;

  const form = useForm<BagiFormData>({
    resolver: zodResolver(bagiFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { data: existing, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

  useEffect(() => {
    if (existing && isEdit) {
      form.reset({
        name: existing.name,
        inputMode: "form",
        showTaxService: existing.items.some((i) => i.includeService || i.includeTax),
        members: existing.members.map((m) => ({ id: m.id, name: m.name })),
        items: existing.items.map((i) => ({
          id: i.id,
          name: i.name,
          amount: i.amount,
          quantity: i.quantity,
          paidBy: i.paidBy,
          includeService: i.includeService,
          includeTax: i.includeTax,
          allocation: i.allocation.map((a) => ({ memberId: a.memberId, quantity: a.quantity })),
        })),
      });
    }
  }, [existing, isEdit, form]);

  const createBagi = useCreateBagi();
  const updateBagi = useUpdateBagi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const valid = await form.trigger();
      if (!valid) return;

      const data = form.getValues();

      if (isEdit && bagiId) {
        await updateBagi.mutateAsync({ id: bagiId, body: { name: data.name } });

        const existingMemberIds = new Set(existing?.members.map((m) => m.id) ?? []);
        const formMemberIds = new Set<string>();

        for (const member of data.members) {
          if (existingMemberIds.has(member.id)) {
            await userbagiApi.update(bagiId, member.id, { name: member.name });
          } else {
            const created = await userbagiApi.create(bagiId, { name: member.name });
            form.setValue(`members.${data.members.indexOf(member)}.id`, created.id);
          }
          formMemberIds.add(member.id);
        }

        for (const existingId of existingMemberIds) {
          if (!formMemberIds.has(existingId)) {
            await userbagiApi.delete(bagiId, existingId);
          }
        }

        const existingItemIds = new Set(existing?.items.map((i) => i.id) ?? []);

        for (const item of data.items) {
          if (existingItemIds.has(item.id)) {
            await itemApi.update(bagiId, item.id, {
              name: item.name,
              amount: item.amount,
              quantity: item.quantity,
              paidBy: item.paidBy,
              includeService: item.includeService,
              includeTax: item.includeTax,
              allocation: item.allocation,
            });
          } else {
            await itemApi.create(bagiId, {
              name: item.name,
              amount: item.amount,
              quantity: item.quantity,
              paidBy: item.paidBy,
              includeService: item.includeService,
              includeTax: item.includeTax,
              allocation: item.allocation,
            });
          }
        }

        for (const existingId of existingItemIds) {
          if (!data.items.some((i) => i.id === existingId)) {
            await itemApi.delete(bagiId, existingId);
          }
        }
      } else {
        const createdBagi = await createBagi.mutateAsync({ name: data.name });

        const memberIdMap = new Map<string, string>();
        for (const member of data.members) {
          const created = await userbagiApi.create(createdBagi.id, { name: member.name });
          memberIdMap.set(member.id, created.id);
        }

        for (const item of data.items) {
          await itemApi.create(createdBagi.id, {
            name: item.name,
            amount: item.amount,
            quantity: item.quantity,
            paidBy: memberIdMap.get(item.paidBy) ?? "",
            includeService: item.includeService,
            includeTax: item.includeTax,
            allocation: item.allocation.map((a) => ({
              memberId: memberIdMap.get(a.memberId) ?? "",
              quantity: a.quantity,
            })),
          });
        }

        navigate(`/bagi/${createdBagi.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <ErrorBanner message="Gagal memuat Bagi" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-brand-600">
          ‹ Back
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {isEdit ? "Edit Bagi" : "Bagi Baru"}
        </h1>
      </div>

      <Section1Header form={form} />
      <Section2Members form={form} />
      <Section3Items form={form} onSave={handleSave} isSubmitting={isSubmitting} />
    </div>
  );
};

export default BagiFormPage;
