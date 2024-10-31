import { useFormProperty } from "@/zustand/store";
import { Fragment } from "react";
import FieldRenderer from "./FieldRenderer";
import { FieldEntity } from "@/types/form-config";

interface FormFieldsProps {
  pageId: string;
}

const FormFieldContainer = ({ pageId }: FormFieldsProps) => {
  const fieldEntities = useFormProperty("fieldEntities");
  const pageEntities = useFormProperty("pageEntities");

  return (
    <div className="flex flex-wrap [row-gap:1.5rem] [column-gap:0.5rem] w-full">
      {pageEntities?.[pageId]?.fields?.map((fieldId) => (
        <Fragment key={fieldId}>
          <FieldRenderer field={fieldEntities?.[fieldId] as FieldEntity} />
        </Fragment>
      ))}
    </div>
  );
};

export default FormFieldContainer;
