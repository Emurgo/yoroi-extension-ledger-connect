// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages } from 'react-intl';

import type { DeviceCodeType }  from '../../../../types/cmn';
import HintBlock from '../../../widgets/HintBlock';
import HintGap from '../../../widgets/HintGap';

import styles from './ConnectLedgerHintBlock.scss';

const message = defineMessages({
  sExportPublicKey: {
    id: 'hint.connect.exportPublicKey',
    defaultMessage: '!!!Check your Ledger screen, then press both buttons.'
  },
  sConfirmExportPublicKey: {
    id: 'hint.connect.confirmExportPublicKey',
    defaultMessage: '!!!Confirm exporting the public key by pressing both buttons.'
  },
  xExportPublicKey: {
    id: 'hint.connect.exportPublicKey',
    defaultMessage: '!!!Check your Ledger screen, then press both buttons.'
  },
  xConfirmExportPublicKey: {
    id: 'hint.connect.confirmExportPublicKey',
    defaultMessage: '!!!Confirm exporting the public key by pressing both buttons.'
  },
});

type Props = {|
  deviceCode: DeviceCodeType,
  wasDeviceLocked: boolean,
|};

@observer
export default class ConnectLedgerHintBlock extends React.Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };

  render() {
    const {
      deviceCode,
      wasDeviceLocked
    } = this.props;

    const stepStartNumber: number = wasDeviceLocked ? 2 : 0; // 2 = count of common step
    const imgConnect1 = require(`../../../../assets/img/nano-${deviceCode}/hint-connect-1.png`);
    const imgConnect2 = require(`../../../../assets/img/nano-${deviceCode}/hint-connect-2.png`);

    const content = (
      <div className={styles.stepsRow}>
        <HintBlock
          number={stepStartNumber + 1}
          text={message[`${deviceCode}ExportPublicKey`]}
          imagePath={imgConnect1}
        />
        <HintGap />
        <HintBlock
          number={stepStartNumber + 2}
          text={message[`${deviceCode}ConfirmExportPublicKey`]}
          imagePath={imgConnect2}
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
