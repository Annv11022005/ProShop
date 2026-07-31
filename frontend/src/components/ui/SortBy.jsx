import SelectSort from './SelectSort';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

const SortBy = ({ options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const sortBy = searchParams.get('sortBy') || '';

  function handleChange(e) {
    searchParams.set('sortBy', e.target.value);
    
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
    <SelectSort
      options={options}
      type='white'
      onChange={handleChange}
      value={sortBy}
    />
  );
};

export default SortBy;
