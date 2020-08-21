// @flow //
import { observable, action, runInAction, computed } from 'mobx';
import AdaApp from '@cardano-foundation/ledgerjs-hw-app-cardano';
import type {
  BIP32Path,
  InputTypeUTxO,
  OutputTypeAddress,
  OutputTypeAddressParams,
  StakingBlockchainPointer,
  Certificate,
  Withdrawal,
  GetVersionResponse,
  GetSerialResponse,
  DeriveAddressResponse,
  GetExtendedPublicKeyResponse,
  SignTransactionResponse,
} from '@cardano-foundation/ledgerjs-hw-app-cardano';

import type {
  MessageType,
  RequestType,
  VerifyAddressInfoType,
  DeriveAddressRequest,
} from '../types/cmn';
import type {
  DeviceCodeType,
  ProgressStateType,
  OperationNameType,
  TransportIdType,
} from '../types/enum';
import {
  PROGRESS_STATE,
  OPERATION_NAME,
  DEVICE_CODE,
} from '../types/enum';
import {
  YOROI_LEDGER_CONNECT_TARGET_NAME,
  DEVICE_LOCK_CHECK_TIMEOUT_MS
} from '../const';
import {
  ledgerErrToMessage,
  makeTransport,
  convertStringToDeviceCodeType,
  formatError,
} from '../utils/cmn';
import {
  setKnownDeviceCode,
  getKnownDeviceCode,
} from '../utils/storage';

export type ExtendedPublicKeyResp = {
  ePublicKey: GetExtendedPublicKeyResponse,
  deviceVersion: GetVersionResponse
};

export default class ConnectStore {
  @observable transportId: TransportIdType;
  @observable progressState: ProgressStateType;
  @observable currentOperationName: OperationNameType;
  @observable verifyAddressInfo: VerifyAddressInfoType;
  @observable deriveAddressInfo: DeriveAddressRequest;
  @observable deviceCode: DeviceCodeType
  @observable wasDeviceLocked: boolean;
  userInteractableRequest: RequestType;

  constructor(transportId: TransportIdType) {
    window.addEventListener('message', this._onMessage);

    runInAction(() => {
      this.wasDeviceLocked = false;
      this.transportId = transportId;
      this.progressState = PROGRESS_STATE.LOADING;
      this.deviceCode = convertStringToDeviceCodeType(getKnownDeviceCode());
    });
  }

  @computed
  get isTransportWebAuthn(): boolean {
    return this.transportId === 'webauthn';
  }

  @computed
  get isTransportU2F(): boolean {
    return this.transportId === 'u2f';
  }

  @computed
  get isTransportWebUSB(): boolean {
    return this.transportId === 'webusb';
  }

  @action('Changing Transport')
  setTransport = (transportId: TransportIdType): void => {
    this.transportId = transportId;
  }

  @action('Changing Progress State')
  setProgressState = (progressState: ProgressStateType): void => {
    this.progressState = progressState;
  }

  @action('Changing Current Operation Name')
  setCurrentOperationName = (currentOperationName: OperationNameType): void => {
    this.currentOperationName = currentOperationName;
  }

  @action('Changing device name')
  setDeviceCode = (deviceCode: DeviceCodeType): void => {
    this.deviceCode = deviceCode;
  }

  @action('Change Verify Address Info')
  setVerifyAddressInfo = (verifyAddressInfo: VerifyAddressInfoType): void => {
    this.verifyAddressInfo = verifyAddressInfo;
  }

  @action('Change Derive Address Info')
  setDeriveAddressInfo = (deriveAddressInfo: DeriveAddressRequest): void => {
    this.deriveAddressInfo = deriveAddressInfo;
  }

  _detectLedgerDevice = async (transport: any): Promise<GetVersionResponse> => {

    setTimeout(() => {
      // Device is not detected till now so we assume that it's locked
      if (this.progressState === PROGRESS_STATE.DEVICE_TYPE_SELECTED) {
        runInAction(() => {
          this.wasDeviceLocked = true;
          this.setProgressState(PROGRESS_STATE.DETECTING_DEVICE);
        });
      }
    }, DEVICE_LOCK_CHECK_TIMEOUT_MS);

    const adaApp = new AdaApp(transport);
    const verResp = await adaApp.getVersion();

    this.setProgressState(PROGRESS_STATE.DEVICE_FOUND);

    return verResp;
  }

