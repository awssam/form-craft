import { FormProps } from './Form';

const FormHeader = ({ formConfig, currentPageNumber }: FormProps & { currentPageNumber: number }) => {
  return (
    <header className="px-2 flex mt-4 gap-4 justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg sm:text-2xl tracking-tight border-b border-b-transparent min-w-12 min-h-6">
          {formConfig?.name}
        </h3>
        <p className="font-normal text-[13px] sm:text-[14.5px] border-b border-b-transparent min-w-12 min-h-6">
          {formConfig?.description}
        </p>
      </div>
      {formConfig?.pages?.length > 1 && (
        <p className="text-[43px] mx-[19px] opacity-40 text-muted-foreground">
          {/* <span className="text-sm">Page </span> */}
          {currentPageNumber < 9 ? `0${currentPageNumber}` : currentPageNumber}
        </p>
      )}
    </header>
  );
};

export default FormHeader;
