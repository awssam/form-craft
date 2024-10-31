import { useFormProperty } from "@/zustand/store";
import React from "react";

const FormHeaderContent = () => {
  const formTheme = useFormProperty("theme");
  const formName = useFormProperty("name");
  const formDescription = useFormProperty("description");

  return (
    <div className="flex flex-col gap-1">
      <h3
        className="font-bold text-xl"
        style={{ color: formTheme?.properties?.primaryTextColor }}
      >
        {formName}
      </h3>
      <p
        className="font-semibold text-[13px]"
        style={{ color: formTheme?.properties?.primaryTextColor }}
      >
        {formDescription}
      </p>
    </div>
  );
};





export default FormHeaderContent