import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";
import type { BagiFormData } from "@/wizard/bagiFormSchema";
import { WizardSteps } from "@/wizard/WizardSteps";
import { Step1Setup } from "@/wizard/Step1Setup";
import { Step2Items } from "@/wizard/Step2Items";
import { Step3Sharing } from "@/wizard/Step3Sharing";
import { useCreateBagi } from "@/hooks/useCreateBagi";
import { userbagiApi } from "@/api/userbagiApi";
import { itemApi } from "@/api/itemApi";
import { Button } from "@/components/ui/Button";

const DEFAULT_VALUES: BagiFormData = {
  name: "",
  includeService: false,
  includeTax: false,
  members: [],
  items: [],
};

const getCurrentStep = (pathname: string): 1 | 2 | 3 => {
  if (pathname.includes("/sharing")) return 3;
  if (pathname.includes("/items")) return 2;
  return 1;
};

const BagiWizardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);

  const form = useForm<BagiFormData>({
    resolver: zodResolver(bagiFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const handleNextFromSetup = async () => {
    const valid = await form.trigger(["name", "members"]);
    if (valid) {
      navigate("/bagi/new/items");
    }
  };

  const createBagi = useCreateBagi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const valid = await form.trigger();
      if (!valid) return;

      const data = form.getValues();

      const createdBagi = await createBagi.mutateAsync({
        name: data.name,
        includeService: data.includeService,
        includeTax: data.includeTax,
      });

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
          allocation: item.allocation.map((a) => ({
            memberId: memberIdMap.get(a.memberId) ?? "",
            quantity: a.quantity,
          })),
        });
      }

      navigate(`/bagi/${createdBagi.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-brand-600"
          >
            ‹ Back
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-900">
          {currentStep === 1 ? "New Bagi" : form.getValues("name") || "Bagi"}
        </h1>
      </div>

      <WizardSteps currentStep={currentStep} />

      {currentStep === 1 && <Step1Setup form={form} />}

      {currentStep === 1 && (
        <Button fullWidth className="mt-6" onClick={handleNextFromSetup}>
          Next → Items
        </Button>
      )}

      {currentStep === 2 && <Step2Items form={form} />}

      {currentStep === 2 && (
        <Button
          fullWidth
          className="mt-6"
          onClick={() => navigate("/bagi/new/sharing")}
        >
          Next → Sharing
        </Button>
      )}

      {currentStep === 3 && <Step3Sharing form={form} />}

      {currentStep === 3 && (
        <Button
          fullWidth
          className="mt-6"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Bagi"}
        </Button>
      )}
    </div>
  );
};

export default BagiWizardPage;
