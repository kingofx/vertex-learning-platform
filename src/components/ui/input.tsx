import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { Icon } from "./icons";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  shortcut?: string;
};

export function SearchInput({
  label = "Search",
  shortcut = "⌘ K",
  placeholder = "Search anything...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <label
      className={`flex h-11 items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 text-neutral-500 focus-within:border-primary-400 ${className}`}
    >
      <span className="sr-only">{label}</span>
      <Icon name="search" size={18} />
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-body text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none"
        {...props}
      />
      {shortcut && (
        <kbd className="font-sans text-small text-neutral-500">{shortcut}</kbd>
      )}
    </label>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, className = "", children, ...props }: SelectProps) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        className="h-11 w-full appearance-none rounded-md border border-neutral-200 bg-white pr-10 pl-4 text-body text-neutral-900 focus:border-primary-400 focus-visible:outline-none"
        {...props}
      >
        {children}
      </select>
      <Icon
        name="chevronDown"
        size={18}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-700"
      />
    </label>
  );
}
