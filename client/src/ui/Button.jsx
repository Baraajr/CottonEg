import SpinnerMini from './SpinnerMini';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  loading = false,
  active = false,
  activeClassName = '',
  className = '',
  disabled,
  ...props
}) {
  const state = active ? activeClassName : '';

  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium ' +
    'transition-all duration-200 ' +
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'relative overflow-hidden border border-primary bg-primary text-primary-foreground ' +
      'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-primary-foreground ' +
      'before:transition-transform before:duration-300 ' +
      'hover:before:scale-x-100 hover:border-accent hover:text-primary',

    secondary:
      'border border-border bg-surface text-foreground ' +
      'hover:border-accent hover:bg-surface-hover',

    danger:
      'border border-danger bg-danger text-white dark:text-background hover:bg-danger/90',

    ghost:
      'bg-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground',

    dangerOutline:
      'border border-danger/40 bg-transparent text-danger hover:bg-danger/10',

    textDanger:
      'bg-transparent p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-danger',

    menuDanger:
      'w-full rounded-lg text-sm font-medium text-danger hover:bg-danger/10 md:justify-start',
  };

  const sizes = {
    xs: 'h-7 w-7 p-0 text-xs',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
    menu: 'px-4 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        base,
        variants[variant],
        sizes[size],
        state,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <SpinnerMini /> : children}
      </span>
    </button>
  );
}

export default Button;
