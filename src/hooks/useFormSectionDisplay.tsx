
'use client';


import React, { useContext } from "react";

export type FormSection = "Customize" | "Builder" | "Settings";

const FORMSECTIONS: { [key in FormSection]: FormSection } = {
  Customize: "Customize",
  Builder: "Builder",
  Settings: "Settings",
};

const FormSectionDisplayContext = React.createContext<{
  section: FormSection;
  setSection: React.Dispatch<React.SetStateAction<FormSection>>;
  FORMSECTIONS: typeof FORMSECTIONS;
}>({
  section: FORMSECTIONS.Builder,
  setSection: () => {},
  FORMSECTIONS,
});

export const FormSectionDisplayProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [section, setSection] = React.useState<FormSection>(
    FORMSECTIONS.Builder
  );

  return (
    <FormSectionDisplayContext.Provider
      value={{ section, setSection, FORMSECTIONS }}
    >
      {children}
    </FormSectionDisplayContext.Provider>
  );
};

const useFormSectionDisplay = () => useContext(FormSectionDisplayContext);

export default useFormSectionDisplay;
