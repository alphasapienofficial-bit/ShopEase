// Reusable Formik input: useField connects it to the nearest <Formik>,
// useId creates a unique id to link the label, input and error message.
import { useId } from "react";
import { useField } from "formik";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

export function FormField({ label, ...props }: FormFieldProps) {
  const [field, meta] = useField(props.name);
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className="input"
        {...field}
        {...props}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      {hasError && (
        <p id={errorId} className="text-xs text-red-600">
          {meta.error}
        </p>
      )}
    </div>
  );
}
