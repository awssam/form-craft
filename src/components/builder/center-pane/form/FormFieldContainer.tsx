import { useFormProperty } from "@/zustand/store";
import { Fragment, useEffect, useMemo } from "react";
import FieldRenderer from "./FieldRenderer";
import { FieldEntity } from "@/types/form-config";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface FormFieldsProps {
  pageId: string;
  isLastPage: boolean;
}

const FormFieldContainer = ({ pageId, isLastPage }: FormFieldsProps) => {
  const fieldEntities = useFormProperty("fieldEntities");
  const pageEntities = useFormProperty("pageEntities");

  const form = useForm({});
  const fields = useMemo(
    () => pageEntities?.[pageId]?.fields,
    [pageEntities, pageId]
  );

  // unregister fields that are no longer in the form - this is important for multipage forms with drag and drop
  useEffect(() => {
    const fieldSet = new Set(fields);

    const nameSet = new Set(
      Object.values(fieldEntities || {})
        ?.filter((d) => fieldSet.has(d.id))
        ?.map((field) => field.name)
    );

    Object.keys(form.getValues()).forEach((value) => {
      if (!nameSet.has(value)) {
        console.log(
          "unregistering",
          value,
          nameSet?.forEach((d) => console.log(d))
        );
        form.unregister(value);
      }
    });
  }, [fieldEntities, fields, form]);

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(
          (data) => console.log(data),
          (errors) => console.log(JSON.stringify(errors, null, 2))
        )}
      >
        <div className="flex flex-wrap w-full [row-gap:1.5rem] overflow-clip [column-gap:0.5rem]">
          {pageEntities?.[pageId]?.fields?.map((fieldId) => (
            <Fragment key={fieldId}>
              <FieldRenderer
                control={form.control}
                field={fieldEntities?.[fieldId] as FieldEntity}
              />
            </Fragment>
          ))}
        </div>
        {fields && fields?.length > 0 && (
          <Button className="mt-8" type="submit">
            {isLastPage ? "Submit" : "Next"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FormFieldContainer;
