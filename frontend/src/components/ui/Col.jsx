function Col({ fluid = false, className = '', children, ...props }) {
  const widthClass = fluid
    ? ''
    : 'w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]';

  return (
    <div className={`${widthClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Col;
