import { useFormProperty } from "@/zustand/store";
import React, { Fragment } from "react";

export const FormHeaderContent = () => {
  const formStyles = useFormProperty("styles");
  const formName = useFormProperty("name");
  const formDescription = useFormProperty("description");

  return (
    <div className="flex flex-col gap-1">
      <h3
        className="font-bold text-xl"
        style={{ color: formStyles?.fontPrimaryColor }}
      >
        {formName}
      </h3>
      <p
        className="font-semibold text-[13px]"
        style={{ color: formStyles?.fontPrimaryColor }}
      >
        {formDescription}
      </p>
    </div>
  );
};

const FormContent = () => {
  return (
    <Fragment>
        <p>Some other content here</p>
    </Fragment>
  );
};

export default FormContent;
