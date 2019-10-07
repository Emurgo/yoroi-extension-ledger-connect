// @flow
export type MessageType = {
  action: string,
  success: boolean,
  payload: any
};

export type RequestType = {
  action: OparationNameType,
  params: any,
}

export type URLParams = {
  transportId: string,
  locale: string
}

export type VerifyAddressInfoType = {
  hdPath: string,
  address: string,
}

export const PROGRESS_STATE = Object.freeze({
  LOADING: 'LOADING',
  DEVICE_TYPE_SELECTION: 'DEVICE_TYPE_SELECTION',
  DETECTING_DEVICE: 'DETECTING_DEVICE',
  DEVICE_FOUND: 'DEVICE_FOUND',
});
export type ProgressStateType = $Values<typeof PROGRESS_STATE>;

export const OPARATION_NAME = Object.freeze({
  GET_LEDGER_VERSION: 'ledger-get-version',
  GET_EXTENDED_PUBLIC_KEY: 'ledger-get-extended-public-key',
  SIGN_TX: 'ledger-sign-transaction',
  SHOW_ADDRESS: 'ledger-show-address',
  DERIVE_ADDRESS: 'ledger-derive-address',
  CLOSE_WINDOW: 'close-window',
});
export type OparationNameType = $Values<typeof OPARATION_NAME>;

export const DEVICE_CODE = Object.freeze({
  NANO_S: 's',
  NANO_X: 'x',
});
export type DeviceCodeType = $Values<typeof DEVICE_CODE>;
