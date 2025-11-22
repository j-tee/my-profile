import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.css';

interface DateInputProps {
  id: string;
  name: string;
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  required?: boolean;
  disabled?: boolean;
  label: string;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  label,
  placeholder = 'mm/dd/yyyy'
}) => {
  // Convert YYYY-MM-DD string to Date object
  const dateValue = value ? new Date(value + 'T00:00:00') : null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Convert Date to YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="custom-date-input-wrapper">
      <label htmlFor={id}>
        {label} {required && <span className="required-asterisk">*</span>}
      </label>
      <DatePicker
        id={id}
        name={name}
        selected={dateValue}
        onChange={handleDateChange}
        disabled={disabled}
        placeholderText={placeholder}
        dateFormat="MM/dd/yyyy"
        className="custom-datepicker-input"
        wrapperClassName="datepicker-wrapper"
        popperClassName="datepicker-popper"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        showMonthDropdown
        dropdownMode="select"
      />
    </div>
  );
};

export default DateInput;
