/** Event object passed in on change of stripe element */
export type StripeElementEvent = {
  elementType: string;
  empty: boolean;
  complete: boolean;
  error?: StripeElementError;
  value?: string | object;
  brand?: string;
};

/** Error object on stripe element event */
export type StripeElementError = {
  message: string;
  code: string;
  type: string;
};
