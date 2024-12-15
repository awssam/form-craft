import FormField from "@/components/common/FormField";
import ColorPicker from "@/components/ui/colorpicker";

import {
  useFormActionProperty,
  useFormConfigStore,
  useFormProperty,
} from "@/zustand/store";

import { FormConfig, Theme } from "@/types/form-config";
import { formThemes } from "@/zustand/data";
import { Combobox, Option } from "@/components/ui/combobox";

const useFormThemeUpdater = () => {
  const theme = useFormProperty("theme")!;

  const updateFormTheme = useFormActionProperty("updateFormTheme");
  const handleChange =
    (key: keyof FormConfig["theme"]["properties"]) => (val: unknown) => {
      updateFormTheme({
        ...theme,
        properties: {
          ...theme?.properties,
          [key]: val,
        }
      });
    };
  return handleChange;
};

export const FormFontPrimaryColor = () => {
  const fontPrimary = useFormConfigStore(
    (state) => state?.formConfig?.theme?.properties?.primaryTextColor
  );
  const handleChange = useFormThemeUpdater();
  return (
    <FormField label="Font Primary Color" id="primaryColor">
      <ColorPicker
        showLabel={true}
        triggerClassName="flex-row w-[max-content]"
        className="w-6 h-6"
        color={fontPrimary!}
        onChange={handleChange("primaryTextColor")}
      />
    </FormField>
  );
};

export const FormFontSecondaryColor = () => {
  const fontSecondary = useFormConfigStore(
    (state) => state?.formConfig?.theme?.properties?.secondaryTextColor
  );
  const handleChange = useFormThemeUpdater();
  return (
    <FormField label="Font Secondary Color" id="primaryColor">
      <ColorPicker
        showLabel={true}
        triggerClassName="flex-row w-[max-content]"
        className="w-6 h-6"
        color={fontSecondary!}
        onChange={handleChange("secondaryTextColor")}
      />
    </FormField>
  );
};

const formThemeOptions = Object.keys(formThemes).map((theme) => ({
  label: theme
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" "),
  value: theme,
}));

export const FormThemePicker = () => {
  const updateFormTheme = useFormActionProperty("updateFormTheme");
  const theme = useFormProperty("theme");

  const handleSelect = (options: Option[]) => {
    updateFormTheme({
      type: options[0].value as Theme,
      id: options[0].value as Theme,
      properties: formThemes[options[0].value as Theme],
    });
  };

  return (
    <FormField label="Form Theme" id="theme">
      <Combobox
        handleChange={handleSelect}
        selectedValues={[
          formThemeOptions.find(
            (option) => option.value === theme?.type
          ) as Option,
        ]}
        options={formThemeOptions}
      />
    </FormField>
  );
};
