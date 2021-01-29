import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { general } from 'components/eprofile/langEn';

// common
import TextInput from 'components/common/TextInput';
import SelectDropdown, {
  CustomSelectOption,
  CustomSelectValue,
} from 'components/common/SelectDropdown';
import { loadDailCodeOptions } from 'components/common/SelectDropdown/utils';
import { Option } from 'components/common/types';

// local
import { TelephoneInputsProps } from './types';

/**
 * TelephoneInputs component set for Eprofile modals
 */
const TelephoneInputs: React.FC<TelephoneInputsProps> = ({
  fields,
  dataTestId,
  control,
  disabled,
  register,
  setPhoneNumber,
  name,
  label,
  required = false,
  diallingCodeRules,
  diallingCodeError,
  numberRules,
  numberError,
}) => {
  const [state, setState] = useState({ ...fields });
  const { countryCode, areaNumber, national } = state;

  /**
   * this fires any time an dropdown changes and updates our state
   * We also reset the error message to be empty as we now have a value.
   * @param {Option} valueParam
   */
  const onChangeDropdown = (valueParam: Option) => {
    setState((prevState) => {
      return {
        ...prevState,
        countryCode: {
          ...prevState.countryCode,
          ...valueParam,
        },
      };
    });
  };

  /**
   * this fires any time an input changes and updates our state
   * We also reset the error message to be empty as we now have a value.
   * @param {Option} event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setState((prevState) => {
      return {
        ...prevState,
        national: event.target?.value,
      };
    });
  };

  // Merges the 3 input values into a single string for our API calls
  useEffect(() => {
    const phoneNumber = parsePhoneNumberFromString(
      `${countryCode.value} ${national}`
    );

    setPhoneNumber(phoneNumber?.number as string);
  }, [countryCode, areaNumber, national]);

  return (
    <Grid stackable data-testid={dataTestId} columns="equal">
      <Grid.Column>
        <SelectDropdown
          isClearable
          required={required}
          label="Dialling code"
          inputName={`${name}.countryCode`}
          placeholder={general.selectGenericPlaceholder}
          disabled={disabled}
          loadOptions={loadDailCodeOptions}
          components={{
            Option: CustomSelectOption,
            SingleValue: CustomSelectValue,
          }}
          onChange={onChangeDropdown}
          control={control}
          register={register}
          rules={diallingCodeRules}
          error={diallingCodeError}
        />
      </Grid.Column>
      {areaNumber && (
        <Grid.Column>
          <TextInput
            type="text"
            label="Area"
            name={`${name}.areaNumber`}
            placeholder={general.inputGenericPlaceholder}
            onChange={onChange}
            disabled={disabled}
            control={control}
            register={register}
          />
        </Grid.Column>
      )}

      <Grid.Column>
        <TextInput
          type="text"
          disabled={disabled}
          required={required}
          label={`${label} number`}
          name={`${name}.national`}
          placeholder={general.inputGenericPlaceholder}
          onChange={onChange}
          control={control}
          register={register}
          rules={numberRules}
          error={numberError}
        />
      </Grid.Column>
    </Grid>
  );
};

export default TelephoneInputs;
