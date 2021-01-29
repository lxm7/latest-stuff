import { hasError, getDays, getYears, getYearsOptions } from './utils';
import { customDropdownStyles } from './styles';

describe('DatePicker utils', () => {
  describe('hasError', () => {
    it('should return correct boolean after passing some dropdown option values', () => {
      const result1 = hasError({
        value: '',
        label: '',
        error: 'this is an error',
      });
      expect(result1).toBeTruthy();

      const result2 = hasError({
        value: 'value',
        label: 'value',
        error: '',
      });
      expect(result2).toBe(false);
    });
  });

  describe('getDays', () => {
    it('should return either 31 days as default or by the parameter value', () => {
      const result1 = getDays();
      const noOfDays = result1.length;
      expect(noOfDays).toBe(31);

      const result2 = getDays(28);
      const noOfDays2 = result2.length;
      expect(noOfDays2).toBe(28);
    });
  });

  describe('getYears', () => {
    it('should generate an array of years supplied by the params', () => {
      const result = getYears(2000, 2010);
      const noOfYears = result.length;
      expect(noOfYears).toBe(11);
    });
  });

  describe('getYearsOptions', () => {
    it('should generate the required array of years depending on type supplied', () => {
      const result = getYearsOptions('dob');
      const noOfYears = result.length;
      expect(noOfYears).toBe(101);

      const result2 = getYearsOptions('travel-start');
      const noOfYears2 = result2.length;
      expect(noOfYears2).toBe(6);

      const result3 = getYearsOptions('expiry');
      const noOfYears3 = result3.length;
      expect(noOfYears3).toBe(21);
    });
  });
  describe('custom style function', () => {
    it('should return custom styles along with border', () => {
      const result1 = customDropdownStyles.control({
        width: '100%',
      });
      expect(result1).toStrictEqual({
        border: '1px solid #e81212',
        width: '100%',
      });
    });
  });
});
