import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const CategorySelector = ({
  label,
  placeholder = '',
  options,
  defaultValue = [],
  maxSelected = null,
  keyPropertyName,
  labelPropertyName,
  onValueChage,
  error,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.filter((option) => defaultValue.includes(option[keyPropertyName]))
  );
  const [defaultValues] = useState(selected);

  return (
    <div>
      <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        getOptionLabel={(option) => option[labelPropertyName]}
        onChange={(e, value) => {
          setSelected(value);
          if (onValueChage) {
            onValueChage(value);
          }
        }}
        onClose={() => {
          setIsOpen(!isOpen);
        }}
        onOpen={(e) => {
          if (selected.length >= maxSelected) {
            e.preventDefault();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        open={isOpen}
        defaultValue={defaultValues}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="standard"
            label={label}
            placeholder={maxSelected && selected.length === maxSelected ? null : placeholder}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </div>
  );
};

export default CategorySelector;
