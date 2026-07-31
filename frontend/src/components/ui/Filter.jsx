import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);

    if (searchParams.get('page')) searchParams.set('page', 1);

    let newPathname = location.pathname;
    if (newPathname.match(/\/page\/\d+/)) {
      newPathname = newPathname.replace(/\/page\/\d+/, '');
      if (newPathname === '') newPathname = '/';
      navigate(`${newPathname}?${searchParams.toString()}`);
    } else {
      setSearchParams(searchParams);
    }
  }

  return (
    <div className='flex gap-1 rounded-sm border border-border bg-background p-1 shadow-sm'>
      {options.map((option) => (
        <button
          key={option.value}
          disabled={option.value === currentFilter}
          onClick={() => handleClick(option.value)}
          className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
            option.value === currentFilter
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
