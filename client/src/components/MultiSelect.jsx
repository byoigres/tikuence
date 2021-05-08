import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const CategorySelector = ({
  label,
  placeholder = '',
  options,
  maxSelected = null,
  labelPropertyName,
  onValueChage,
  error,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

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
          // console.log('onChange', value);
        }}
        onClose={() => {
          // console.log('onClose');
          setIsOpen(!isOpen);
        }}
        onInputChange={() => {
          // console.log('onInputChange');
        }}
        onOpen={(e) => {
          // console.log('onOpen');
          if (selected.length >= maxSelected) {
            e.preventDefault();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        open={isOpen}
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
