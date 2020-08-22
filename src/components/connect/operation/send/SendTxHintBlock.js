// @flow //
import React from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages } from 'react-intl';

import type { SignTransactionRequest } from '../../../../types/cmn';
import type { DeviceCodeType }  from '../../../../types/enum';
import HintBlock from '../../../widgets/hint/HintBlock';
import HintGap from '../../../widgets/hint/HintGap';
import type { Certificate } from '@cardano-foundation/ledgerjs-hw-app-cardano';
import { CertTypes } from '@cardano-foundation/ledgerjs-hw-app-cardano';
import {
  pathToString,
} from '../../../../utils/cmn';

import styles from './SendTxHintBlock.scss';

const message = defineMessages({
  sStartNewTx: {
    id: 'hint.sendTx.startNewTx',
    defaultMessage: '!!!Check your Ledger screen, then press <strong>right</strong> button.'
  },
  sConfirmValue: {
    id: 'hint.sendTx.confirmValue',
    defaultMessage: '!!!Confirm the ADA amount by pressing <strong>both</strong> buttons.'
  },
  sConfirmAddress: {
    id: 'hint.sendTx.confirmAddress',
    defaultMessage: "!!!Confirm the receiver's address by pressing <strong>both</strong> buttons."
  },
  sConfirmFee: {
    id: 'hint.sendTx.confirmFee',
    defaultMessage: '!!!Confirm Transaction Fee by pressing <strong>both</strong> buttons.'
  },
  sConfirmTx: {
    id: 'hint.sendTx.confirmTx',
    defaultMessage: '!!!Confirm Transaction Fee by pressing <strong>both</strong> buttons.'
  },
  sTtl: {
    id: 'hint.sendTx.ttl',
    defaultMessage: '!!!Confirm the time-to-live by pressing <strong>both</strong> buttons.'
  },
  sRegistration: {
    id: 'hint.certificate.registration',
    defaultMessage: '!!!Confirm the staking key registration by pressing <strong>both</strong> buttons.'
  },
  sRegistrationComplete: {
    id: 'hint.certificate.registrationComplete',
    defaultMessage: '!!!Confirm the staking key registration by pressing the <strong>right</strong> button.'
  },
  sDeregistration: {
    id: 'hint.certificate.deregistration',
    defaultMessage: '!!!Confirm the deregistration by pressing <strong>both</strong> buttons.'
  },
  sDeregistrationComplete: {
    id: 'hint.certificate.deregistrationComplete',
    defaultMessage: '!!!Confirm the deregistration by pressing the <strong>right</strong> button.'
  },
  sDelegation: {
    id: 'hint.certificate.delegation',
    defaultMessage: '!!!Make sure the pool shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  sDelegationComplete: {
    id: 'hint.certificate.delegationComplete',
    defaultMessage: '!!!Confirm the delegation by pressing the <strong>right</strong> button.'
  },
  sPath: {
    id: 'hint.verifyAddress.path',
    defaultMessage: '!!!Make sure the address path shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  xStartNewTx: {
    id: 'hint.nanoX.sendTx.startNewTx',
    defaultMessage: '!!!Check your Ledger screen, then press <strong>both</strong> buttons.'
  },
  xConfirmValue: {
    id: 'hint.sendTx.confirmValue',
    defaultMessage: '!!!Confirm the ADA amount by pressing <strong>both</strong> buttons.'
  },
  xConfirmAddress: {
    id: 'hint.nanoX.sendTx.confirmAddress',
    defaultMessage: "!!!Confirm the receiver's address by pressing the <strong>right</strong> button to scroll through the entire address. Then press <strong>both</strong> buttons."
  },
  xConfirmFee: {
    id: 'hint.sendTx.confirmFee',
    defaultMessage: '!!!Confirm Transaction Fee by pressing <strong>both</strong> buttons.'
  },
  xConfirmTx: {
    id: 'hint.nanoX.sendTx.confirmTx',
    defaultMessage: '!!!Confirm the transaction by pressing the <strong>both</strong> buttons.'
  },
  xTtl: {
    id: 'hint.sendTx.ttl',
    defaultMessage: '!!!Confirm the time-to-live by pressing <strong>both</strong> buttons.'
  },
  xRegistration: {
    id: 'hint.certificate.registration',
    defaultMessage: '!!!Confirm the staking key registration by pressing <strong>both</strong> buttons.'
  },
  xRegistrationComplete: {
    id: 'hint.certificate.registrationComplete',
    defaultMessage: '!!!Confirm the staking key registration by pressing the <strong>right</strong> button.'
  },
  xDeregistration: {
    id: 'hint.certificate.deregistration',
    defaultMessage: '!!!Confirm the deregistration by pressing <strong>both</strong> buttons.'
  },
  xDeregistrationComplete: {
    id: 'hint.certificate.deregistrationComplete',
    defaultMessage: '!!!Confirm the deregistration by pressing the <strong>right</strong> button.'
  },
  xDelegation: {
    id: 'hint.certificate.delegation',
    defaultMessage: '!!!Make sure the pool shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
  xDelegationComplete: {
    id: 'hint.certificate.delegationComplete',
    defaultMessage: '!!!Confirm the delegation by pressing the <strong>right</strong> button.'
  },
  xPath: {
    id: 'hint.verifyAddress.path',
    defaultMessage: '!!!Make sure the address path shown on your Ledger is the same as the one shown below, then press <strong>both</strong> buttons.'
  },
});

type Props = {|
  deviceCode: DeviceCodeType,
  signTxInfo: SignTransactionRequest,
  wasDeviceLocked: boolean,
|};

@observer
export default class SendTxHintBlock extends React.Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };

  renderCertificate: {|
    cert: Certificate,
    getAndIncrementStep: void => number,
  |} => (null | Node) = (request) => {
    const stakingKey = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-staking-key.png`);

    if (request.cert.type === CertTypes.staking_key_registration) {
      const imgRegister = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-registration.png`);
      const imgRegisterConfirm = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-registration-confirm.png`);
      const firstStep = request.getAndIncrementStep();
      const secondStep = request.getAndIncrementStep();
      const thirdStep = request.getAndIncrementStep();
      return (
        <>
          <HintBlock
            key={firstStep}
            number={firstStep}
            text={message[`${this.props.deviceCode}Registration`]}
            imagePath={imgRegister}
          />
          <HintGap key={firstStep + 'gap'} />
          <HintBlock
            key={secondStep}
            number={secondStep}
            text={message[`${this.props.deviceCode}Path`]}
            imagePath={stakingKey}
            secondaryText={pathToString(request.cert.path)}
          />
          <HintGap key={secondStep + 'gap'} />
          <HintBlock
            key={thirdStep}
            number={thirdStep}
            text={message[`${this.props.deviceCode}RegistrationComplete`]}
            imagePath={imgRegisterConfirm}
          />
          <HintGap key={thirdStep + 'gap'} />
        </>
      );
    }
    if (request.cert.type === CertTypes.delegation) {
      const imgDelegatePool = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-delegation-pool.png`);
      const imgDelegateConfirm = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-delegation-confirm.png`);
      const firstStep = request.getAndIncrementStep();
      const secondStep = request.getAndIncrementStep();
      const thirdStep = request.getAndIncrementStep();
      return (
        <>
          <HintBlock
            key={firstStep}
            number={firstStep}
            text={message[`${this.props.deviceCode}Delegation`]}
            imagePath={imgDelegatePool}
            secondaryText={request.cert.poolKeyHashHex ?? ''}
          />
          <HintGap key={firstStep + 'gap'} />
          <HintBlock
            key={secondStep}
            number={secondStep}
            text={message[`${this.props.deviceCode}Path`]}
            imagePath={stakingKey}
            secondaryText={pathToString(request.cert.path)}
          />
          <HintGap key={secondStep + 'gap'} />
          <HintBlock
            key={thirdStep}
            number={thirdStep}
            text={message[`${this.props.deviceCode}DelegationComplete`]}
            imagePath={imgDelegateConfirm}
          />
          <HintGap key={thirdStep + 'gap'} />
        </>
      );
    }
    if (request.cert.type === CertTypes.staking_key_deregistration) {
      const imgDeregister = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-deregister-key.png`);
      const imgDeregisterConfirm = require(`../../../../assets/img/nano-${this.props.deviceCode}/hint-deregister-confirm.png`);
      const firstStep = request.getAndIncrementStep();
      const secondStep = request.getAndIncrementStep();
      const thirdStep = request.getAndIncrementStep();
      return (
        <>
          <HintBlock
            key={firstStep}
            number={firstStep}
            text={message[`${this.props.deviceCode}Deregistration`]}
            imagePath={imgDeregister}
          />
          <HintGap key={firstStep + 'gap'} />
          <HintBlock
            key={secondStep}
            number={secondStep}
            text={message[`${this.props.deviceCode}Path`]}
            imagePath={stakingKey}
            secondaryText={pathToString(request.cert.path)}
          />
          <HintGap key={secondStep + 'gap'} />
          <HintBlock
            key={thirdStep}
            number={thirdStep}
            text={message[`${this.props.deviceCode}DeregistrationComplete`]}
            imagePath={imgDeregisterConfirm}
          />
          <HintGap key={thirdStep + 'gap'} />
        </>
      );
    }
    //  unhandled certificate type
    return null;
  }

  render() {
    const {
      deviceCode,
      signTxInfo,
      wasDeviceLocked
    } = this.props;

    const stepStartNumber: number = wasDeviceLocked ? 2 : 0; // 2 = count of common step
    const imgSend1 = require(`../../../../assets/img/nano-${deviceCode}/hint-send-1.png`);
    const imgSend2 = require(`../../../../assets/img/nano-${deviceCode}/hint-send-2.png`);
    const imgSend3 = require(`../../../../assets/img/nano-${deviceCode}/hint-send-3.png`);
    const imgSend4 = require(`../../../../assets/img/nano-${deviceCode}/hint-send-4.png`);
    const imgSend5 = require(`../../../../assets/img/nano-${deviceCode}/hint-send-5.png`);
    const imgTtl = require(`../../../../assets/img/nano-${deviceCode}/hint-ttl.png`);

    let stepNumber = stepStartNumber;
    const getAndIncrementStep = () => {
      return ++stepNumber;
    };
    const content = (
      <div className={styles.stepsGrid}>
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}StartNewTx`]}
          imagePath={imgSend1}
        />
        <HintGap />
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}ConfirmValue`]}
          imagePath={imgSend2}
        />
        <HintGap />
        {signTxInfo.outputs.length > 0 && (
          <>
            <HintBlock
              number={++stepNumber}
              text={message[`${deviceCode}ConfirmAddress`]}
              imagePath={imgSend3}
            />
            <HintGap />
          </>
        )}
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}ConfirmFee`]}
          imagePath={imgSend4}
        />
        <HintGap />
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}Ttl`]}
          imagePath={imgTtl}
        />
        <HintGap />
        {signTxInfo.certificates.map(cert => this.renderCertificate({ cert, getAndIncrementStep }))}
        <HintBlock
          number={++stepNumber}
          text={message[`${deviceCode}ConfirmTx`]}
          imagePath={imgSend5}
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
