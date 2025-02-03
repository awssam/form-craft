import { useEffect, useRef } from 'react';
import { generateId } from '@/lib/utils';

const useFormSubmissionId = () => {
  const id = useRef<string | null>(null);

  useEffect(() => {
    id.current = localStorage.getItem('formSubmissionId');
    if (!id.current) {
      id.current = generateId();
      localStorage.setItem('formSubmissionId', id.current);
    }
  }, []);

  return id?.current;
};

export default useFormSubmissionId;
