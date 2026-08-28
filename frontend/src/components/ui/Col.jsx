function Col({ fluid = false, className = '', children, ...props }) {
  const widthClass = fluid
    ? ''
    : 'w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]';

  return (
    <div className={`${widthClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Col;
