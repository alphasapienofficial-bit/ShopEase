// useImperativeHandle: expose a small API (focus / clear) to the parent's ref.
// React 19 lets function components receive `ref` as a normal prop.
import { useId, useImperativeHandle, useRef, type Ref } from "react";

export type SearchBarHandle = {
  focus: () => void;
  clear: () => void;
};

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  ref?: Ref<SearchBarHandle>;
};

export function SearchBar({ value, onChange, ref }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => onChange(""),
    }),
    [onChange],
  );

  return (
    <div className="relative min-w-60 flex-1">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        className="input pl-10"
        ref={inputRef}
        type="search"
        placeholder="Search products…  (press /)"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}
