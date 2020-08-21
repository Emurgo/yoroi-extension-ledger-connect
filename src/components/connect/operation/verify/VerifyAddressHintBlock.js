// @flow //
import React from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages } from 'react-intl';

import type { VerifyAddressInfoType } from '../../../../types/cmn';
import type { DeviceCodeType } from '../../../../types/enum';
import HintBlock from '../../../widgets/hint/HintBlock';
import HintGap from '../../../widgets/hint/HintGap';
import {
  pathToString,
} from '../../../../utils/cmn';
import { AddressTypeNibbles } from '@cardano-foundation/ledgerjs-hw-app-cardano';

import styles from './VerifyAddressHintBlock.scss';

const message = defineMessages({
  sInfo: {
    id: 'hint.verifyAddress.info',
    defaultMessage: '!!!Check your Ledger screen, then press <strong>both</strong> buttons.'
  },
  sPath: {
    id: 'hint.verifyAddress.path',
    defaultMessage: '!!!Make sure the address path shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  sAddress: {
    id: 'hint.verifyAddress.address',
    defaultMessage: '!!!Make sure the address shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  sWarning: {
    id: 'hint.warning',
    defaultMessage: '!!!Accept the warning by pressing <strong>both</strong> buttons.'
  },
  sHash: {
    id: 'hint.hash',
    defaultMessage: '!!!Make sure the hash shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  sPointer: {
    id: 'hint.pointer',
    defaultMessage: '!!!Make sure the pointer shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  xInfo: {
    id: 'hint.verifyAddress.info',
    defaultMessage: '!!!Check your Ledger screen, then press <strong>both</strong> buttons.'
  },
  xPath: {
    id: 'hint.verifyAddress.path',
    defaultMessage: '!!!Make sure the address path shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  xAddress: {
    id: 'hint.nanoX.verifyAddress.address',
    defaultMessage: '!!!Make sure the address shown on your Ledger is the same as the one shown below. Press the <strong>right</strong> button on your Ledger to scroll to the end of the address, then press <strong>both</strong> buttons.'
  },
  xWarning: {
    id: 'hint.warning',
    defaultMessage: '!!!Accept the warning by pressing <strong>both</strong> buttons.'
  },
  xHash: {
    id: 'hint.hash',
    defaultMessage: '!!!Make sure the hash shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  xPointer: {
    id: 'hint.pointer',
    defaultMessage: '!!!Make sure the pointer shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
});

type Props = {|
  deviceCode: DeviceCodeType,
  verifyAddressInfo: VerifyAddressInfoType,
  wasDeviceLocked: boolean
|};

@observer
export default class VerifyAddressHintBlock extends React.Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };

  render() {
    const {
      deviceCode,
      verifyAddressInfo,
      wasDeviceLocked
    } = this.props;

    const stepStartNumber: number = wasDeviceLocked ? 2 : 0; // 2 = count of common step
    const imgVerify1 = require(`../../../../assets/img/nano-${deviceCode}/hint-verify-1.png`);
    const imgVerify2 = require(`../../../../assets/img/nano-${deviceCode}/hint-verify-2.png`);
    const imgVerify3 = require(`../../../../assets/img/nano-${deviceCode}/hint-verify-3.png`);
    const stakingKey = require(`../../../../assets/img/nano-${deviceCode}/hint-staking-key.png`);
    const byronWarning = require(`../../../../assets/img/nano-${deviceCode}/hint-byron-warning.png`);
    const enterpriseWarning = require(`../../../../assets/img/nano-${deviceCode}/hint-enterprise-warning.png`);
    const rewardWarning = require(`../../../../assets/img/nano-${deviceCode}/hint-reward-warning.png`);
    const keyHash = require(`../../../../assets/img/nano-${deviceCode}/hint-keyhash.png`);
    const pointer = require(`../../../../assets/img/nano-${deviceCode}/hint-pointer.png`);

    let stepNumber = stepStartNumber;
    const content = (
      <div className={styles.stepsRow}>
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}Info`]}
          imagePath={imgVerify1}
        />
        <HintGap />
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}Path`]}
          imagePath={imgVerify2}
          secondaryText={pathToString(verifyAddressInfo.spendingPath)}
        />
        <HintGap />
        {verifyAddressInfo.addressTypeNibble === AddressTypeNibbles.BYRON && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Warning`]}
              imagePath={byronWarning}
            />
            <HintGap />
          </>
        )}
        {verifyAddressInfo.addressTypeNibble === AddressTypeNibbles.ENTERPRISE && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Warning`]}
              imagePath={enterpriseWarning}
            />
            <HintGap />
          </>
        )}
        {verifyAddressInfo.addressTypeNibble === AddressTypeNibbles.REWARD && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Warning`]}
              imagePath={rewardWarning}
            />
            <HintGap />
          </>
        )}
        {verifyAddressInfo.stakingPath != null && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Path`]}
              imagePath={stakingKey}
              secondaryText={pathToString(verifyAddressInfo.stakingPath)}
            />
            <HintGap />
          </>
        )}
        {verifyAddressInfo.stakingKeyHashHex != null && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Hash`]}
              imagePath={keyHash}
              secondaryText={verifyAddressInfo.stakingKeyHashHex}
            />
            <HintGap />
          </>
        )}
        {verifyAddressInfo.stakingBlockchainPointer != null && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}Pointer`]}
              imagePath={pointer}
              secondaryText={
                `(${verifyAddressInfo.stakingBlockchainPointer.blockIndex}, ${verifyAddressInfo.stakingBlockchainPointer.txIndex}, ${verifyAddressInfo.stakingBlockchainPointer.certificateIndex})`
              }
            />
            <HintGap />
          </>
        )}
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}Address`]}
          imagePath={imgVerify3}
          secondaryText={verifyAddressInfo.address}
        />
      </div>
    );

    return (
      <div className={styles.component}>
        {content}
      </div>
    );
  }
}
