import React from 'react';
import Select from 'react-select';
import type { Props as SelectProps, SingleValue } from 'react-select';
import './SelectField.css';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  selectProps?: Partial<SelectProps<SelectOption, false>>;
}

const customStyles: SelectProps<SelectOption, false>['styles'] = {
  control: (base, state) => ({
    ...base,
    borderRadius: 8,
    borderColor: state.isFocused ? '#667eea' : '#e2e8f0',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
    paddingLeft: 4,
    paddingRight: 4,
    minHeight: '48px',
    fontSize: '0.9rem',
    fontWeight: 500,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '0.9rem',
    fontWeight: 500,
    backgroundColor: state.isSelected
      ? '#667eea'
      : state.isFocused
      ? '#edf2f7'
      : 'transparent',
    color: state.isSelected ? '#fff' : '#1a202c',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const portalTarget = typeof document !== 'undefined' ? document.body : undefined;

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder,
  isDisabled,
  selectProps,
}) => {
  const handleChange = (selected: SingleValue<SelectOption>) => {
    onChange(selected?.value ?? '');
  };

  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Select
        inputId={id}
        name={name}
        value={selectedOption}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        styles={customStyles}
        classNamePrefix="admin-select"
        menuPortalTarget={portalTarget}
        menuPosition="fixed"
        {...selectProps}
      />
    </div>
  );
};

export default SelectField;
