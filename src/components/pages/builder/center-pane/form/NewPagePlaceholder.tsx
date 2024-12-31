import React from 'react';
import { toast } from 'sonner';
import { CirclePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useFormActionProperty } from '@/zustand/store';

const NewPagePlaceholder = () => {
  const addPage = useFormActionProperty('addPage');

  const handleAddPage = () => {
    addPage();
    toast.info('New page added with successfully');
  };

  return (
    <>
      <section className="flex items-center justify-center gap-1 w-[95%] md:w-[min(80%,800px)] mb-20 border-yellow-200/10 px-3 py-5 md:px-5 md:py-5  border border-dashed rounded-md min-h-80 transition-all duration-200">
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={handleAddPage}>
          <CirclePlus className="w-12 h-12 text-gray-300/70 hover:opacity-90 hover:scale-90 transition-all duration-300" />
          <Button variant="link" type="button" className="p-4" size={'lg'}>
            Add a new page
          </Button>
        </div>
      </section>

      <div className="min-h-40 min-w-[80dvw]" />
    </>
  );
};

export default NewPagePlaceholder;
