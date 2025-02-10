import { FormProps } from './Form';

const FormHeader = ({ formConfig }: FormProps) => {
  return (
    <header className="px-2 flex flex-col gap-1 mt-4">
      <h3 className="font-bold text-lg sm:text-2xl tracking-tight border-b border-b-transparent min-w-12 min-h-6">
        {formConfig?.name}
      </h3>
      <p className="font-normal text-[13px] sm:text-[14.5px] border-b border-b-transparent min-w-12 min-h-6">
        {formConfig?.description}
      </p>
    </header>
  );
};

export default FormHeader;
