import React, { useEffect, useRef, useState } from 'react';
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

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getYearRange = (referenceYear: number) => {
  const currentYear = new Date().getFullYear();
  let startYear = Math.min(referenceYear, currentYear) - 60;
  const endYear = Math.max(referenceYear, currentYear) + 40;

  if (startYear < 1900) {
    startYear = 1900;
  }

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
};

type DatePickerHeaderProps = {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
};

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
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMonthMenuOpen(false);
        setYearMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMonthMenu = () => {
    setMonthMenuOpen((prev) => !prev);
    setYearMenuOpen(false);
  };

  const toggleYearMenu = () => {
    setYearMenuOpen((prev) => !prev);
    setMonthMenuOpen(false);
  };

  const handleMonthSelect = (monthIndex: number, changeMonth: (month: number) => void) => {
    changeMonth(monthIndex);
    setMonthMenuOpen(false);
  };

  const handleYearSelect = (year: number, changeYear: (year: number) => void) => {
    changeYear(year);
    setYearMenuOpen(false);
  };

  const renderHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: DatePickerHeaderProps) => {
    const yearOptions = getYearRange(date.getFullYear());

    return (
      <div className="datepicker-header" ref={headerRef}>
        <button
          type="button"
          className="datepicker-nav-btn"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          ‹
        </button>

        <div className="datepicker-header-controls">
          <div className="datepicker-dropdown">
            <button
              type="button"
              className="datepicker-select-trigger"
              onClick={toggleMonthMenu}
            >
              {MONTH_NAMES[date.getMonth()]} <span className="datepicker-caret">▾</span>
            </button>
            {monthMenuOpen && (
              <ul className="datepicker-select-menu">
                {MONTH_NAMES.map((month, index) => (
                  <li key={month}>
                    <button
                      type="button"
                      onClick={() => handleMonthSelect(index, changeMonth)}
                      className={date.getMonth() === index ? 'active' : ''}
                    >
                      {month}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="datepicker-dropdown">
            <button
              type="button"
              className="datepicker-select-trigger"
              onClick={toggleYearMenu}
            >
              {date.getFullYear()} <span className="datepicker-caret">▾</span>
            </button>
            {yearMenuOpen && (
              <ul className="datepicker-select-menu">
                {yearOptions.map((year) => (
                  <li key={year}>
                    <button
                      type="button"
                      onClick={() => handleYearSelect(year, changeYear)}
                      className={date.getFullYear() === year ? 'active' : ''}
                    >
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          className="datepicker-nav-btn"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          ›
        </button>
      </div>
    );
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
        renderCustomHeader={renderHeader}
      />
    </div>
  );
};

export default DateInput;
