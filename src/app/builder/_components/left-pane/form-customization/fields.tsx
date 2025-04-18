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
import { useQuery } from "@tanstack/react-query";
import { getAllFonts } from "@/data-fetching/functions/google";
import { Skeleton } from "@/components/ui/skeleton";
import { memo, useCallback, useMemo } from "react";
import useDynamicFontLoader from "@/hooks/useDynamicFontLoader";
import useFeatureAnnouncer from "@/hooks/useFeatureAnnouncer";
import { NewFeatureBadge } from "@/components/common/FeatureReleaseBadge";

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
        },
      });
    };
  return handleChange;
};

const FormFontPrimaryColor = () => {
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

const FormFontSecondaryColor = () => {
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

const FormThemePicker = () => {
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

const useFonts = () => {
  const query = useQuery({
    queryKey: ["google-fonts"],
    staleTime: Infinity,
    queryFn: getAllFonts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select(data) {
      return data?.items?.slice(0, 100)?.map((d: Record<string, string>) => ({
        label: d?.family,
        value: d?.family,
      }));
    },
  });
  return query;
};

const FormFontPicker = () => {
  const hasAnnouncedFeatureTag = useFeatureAnnouncer("font-family");

  const { data, isLoading } = useFonts();

  const updateFormStyles = useFormActionProperty("updateFormStyles");
  const fontFamily = useFormProperty("styles")?.fontFamily || "Poppins";

  const handleFontChange = useCallback(
    (opt: Option[]) => {
      updateFormStyles({
        fontFamily: opt?.[0]?.value as string,
      });
    },
    [updateFormStyles]
  );

  const selectedFont = useMemo(
    () => [data?.find((d: Option) => d?.value === (fontFamily || "Poppins"))],
    [data, fontFamily]
  );

  useDynamicFontLoader(fontFamily);

  return (
    <FormField
      label="Font Family"
      id="font"
      renderLabelExtraContent={() =>
        !hasAnnouncedFeatureTag ? (
          <NewFeatureBadge
            className="ml-3 px-3 py-0.1 w-fit"
            childrenClass="text-[12px]"
          />
        ) : null
      }
    >
      {isLoading && <Skeleton className="w-full h-8" />}

      {!isLoading && (
        <Combobox
          handleChange={handleFontChange}
          selectedValues={selectedFont}
          allowMultiple={false}
          options={data}
        />
      )}
    </FormField>
  );
};

const components = {
  FormFontPicker: memo(FormFontPicker),
  FormThemePicker: memo(FormThemePicker),
  FormFontPrimaryColor: memo(FormFontPrimaryColor),
  FormFontSecondaryColor: memo(FormFontSecondaryColor),
};

export default components;
