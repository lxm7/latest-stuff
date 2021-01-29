import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from 'semantic-ui-react';
import { DateTime } from 'luxon';

// common
import { InputLabel } from 'components/common/styles';
import SelectDropdown from 'components/common/SelectDropdown';
import { searchFilteredResultsByLabel } from 'components/common/SelectDropdown/utils';

import { Option } from 'components/common/types';
import { StyledRequiredText } from 'components/eprofile/styles';

// local
import { requiredStar } from 'components/common/Consts';
import { DatePickerState, DatePickerProps } from './types';
import { months } from './defaults';
import { StyledErrorMessage, customDropdownStyles } from './styles';
import {
  hasError,
  getDays,
  getYearsOptions,
  isIssuedAfterToday,
} from './utils';

/**
 * DatePicker component set for Eprofile modals
 */
const DatePicker: React.FC<DatePickerProps> = ({
  fields,
  type = 'dob',
  disabled,
  dropdownGroupLabel,
  required = false,
  name,
  control,
  register,
  setConcatValue,
  errorPath,
}) => {
  // Pass in the fields we want as state to handle all key props related to dropdown
  const [state, setState] = useState({ ...fields });
  const { day, month, year } = state as DatePickerState;
  // Handle the days in a month in its own state
  const [currentDaysInMonth, setCurrentDaysInMonth] = useState(getDays());

  /**
   * this loads the days options derived from currentDaysInMonth state
   */
  const loadOptionsDays = async () => ({
    options: currentDaysInMonth,
    hasMore: false,
  });

  /**
   * this wraps loadOptionsDays above to memoise the result of its return result
   * using useCallback and we check if the new options list has change
   * in `, [JSON.stringify(currentDaysInMonth)]`
   */
  const loadDynamicDays = useCallback(async () => {
    const result = await loadOptionsDays();
    return result;
  }, [JSON.stringify(currentDaysInMonth)]);

  /**
   * this loads the months options from a static list.
   */
  const loadOptionsMonths = async () => ({
    options: months,
    hasMore: false,
  });

  /**
   * this loads the years options customised by a type we supply to getYearsOptions
   */
  const loadOptionsYears = async (search: string) => {
    const options = getYearsOptions(type);
    const filteredOptions = searchFilteredResultsByLabel(search, options);
    return {
      options: filteredOptions,
      hasMore: false,
    };
  };

  /**
   * this fires any time an input changes and updates our state
   * We also reset the error message to be empty as we now have a value.
   * @param {Option} valueParam
   */
  const onChange = (valueParam: Option) => {
    if (!valueParam) return state;
    const { field, value, label, ...rest } = valueParam;

    setState((prevState) => {
      return {
        ...prevState,
        [field as string]: {
          ...prevState[field as string],
          ...rest,
          value: value.toString(),
          label: label.toString(),
          error: '',
        },
      };
    });
  };

  /**
   * this resets the days input value to be deselected if
   * users pick non existant date i.e, 31/02 and gives an error msg
   * @param {number} daysInMonth
   */
  const resetDaysOption = (daysInMonth: number) => {
    setState((prevState) => ({
      ...prevState,
      ...(!daysInMonth && {
        day: {
          ...prevState.day,
          key: null,
          value: '',
          label: '',
          error: 'Please select a date within range',
        },
      }),
    }));

    setCurrentDaysInMonth(getDays(daysInMonth));
  };

  /**
   * this supplies the daysInMonth worked out by Luxon to our resetDaysOption
   * functon and calls if any of the of the input values have changed
   */
  useEffect(() => {
    const dateValue = DateTime.local(
      +year?.value,
      +month?.value || 1,
      +day?.value || 1
    );
    const { daysInMonth } = dateValue;
    resetDaysOption(daysInMonth);

    // if all the dropdowns have a value we can set the date in a
    // single string ready to send to server
    if (day?.value && month?.value && year?.value) {
      setConcatValue(dateValue.toString());
    }
  }, [day?.value, month?.value, year?.value]);

  /**
   * this checks whether the user selects a date later than today when type 'issued'
   * is supplied to datepicker
   */
  useEffect(() => {
    if (isIssuedAfterToday(type, { day, month, year })) {
      return setState((prevState) => ({
        ...prevState,
        day: {
          ...prevState.day,
          key: null,
          value: '',
          label: '',
          error: 'Please select a date before today',
        },
      }));
    }
  }, [day?.value, month?.value, year?.value]);

  const handleRHFRegister = (field: string) =>
    required
      ? register({
          required: true,
          name: `${name}.${field}`,
        })
      : register;

  return (
    <>
      {dropdownGroupLabel && (
        <InputLabel>
          {dropdownGroupLabel}{' '}
          {required && <StyledRequiredText>{requiredStar}</StyledRequiredText>}
        </InputLabel>
      )}
      <Grid stackable data-testid="date-picker" columns="equal">
        <Grid.Column>
          <SelectDropdown
            label={day.field}
            disabled={disabled}
            placeholder="Day"
            inputName={`${name}.day`}
            styles={hasError(day) ? { ...customDropdownStyles } : {}}
            loadOptions={loadDynamicDays}
            cacheUniqs={[JSON.stringify(currentDaysInMonth)]}
            onChange={onChange}
            control={control}
            register={handleRHFRegister('day')}
            rules={{ required: 'Please select a day' }}
            error={errorPath?.day?.message}
          />
          {hasError(day) && (
            <StyledErrorMessage>{day.error}</StyledErrorMessage>
          )}
        </Grid.Column>
        <Grid.Column>
          <SelectDropdown
            label={month.field}
            disabled={disabled}
            placeholder="Month"
            inputName={`${name}.month`}
            styles={hasError(month) ? { ...customDropdownStyles } : {}}
            loadOptions={loadOptionsMonths}
            onChange={onChange}
            control={control}
            register={handleRHFRegister('month')}
            rules={{ required: 'Please select a month' }}
            error={errorPath?.month?.message}
          />
          {hasError(month) && (
            <StyledErrorMessage>{month.error}</StyledErrorMessage>
          )}
        </Grid.Column>
        <Grid.Column>
          <SelectDropdown
            isClearable
            label={year.field}
            disabled={disabled}
            placeholder="Year"
            inputName={`${name}.year`}
            styles={hasError(year) ? { ...customDropdownStyles } : {}}
            loadOptions={loadOptionsYears}
            onChange={onChange}
            control={control}
            register={handleRHFRegister('year')}
            rules={{ required: 'Please select a year' }}
            error={errorPath?.year?.message}
          />
          {hasError(year) && (
            <StyledErrorMessage>{fields.year.error}</StyledErrorMessage>
          )}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default DatePicker;
