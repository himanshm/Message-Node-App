// Defines the configuration object for the length validator
interface LengthConfig {
  min?: number;
  max?: number;
}

// Validator to check if the value is not empty
export const required = (value: string): boolean => value.trim() !== '';

// Validator to check if the value's length falls within a specified range
export const length =
  (config: LengthConfig) =>
  (value: string): boolean => {
    let isValid = true;
    if (config.min !== undefined) {
      isValid = isValid && value.trim().length >= config.min;
    }
    if (config.max !== undefined) {
      isValid = isValid && value.trim().length <= config.max;
    }
    return isValid;
  };

// Validator to check if the value is a valid email format
export const email = (value: string): boolean =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );
