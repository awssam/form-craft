import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldProps } from './FieldRenderer';

const withSetDefaultValueInFormPrimitive = (Component: React.FC<FieldProps>) => {
  const NewComponent = (props: FieldProps) => {
    const { setValue } = useFormContext();
    const fieldWatcher = useFormContext().watch(props.field.name);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (props?.field?.defaultValue) {
          const val = fieldWatcher || fieldWatcher?.trim()?.length < 1 ? fieldWatcher : props.field.defaultValue;
          setValue(props.field.name, val);
        }
      }, 1000);
    }, [fieldWatcher, props.control, props.field.defaultValue, props.field.name, setValue]);

    return <Component {...props} />;
  };

  return NewComponent;
};

export default withSetDefaultValueInFormPrimitive;
