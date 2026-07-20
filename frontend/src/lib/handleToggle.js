import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const handleToggle = () => {
    setValue((prev) => !prev);
  };

  return [value, handleToggle];
}

export default useToggle;