  executeActionWithCustomRequest = (
    deviceCode: DeviceCodeType,
    request: RequestType
  ) => {
    this.userInteractableRequest = request;
    this.executeAction(deviceCode);
  }

  executeAction = (deviceCode: DeviceCodeType) => {
    runInAction(() => {
      setKnownDeviceCode(deviceCode);
      this.setDeviceCode(deviceCode);
      this.setProgressState(PROGRESS_STATE.DEVICE_TYPE_SELECTED);
    });

    const actn = this.userInteractableRequest.action;
    const { params } = this.userInteractableRequest;

    switch (actn) {
      case OPERATION_NAME.GET_LEDGER_VERSION:
        this.getVersion(actn);
        break;
      case OPERATION_NAME.GET_SERIAL:
        this.getSerial(actn);
        break;
      case OPERATION_NAME.GET_EXTENDED_PUBLIC_KEY:
        this.getExtendedPublicKey(actn, params.hdPath);
        break;
      case OPERATION_NAME.SIGN_TX:
        this.signTransaction(
          actn,
          params.networkId,
          params.protocolMagic,
          params.inputs,
          params.outputs,
          params.feeStr,
          params.ttlStr,
          params.certificates,
          params.withdrawals,
          params.metadataHashHex,
        );
        break;
      case OPERATION_NAME.SHOW_ADDRESS:
        this.showAddress({
          actn,
          params,
        });
        break;
      case OPERATION_NAME.DERIVE_ADDRESS:
        this.deriveAddress({
          actn,
          params,
        });
        break;
      default:
        throw new Error(`[YLC] Unexpected action called: ${actn}`);
    }
  }

  // #==============================================#
  //  Cardano Ledger APIs
  // #==============================================#

  getExtendedPublicKey = async (actn: OperationNameType, hdPath: BIP32Path): Promise<void> => {
    let transport;
    try {
      transport = await makeTransport(this.transportId);
      const verResp = await this._detectLedgerDevice(transport);

      const adaApp = new AdaApp(transport);
      const ePublicKeyResp: GetExtendedPublicKeyResponse =
        await adaApp.getExtendedPublicKey(hdPath);

      const resp = {
        ePublicKey: ePublicKeyResp,
        deviceVersion: verResp,
      };
      this._replyMessageWrap(actn, true, resp);
    } catch (err) {
      this._replyError(actn, err);
    } finally {
      transport && transport.close();
    }
  };

  signTransaction = async (
    actn: OperationNameType,
    networkId: number,
    protocolMagic: number,
    inputs: Array<InputTypeUTxO>,
    outputs: Array<OutputTypeAddress | OutputTypeAddressParams>,
    feeStr: string,
    ttlStr: string,
    certificates: Array<Certificate>,
    withdrawals: Array<Withdrawal>,
    metadataHashHex: ?string
  ): Promise<void> => {
    let transport;
    try {
      transport = await makeTransport(this.transportId);
      await this._detectLedgerDevice(transport);

      const adaApp = new AdaApp(transport);
      const resp: SignTransactionResponse = await adaApp.signTransaction(
        networkId,
        protocolMagic,
        inputs,
        outputs,
        feeStr,
        ttlStr,
        certificates,
        withdrawals,
        metadataHashHex,
      );

      this._replyMessageWrap(actn, true, resp);
    } catch (err) {
      this._replyError(actn, err);
    } finally {
      transport && transport.close();
    }
  };

  showAddress: {|
    actn: OperationNameType,
    params: VerifyAddressInfoType,
  |} => Promise<void> = async (request) => {
    let transport;
    try {
      this.setVerifyAddressInfo(request.params);

      transport = await makeTransport(this.transportId);
      await this._detectLedgerDevice(transport);

      const adaApp = new AdaApp(transport);
      const resp = await adaApp.showAddress(
        request.params.addressTypeNibble,
        request.params.networkIdOrProtocolMagic,
        request.params.spendingPath,
        request.params.stakingPath,
        request.params.stakingKeyHashHex,
        request.params.stakingBlockchainPointer,
      );

      this._replyMessageWrap(request.actn, true, resp);
    } catch (err) {
      this._replyError(request.actn, err);
    } finally {
      transport && transport.close();
    }
  };

