const gridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const lgGridColsMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

function Row({
  cols,
  template,
  gap = 'gap-6',
  className = '',
  children,
  ...props
}) {
  let layoutClasses;
  if (template) {
    layoutClasses = `grid grid-cols-1 ${template}`;
  } else if (cols) {
    layoutClasses = `grid grid-cols-1 ${lgGridColsMap[cols] || gridColsMap[cols]}`;
  } else {
    layoutClasses = 'flex flex-wrap';
  }

  return (
    <div className={`${layoutClasses} ${gap} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Row;
