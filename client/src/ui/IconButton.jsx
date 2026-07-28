function IconButton({
  children,
  variant = 'default',
  size = 'md',
  badge,
  tooltip,
  className = '',
  ...props
}) {
  const variants = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600',
    favorite:
      'backdrop-blur-sm shadow-md transition-all duration-300 bg-white/90 text-gray-700 hover:bg-white hover:text-red-500 hover:scale-110 hover:shadow-xl',
  };
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <button
      className={[
        'group relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none  foc disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}

      {badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gray-900 px-1 text-xs text-white">
          {badge}
        </span>
      )}

      {tooltip && (
        <span className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {tooltip}
        </span>
      )}
    </button>
  );
}

export default IconButton;
