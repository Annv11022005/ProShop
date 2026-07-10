const Row = ({ type = 'vertical', className = '', children, ...props }) => {
  const typeStyles = {
    horizontal: 'justify-between items-center',
    vertical: 'flex-col gap-[1.6rem]',
  };

  return (
    <div className={`flex ${typeStyles[type]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Row;
