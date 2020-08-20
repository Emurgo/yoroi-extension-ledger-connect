/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
// @flow //
import React from 'react';
import { observer } from 'mobx-react';
import { cardano, CertTypes, AddressTypeNibbles } from '@cardano-foundation/ledgerjs-hw-app-cardano';

import type { TransportIdType } from '../../types/enum';
import {
  OPERATION_NAME,
  TRANSPORT_ID,
} from '../../types/enum';
import type {
  setLocaleFunc,
  setTransportFunc,
} from '../../types/func';
import { YOROI_LEDGER_CONNECT_TARGET_NAME } from '../../const';
import { SUPPORTED_LOCALS } from '../../i18n/translations';

import styles from './TestBlock.scss';

const MainnetIds = Object.freeze({
  protocolMagic: 764824073, // for legacy Byron-era addresses
  chainNetworkId: 1, // for Shelley-era addresses
});

type Props = {|
  setLocale: setLocaleFunc,
  setTransport: setTransportFunc,
  currentTransportId: TransportIdType,
  currentLocale: string
|};

type State = {|
  visible: string,
|};

@observer
export default class TestBlock extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      visible: `${styles.visible}`,
    };
  }

  onCompClicked = (): void => {
    this.setState({ visible: `${styles.visible}` });
  }

  onCompDoubleClicked = () => {
    this.setState({ visible: `${styles.hidden}` });
  }

  onLangSelectionChange = (locale: string): void => {
    if (this.props.currentTransportId !== locale &&
      this.state.visible === `${styles.visible}`
    ) {
      this.props.setLocale(locale);
      console.debug(`[YLC] Language Selection Changed to : ${locale}`);
    }
  };

  onTransportSelectionChange = (transportId: TransportIdType): void => {
    if (this.props.currentLocale !== transportId &&
      this.state.visible === `${styles.visible}`
    ) {
      this.props.setTransport(transportId);
      console.debug(`[YLC] Transport Selection Changed to : ${transportId}`);
    }
  };

  render() {
    const supportedLocals = (
      SUPPORTED_LOCALS.map(locale => {
        return (
          <div key={locale}>
            <input
              type="radio"
              name="language"
              id={locale}
              checked={this.props.currentLocale === locale}
              onChange={this.onLangSelectionChange.bind(this, locale)}
            />
            <label htmlFor={locale}>{locale}</label>
          </div>
        );
      })
    );

    const transportSelection = (
      <div className={styles.transportSelection}>
        {Object.keys(TRANSPORT_ID).map(key => {
          if (Object.prototype.hasOwnProperty.call(TRANSPORT_ID, key)) {
            const tranportId = TRANSPORT_ID[key];
            return (
              <span key={tranportId}>
                <input
                  key={tranportId}
                  type="radio"
                  name="transport"
                  id={tranportId}
                  checked={this.props.currentTransportId === tranportId}
                  onChange={this.onTransportSelectionChange.bind(this, tranportId)}
                />
                <label className={styles.tranportLabel} htmlFor={tranportId}>{tranportId}</label>
              </span>
            );
          }
          return null;
        })}
      </div>
    );

    const operationSelection = (
      <div className={styles.operationSelection}>
        <div>
          <button type="button" onClick={this.onExtendedByronPublicKey}>Extended Byron key</button>
          <button type="button" onClick={this.onExtendedShelleyPublicKey}>Extended Shelley key</button>
        </div>
        <button type="button" onClick={this.onSignTransaction}>Sign Transaction</button>
        <div>
          <button type="button" onClick={this.onShowAddress}>Verify Address</button>
        </div>
        <button type="button" onClick={this.onDeriveAddress}>Derive Address</button>
        <button type="button" onClick={this.onLogVersion}>Device Version</button>
        <button type="button" onClick={this.onLogSerial}>Serial Number</button>
      </div>
    );

    const visibilityInfo = (
      <div className={styles.visibilityInfo}>
        *Double click=invisible | single click=visible again
      </div>
    );

    return (
      <div
        className={`${styles.component} ${this.state.visible}`}
        onClick={this.onCompClicked}
        onDoubleClick={this.onCompDoubleClicked}
      >
        <div className={styles.column1}>
          {supportedLocals}
        </div>
        <div className={styles.column2}>
          {transportSelection}
          {operationSelection}
          {visibilityInfo}
        </div>
      </div>
    );
  }

  /**
   * Test getVersion
   */
  onLogVersion = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const req = this.makeRequest(
        OPERATION_NAME.GET_LEDGER_VERSION,
        null
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onLogVersion`);
  }

  /**
   * Test getSerial
   */
  onLogSerial = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const req = this.makeRequest(
        OPERATION_NAME.GET_SERIAL,
        null
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onLogSerial`);
  }

  /**
   * Test getExtendedPublicKey
   */
  onExtendedByronPublicKey = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const hdPath = cardano.str_to_path("44'/1815'/0'");

      const req = this.makeRequest(
        OPERATION_NAME.GET_EXTENDED_PUBLIC_KEY,
        { hdPath }
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onExtendedByronPublicKey`);
  }
  onExtendedShelleyPublicKey = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const hdPath = cardano.str_to_path("1852'/1815'/0'");

      const req = this.makeRequest(
        OPERATION_NAME.GET_EXTENDED_PUBLIC_KEY,
        { hdPath }
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onExtendedByronPublicKey`);
  }

  /**
   * Test signTransaction
   */
  onSignTransaction = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const inputs = [
        {
          txHashHex: 'e3a768c5b3109fa3268d875316063809a298602a272d7933c2b4443b69058d7a',
          outputIndex: 0,
          path: cardano.str_to_path("1852'/1815'/0'/0/0")
        }
      ];

      const outputs = [
        {
          amountStr: '700000',
          // Ae2tdPwUPEZCfyggUgSxD1E5UCx5f5hrXCdvQjJszxE7epyZ4ox9vRNUbHf
          addressHex: '82d818582183581c9f01f38ec3af8341f45a301b075bfd6fd0cfbaddb01c5ebe780918b9a0001adb482c56',
        },
        {
          addressTypeNibble: AddressTypeNibbles.BASE,
          amountStr: '100000',
          spendingPath: cardano.str_to_path("1852'/1815'/0'/1/0"),
          stakingBlockchainPointer: undefined,
          stakingKeyHashHex: undefined,
          stakingPath: cardano.str_to_path("1852'/1815'/0'/2/0"),
        }
      ];

      const req = this.makeRequest(
        OPERATION_NAME.SIGN_TX,
        {
          networkId: MainnetIds.chainNetworkId,
          protocolMagic: MainnetIds.protocolMagic,
          inputs,
          outputs,
          feeStr: '500',
          ttlStr: '20',
          certificates: [{
            type: CertTypes.staking_key_registration,
            path: cardano.str_to_path("1852'/1815'/0'/2/0"),
          },
          {
            type: CertTypes.delegation,
            path: cardano.str_to_path("1852'/1815'/0'/2/0"),
            poolKeyHashHex: 'df1750df9b2df285fcfb50f4740657a18ee3af42727d410c37b86207',
          },
          {
            type: CertTypes.staking_key_deregistration,
            path: cardano.str_to_path("1852'/1815'/0'/2/0"),
          }],
          withdrawals: [{
            path: cardano.str_to_path("1852'/1815'/0'/2/0"),
            amountStr: '1000000',
          }],
          metadataHashHex: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        }
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onSignTransaction`);
  }

  /**
   * Test showAddress = Verify Address
   */
  onShowAddress = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const req = this.makeRequest(
        OPERATION_NAME.SHOW_ADDRESS,
        {
          address: 'Ae2tdPwUPEZ46CWnexxkBpEM4Y1Y2QQxz8zDE9TtFK6PjM7xsizBAPShHVV',
          addressTypeNibble: AddressTypeNibbles.BASE,
          networkIdOrProtocolMagic: MainnetIds.chainNetworkId,
          spendingPath: cardano.str_to_path("1852'/1815'/0'/0/0"),
          stakingPath: cardano.str_to_path("1852'/1815'/0'/2/0"),
          stakingKeyHashHex: null,
          stakingBlockchainPointer: null,
        }
        // {
        //   address: 'Ae2tdPwUPEZ46CWnexxkBpEM4Y1Y2QQxz8zDE9TtFK6PjM7xsizBAPShHVV',
        //   addressTypeNibble: AddressTypeNibbles.BYRON,
        //   networkIdOrProtocolMagic: MainnetIds.protocolMagic,
        //   spendingPath: cardano.str_to_path("44'/1815'/1'/1/0"),
        //   stakingPath: null,
        //   stakingKeyHashHex: null,
        //   stakingBlockchainPointer: null,
        // }
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onShowAddress`);
  }

  /**
   * Test deriveAddress
   */
  onDeriveAddress = (): void => {
    if (this.state.visible === `${styles.visible}`) {
      const req = this.makeRequest(
        OPERATION_NAME.DERIVE_ADDRESS,
        {
          addressTypeNibble: AddressTypeNibbles.BYRON,
          networkIdOrProtocolMagic: MainnetIds.protocolMagic,
          spendingPath: cardano.str_to_path("44'/1815'/0'/0/0"),
          stakingPath: null,
          stakingKeyHashHex: null,
          stakingBlockchainPointer: null
        }
      );
      window.postMessage(req);
    }
    console.debug(`[YLC] TEST:onDeriveAddress`);
  }

  /**
   * Makes Request object
   */
  makeRequest = (action: string, params: any) => {
    return {
      action,
      params,
      target: YOROI_LEDGER_CONNECT_TARGET_NAME,
    };
  }
}
