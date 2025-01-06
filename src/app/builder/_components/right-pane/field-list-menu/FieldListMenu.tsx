import FormConfigSection from '@/components/common/FormConfigSection';
import FieldCard from './FieldCard';

import sections, { SectionField } from './config';
import { useFormActionProperty, useFormProperty, useSelectedFieldStore } from '@/zustand/store';
import { createNewFormField } from '@/lib/form';
import { generateId } from '@/lib/utils';
import { FieldType } from '@/types/form-config';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';
import { toast } from 'sonner';

const FieldListMenu = () => {
  const addField = useFormActionProperty('addField');
  const pageEntities = useFormProperty('pageEntities');
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);

  const { FORMSECTIONS, setSection } = useFormSectionDisplay();

  const handleAddField = (field: Partial<SectionField>) => {
    const newField = createNewFormField({
      type: field?.type as FieldType,
      name: generateId(),
      label: field?.name as string,
    });

    addField(Object.values(pageEntities || {})[0].id, newField);

    setSelectedField(newField);

    setSection(FORMSECTIONS.Settings);

    toast.info(`${field?.name} added successfully`, {
      description: 'Go to Settings to configure the field.',
    });
  };

  return sections.map((section) => (
    <FormConfigSection
      key={section.title}
      icon={section.icon}
      title={section.title}
      // @ts-expect-error ts(2322)
      subtitle={section.description}
      className="gap-4"
    >
      {section.fields?.map((field) => (
        <FieldCard
          key={field.name}
          icon={field.icon}
          name={field.name}
          type={field.type}
          description={field.description}
          onClick={handleAddField}
        />
      ))}
    </FormConfigSection>
  ));
};

export default FieldListMenu;
