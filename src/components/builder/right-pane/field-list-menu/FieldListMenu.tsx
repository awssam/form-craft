import FormConfigSection from '@/components/common/FormConfigSection';
import FieldCard from './FieldCard';

import sections from './config';

const FieldListMenu = () => {
  return sections.map((section) => (
    <FormConfigSection key={section.title} icon={section.icon} title={section.title} subtitle={section.description}>
      {section.fields?.map((field) => (
        <FieldCard key={field.name} icon={field.icon} name={field.name} description={field.description} />
      ))}
    </FormConfigSection>
  ));
};

export default FieldListMenu;
