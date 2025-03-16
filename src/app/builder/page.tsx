import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/app/builder/_components/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplay';

export const revalidate = false;

const FormBuilderPage = async () => {
  return (
    <FormSectionDisplayProvider>
      <>
        <TopHeader />
        <SectionDisplay />
      </>
    </FormSectionDisplayProvider>
  );
};

export default FormBuilderPage;