  deriveAddress: {|
    actn: OperationNameType,
    params: DeriveAddressRequest,
  |} => Promise<void> = async (request) => {
    let transport;
    try {
      this.setDeriveAddressInfo(request.params);

      transport = await makeTransport(this.transportId);
      await this._detectLedgerDevice(transport);

      const adaApp = new AdaApp(transport);
      const resp: DeriveAddressResponse = await adaApp.deriveAddress(
        request.params.addressTypeNibble,
        request.params.networkIdOrProtocolMagic,
        request.params.spendingPath,
        request.params.stakingPath,
        request.params.stakingKeyHashHex,
        request.params.stakingBlockchainPointer,
      );

      this._replyMessageWrap(request.actn, true, resp);
    } catch (err) {
      this._replyError(request.actn, err);
    } finally {
      transport && transport.close();
    }
  };

  getVersion = async (actn: OperationNameType): Promise<void> => {
    let transport;
    try {
      transport = await makeTransport(this.transportId);

      const adaApp = new AdaApp(transport);
      const resp: GetVersionResponse = await adaApp.getVersion();

      this._replyMessageWrap(actn, true, resp);
    } catch (err) {
      this._replyError(actn, err);
    } finally {
      transport && transport.close();
    }
  };

  getSerial = async (actn: OperationNameType): Promise<void> => {
    let transport;
    try {
      transport = await makeTransport(this.transportId);

      const adaApp = new AdaApp(transport);
      const resp: GetSerialResponse = await adaApp.getSerial();

      this._replyMessageWrap(actn, true, resp);
    } catch (err) {
      this._replyError(actn, err);
    } finally {
      transport && transport.close();
    }
  };

  // #==============================================#
  //  Website <==> Content Script communications
  // #==============================================#

  /**
   * Handle message from Content Script [ Website <== Content Script ]
   * @param {*} req request message object
   */
  _onMessage = (req: any): void => {
    const { data } = req;
    if (data &&
      data.action &&
      data.target === YOROI_LEDGER_CONNECT_TARGET_NAME) {

      const { params } = data;
      const actn = data.action;

      console.debug(`[YLC] request: ${actn}`);

      switch (actn) {
        case OPERATION_NAME.GET_LEDGER_VERSION:
        case OPERATION_NAME.GET_SERIAL:
        case OPERATION_NAME.GET_EXTENDED_PUBLIC_KEY:
        case OPERATION_NAME.SIGN_TX:
        case OPERATION_NAME.SHOW_ADDRESS:
        case OPERATION_NAME.DERIVE_ADDRESS:
          // Only one operation in one session
          if (!this.userInteractableRequest) {
            this.userInteractableRequest = {
              params,
              action: actn,
            };

            runInAction(() => {
              // In case of create wallet, we always
              // want user to choose device
              if (actn === OPERATION_NAME.GET_EXTENDED_PUBLIC_KEY) {
                this.setDeviceCode(DEVICE_CODE.NONE);
                setKnownDeviceCode(DEVICE_CODE.NONE);
              }
              this.setCurrentOperationName(actn);
              this.setProgressState(PROGRESS_STATE.DEVICE_TYPE_SELECTION);
            });
          }
          break;
        case OPERATION_NAME.CLOSE_WINDOW:
          window.close();
          break;
        default:
          console.error(`[YLC] Unexpected action requested: ${actn}`);
          break;
      }
    } else {
      console.debug(`[YLC] Got non ledger connectore\nrequest: ${req.origin}\ndata: ${JSON.stringify(req.data, null, 2)}`);
    }
  }

  /**
   * Wrapper for _replyMessage()
   * @param {*} actn action string
   * @param {*} success success status boolean
   * @param {*} payload payload object
   */
  _replyMessageWrap = (actn: string, success: boolean, payload: any): void => {
    this._replyMessage({
      success,
      payload,
      action: actn,
    });
  }

  /**
   * Wrapper for _replyMessage() for sending error
   * @param {*} actn action string
   * @param {*} err Error object
   */
  _replyError = (actn: string, err: Error): void => {
    console.error(`[YLC] ${actn}${formatError(err)}`);
    const payload = {
      error: ledgerErrToMessage(err).toString()
    };
    this._replyMessageWrap(actn, false, payload);
  }

  /**
   * Reply message to Content Script  [ Website ==> Content Script ]
   * @param {*} msg MessageType object as reply
   */
  _replyMessage = (msg: MessageType): void => {
    msg.action = `${msg.action}-reply`;
    window.postMessage(msg, '*');
  }
}
