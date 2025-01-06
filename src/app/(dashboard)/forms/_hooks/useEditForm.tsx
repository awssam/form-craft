import { useFormsQuery } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import { useRouter } from 'next/navigation';

const useEditForm = () => {
  const router = useRouter();
  const { data: forms } = useFormsQuery();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const handleFormEdit = (id: string) => {
    const form = forms?.find((form) => form.id === id);
    if (form) {
      setFormConfig(form);
      router.push('/builder');
    }
  };
  return {
    handleFormEdit,
  };
};

export default useEditForm;
