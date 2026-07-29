import { useState } from 'react';
import { Input } from './ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { Field } from './ui/field';

const Search = () => {
  const { keyword: keywordURL } = useParams();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(keywordURL || '');

  function handlerSubmit(e) {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else navigate('/');
  }

  return (
    <form onSubmit={handlerSubmit}>
      <Field className='w-100'>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          id='search'
          type='search'
          placeholder='Search Product ...'
          className='rounded-lg h-10 py-0 px-2'
        />
      </Field>
    </form>
  );
};

export default Search;
