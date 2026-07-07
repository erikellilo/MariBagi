import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";
import type { BagiFormData } from "@/wizard/bagiFormSchema";
import { WizardSteps } from "@/wizard/WizardSteps";
import { Step1Setup } from "@/wizard/Step1Setup";
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

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600"
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

      {currentStep === 2 && (
        <div className="py-12 text-center text-gray-400">Step 2 (Items) — Task 11</div>
      )}
      {currentStep === 3 && (
        <div className="py-12 text-center text-gray-400">Step 3 (Sharing) — Task 12</div>
      )}
    </div>
  );
};

export default BagiWizardPage;
