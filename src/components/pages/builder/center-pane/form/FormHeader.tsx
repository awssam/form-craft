import EditableText from '@/components/common/EditableText';
import { useFormActionProperty, useFormProperty } from '@/zustand/store';

const FormHeaderContent = ({ pageId }: { pageId: string }) => {
  const formTheme = useFormProperty('theme');
  const formName = useFormProperty('name');
  const formDescription = useFormProperty('description');
  const pageEntities = useFormProperty('pageEntities');

  const updateFormConfig = useFormActionProperty('updateFormConfig');
  const updatePageName = useFormActionProperty('updatePageName');

  return (
    <div className="flex flex-col gap-1 px-2 w-full break-all">
      <EditableText
        value={formName || ''}
        renderText={(_, onClick) => (
          <h3
            className="font-bold text-xl tracking-tight border-b border-b-transparent cursor-pointer min-w-12 min-h-6"
            style={{ color: formTheme?.properties?.primaryTextColor }}
            onClick={onClick}
          >
            {formName || <span className="text-muted-foreground opacity-75">{"What's this form called?"}</span>}
          </h3>
        )}
        inputClassName="font-bold text-xl tracking-tight"
        onChange={(newValue) =>
          updateFormConfig({
            name: newValue,
          })
        }
        inputPlaceholder="What's this form called?"
      />

      <EditableText
        value={formDescription || ''}
        renderText={(_, onClick) => (
          <p
            className="font-normal text-[13px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6"
            style={{ color: formTheme?.properties?.primaryTextColor }}
            onClick={onClick}
          >
            {formDescription || (
              <span className="text-muted-foreground opacity-75">{'Describe what this form does...'}</span>
            )}
          </p>
        )}
        inputClassName="font-normal text-[13px]"
        onChange={(newValue) =>
          updateFormConfig({
            description: newValue,
          })
        }
        inputPlaceholder="Describe what this form does..."
      />

      <div className="mt-3">
        <EditableText
          value={pageEntities?.[pageId]?.name as string}
          renderText={(_, onClick) => (
            <p
              className="font-semibold text-[16px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6"
              style={{ color: formTheme?.properties?.primaryTextColor }}
              onClick={onClick}
            >
              {pageEntities?.[pageId]?.name || (
                <span className="text-muted-foreground opacity-75">{"What's this page called?"}</span>
              )}
            </p>
          )}
          inputClassName="font-semibold text-[16px]"
          onChange={(newValue) => updatePageName(pageId, newValue)}
          inputPlaceholder="What's this page called?"
        />
      </div>
    </div>
  );
};

export default FormHeaderContent;
