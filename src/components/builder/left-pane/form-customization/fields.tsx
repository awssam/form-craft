import FormField from "@/components/common/FormField";
import ColorPicker from "@/components/ui/colorpicker";

import { useFormActionProperty, useFormConfigStore } from "@/zustand/store";

import { FormConfig } from "@/types/form-config";

const useFormStylesUpdater = () => {
  const updateFormStyles = useFormActionProperty("updateFormStyles");
  const handleChange = (key: keyof FormConfig["styles"]) => (val: unknown) => {
    updateFormStyles({ [key]: val });
  };
  return handleChange;
};

export const FormBackgroundColor = () => {
  const bgColor = useFormConfigStore(
    (state) => state.formConfig.styles.backgroundColor
  );
  const handleChange = useFormStylesUpdater();
  return (
    <FormField label="Background Color" id="primaryColor">
      <ColorPicker
        showLabel={true}
        triggerClassName="flex-row w-[max-content]"
        className="w-6 h-6"
        color={bgColor!}
        onChange={handleChange("backgroundColor")}
      />
    </FormField>
  );
};

export const FormFontPrimaryColor = () => {
  const fontPrimary = useFormConfigStore(
    (state) => state.formConfig.styles.fontPrimaryColor
  );
  const handleChange = useFormStylesUpdater();
  return (
    <FormField label="Font Primary Color" id="primaryColor">
      <ColorPicker
        showLabel={true}
        triggerClassName="flex-row w-[max-content]"
        className="w-6 h-6"
        color={fontPrimary!}
        onChange={handleChange("fontPrimaryColor")}
      />
    </FormField>
  );
};

export const FormFontSecondaryColor = () => {
  const fontSecondary = useFormConfigStore(
    (state) => state.formConfig.styles.fontSecondaryColor
  );
  const handleChange = useFormStylesUpdater();
  return (
    <FormField label="Font Secondary Color" id="primaryColor">
      <ColorPicker
        showLabel={true}
        triggerClassName="flex-row w-[max-content]"
        className="w-6 h-6"
        color={fontSecondary!}
        onChange={handleChange("fontSecondaryColor")}
      />
    </FormField>
  );
};
