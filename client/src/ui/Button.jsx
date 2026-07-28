import SpinnerMinni from './SpinnerMini';
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
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'relative overflow-hidden border border-black bg-black text-white  ' +
      'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-white ' +
      'before:transition-transform before:duration-300 hover:before:scale-x-100 hover:text-black',

    secondary:
      'border border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-100',

    danger: 'bg-red-600 text-white hover:bg-red-700',

    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 ',

    dangerOutline:
      'border border-red-300 bg-white text-red-600 hover:bg-red-50',

    textDanger:
      'bg-transparent p-0 text-xs text-gray-500 hover:bg-transparent hover:text-red-600',

    menuDanger:
      'w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 md:justify-start',
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
        {loading ? <SpinnerMinni /> : children}
      </span>
    </button>
  );
}

export default Button;
