"use client";

import { cn } from "cn";
import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "checked" | "onChange"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indicator?: ReactNode;
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  indicator,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <span
      data-slot="checkbox"
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors",
        checked && "border-primary bg-primary text-primary-foreground",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        className="absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      {indicator ??
        (checked && <CheckIcon className="pointer-events-none size-3.5" />)}
    </span>
  );
}

export { Checkbox };
