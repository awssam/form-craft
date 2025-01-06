import DeleteFieldModal from '@/app/builder/_components/DeleteFieldModal';
import FormConfigSection from '@/components/common/FormConfigSection';
import { Button } from '@/components/ui/button';
import { useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import { CircleCheckBig } from 'lucide-react';

import React, { memo } from 'react';
import { toast } from 'sonner';

export const FieldDuplicateAction = memo(() => {
  const duplicateField = useFormActionProperty('duplicateField');

  const selectedFieldId = useSelectedFieldStore((s) => s?.selectedField)?.id;

  if (!selectedFieldId) return null;

  const handleDuplicateField = () => {
    duplicateField(selectedFieldId);
    toast.info('Field duplicated successfully', {
      description: 'Go to Settings to configure the field.',
    });
  };

  return (
    <Button variant="outline" onClick={handleDuplicateField}>
      Copy Field with same settings
    </Button>
  );
});

FieldDuplicateAction.displayName = 'FieldDuplicateAction';

export const FieldDeleteAction = () => {
  const deleteField = useFormActionProperty('deleteField');
  const [open, setOpen] = React.useState(false);

  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  const handleFieldDelete = () => {
    deleteField(selectedField?.id as string);
    toast.info('Field deleted successfully');
  };

  if (!selectedField?.id) return null;
  return (
    <DeleteFieldModal fieldLabel={selectedField?.label} onConfirm={handleFieldDelete} open={open} setOpen={setOpen} />
  );
};

const FieldActionSection = () => {
  return (
    <FormConfigSection
      icon={<CircleCheckBig className="w-4 h-4 text-white/90" />}
      title="Field Actions"
      subtitle="Easily control your form fields with these actions."
      className="mt-2"
    >
      <FieldDuplicateAction />
      <FieldDeleteAction />
    </FormConfigSection>
  );
};

export default FieldActionSection;
