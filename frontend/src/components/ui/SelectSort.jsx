function SelectSort({ options, value, onChange, type = 'white', ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      {...props}
      className={`rounded-sm bg-background px-3 py-3 text-sm font-medium shadow-sm border ${
        type === 'white' ? 'border-border' : 'border-input'
      }`}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectSort;
