const PageDivider = ({ label }: { label: string }) => {
    return (
      <div className="relative flex items-center bg-input my-4 h-[1px]">
        <p className="top-1/2 left-1/2 z-10 absolute bg-background px-2 py-0.5 rounded-md font-bold text-[11px] text-muted-foreground tracking-tighter -translate-x-1/2 -translate-y-1/2">
          {label}
        </p>
      </div>
    );
  };

export default PageDivider