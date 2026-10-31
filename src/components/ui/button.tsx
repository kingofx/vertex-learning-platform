import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "tertiary" | "text";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  /** Renders the hover look without a pointer, for the design-system page. */
  forceHover?: boolean;
  className?: string;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 data-[hover=true]:bg-primary-600",
  secondary:
    "border border-primary-500 bg-white text-primary-500 hover:bg-primary-100 data-[hover=true]:bg-primary-100",
  tertiary:
    "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 data-[hover=true]:bg-neutral-100",
  text: "text-primary-500 hover:text-primary-600 data-[hover=true]:text-primary-600",
};

function buttonClasses({
  variant = "primary",
  size = "lg",
  className = "",
}: Pick<CommonProps, "variant" | "size" | "className">) {
  const padding = variant === "text" ? "" : size === "lg" ? "px-4" : "px-3";
  const text = size === "lg" ? "text-body-lg" : "text-body";

  return [
    "inline-flex h-11 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40",
    padding,
    text,
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function Content({
  icon,
  iconPosition = "end",
  children,
}: Pick<CommonProps, "icon" | "iconPosition" | "children">) {
  return (
    <>
      {icon && iconPosition === "start" && icon}
      {children}
      {icon && iconPosition === "end" && icon}
    </>
  );
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export function Button({
  variant,
  size,
  icon,
  iconPosition,
  forceHover,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-hover={forceHover || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & {
    href: string;
  };

export function ButtonLink({
  variant,
  size,
  icon,
  iconPosition,
  forceHover,
  className,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      data-hover={forceHover || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  );
}
