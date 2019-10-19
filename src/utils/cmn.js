// @flow
import type { BIP32Path } from '@cardano-foundation/ledgerjs-hw-app-cardano';

import type {
  DeviceCodeType,
  TransportIdType
} from '../types/cmn';
import {
  DEVICE_CODE,
  TRANSPORT_ID
} from '../types/cmn';

const HARDENED = 0x80000000;

/**
 * Converts hardened BIP32Path to it's string version
 * @param {*} hdPath hardened BIP32Path
 */
export const pathToString = (hdPath: BIP32Path) => {
  return `m/${hdPath
    .map((item) => (item % HARDENED) + (item >= HARDENED ? "'" : ''))
    .join('/')}`;
};

/**
 * Converts error code to string
 * @param {*} err
 */
export const ledgerErrToMessage = (err: any): any => {
  const isU2FError = (error) => !!error && !!(error).metaData;
  const isStringError = (error) => typeof error === 'string';

  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  const isErrorWithId = (error) => (
    Object.prototype.hasOwnProperty.call(error, 'id') &&
    Object.prototype.hasOwnProperty.call(error, 'message')
  );

  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return 'LEDGER_TIMEOUT';
    }
    return err.metaData.type;
  }

  if (isStringError(err)) {
    // Wrong app logged into
    if (err.includes('6804')) {
      return 'LEDGER_WRONG_APP';
    }
    // Ledger locked
    if (err.includes('6801')) {
      return 'LEDGER_LOCKED';
    }
    return err;
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return 'U2F_NOT_SUPPORTED';
    }
  }

  // Other
  return err.toString();
};

/**
 * Create Ledger Transport protocol
 * @param {*} transportId TransportIdType
 */
export const makeTransport = async (transportId: TransportIdType): any => {
  let transport;

  switch (transportId) {
    case TRANSPORT_ID.WEB_AUTHN:
      transport = require('@ledgerhq/hw-transport-webauthn').default;
      break;
    case TRANSPORT_ID.U2F:
      transport = require('@ledgerhq/hw-transport-u2f').default;
      break;
    case TRANSPORT_ID.WEB_USB:
      transport = require('@ledgerhq/hw-transport-webusb').default;
      break;
    default:
      throw new Error('Transport protocol not supported');
  }

  return await transport.create();
};

/**
 * Converts deviceCodeInString to DeviceCodeType
 * @param {*} deviceCodeInString string
 */
export const convertStringToDeviceCodeType = (deviceCodeInString: string): DeviceCodeType => {
  switch (deviceCodeInString) {
    case DEVICE_CODE.NANO_S:
      return DEVICE_CODE.NANO_S;
    case DEVICE_CODE.NANO_X:
      return DEVICE_CODE.NANO_X;
    default:
      return DEVICE_CODE.NONE;
  }
};