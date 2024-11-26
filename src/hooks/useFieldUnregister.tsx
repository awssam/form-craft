import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useFormProperty } from '@/zustand/store';

const useFieldUnregister = (pageId: string, form: UseFormReturn) => {
  const pageEntities = useFormProperty('pageEntities');
  const fields = useMemo(() => pageEntities?.[pageId]?.fields, [pageEntities, pageId]);
  const fieldEntities = useFormProperty('fieldEntities');

  // unregister fields that are no longer in the form - this is important for multipage forms with drag and drop
  useEffect(() => {
    const fieldSet = new Set(fields);

    const nameSet = new Set(
      Object.values(fieldEntities || {})
        ?.filter((d) => fieldSet.has(d.id))
        ?.map((field) => field.name),
    );

    Object.keys(form.getValues()).forEach((value) => {
      if (!nameSet.has(value)) form.unregister(value);
    });
  }, [fieldEntities, fields, form]);

  return null;
};

export default useFieldUnregister;
