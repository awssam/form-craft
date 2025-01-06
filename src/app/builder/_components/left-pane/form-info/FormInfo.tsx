import React, { memo } from 'react';
import { Info } from 'lucide-react';

import FormConfigSection from '@/components/common/FormConfigSection';
import { FormCover, FormDescription } from './fields';

const FormInfo = () => {
  return (
    <FormConfigSection
      icon={<Info className="w-4 h-4 text-white/90" />}
      title="Form Information"
      subtitle="These are some basic details about your form."
    >
      <FormDescription />
      {/* <FormTags /> */}
      <FormCover />
      {/* <FormStatus /> */}
    </FormConfigSection>
  );
};

export default memo(FormInfo);
