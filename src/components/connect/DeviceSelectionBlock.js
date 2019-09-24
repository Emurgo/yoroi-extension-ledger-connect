// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages } from 'react-intl';
import classNames from 'classnames';

import type {
  DeviceNameType,
  ProgressStateType,
  OparationNameType
}  from '../../types/cmn';
import { DEVICE_NAME } from '../../types/cmn';
import OparationBlock from './operation/OparationBlock';
import styles from './DeviceSelectionBlock.scss';

const message = defineMessages({
  titleLedgerNanoS: {
    id: 'wallet.title.ledgerNanoS',
    defaultMessage: '!!!Ledger Nano S'
  },
  titleLedgerNanoX: {
    id: 'wallet.title.ledgerNanoX',
    defaultMessage: '!!!Ledger Nano X'
  },
});

type Props = {|
  executeAction: Function
|};

@observer
export default @observer class DeviceSelectionBlock extends React.Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };

  onButtonClicked = (deviceName: DeviceNameType) => {
    this.props.executeAction(deviceName);
  };

  render() {
    const { intl } = this.context;
    return (
      <div className={styles.component}>
        <div className={styles.deviceSelectionWrap}>
          <div className={styles.deviceSelection}>
            <div className={styles.title}>Choose your device</div>
            <button
              className={styles.device}
              type="button"
              onClick={this.onButtonClicked.bind(null, DEVICE_NAME.NANO_S)}>
              <div className={styles.text}>
                {intl.formatMessage(message.titleLedgerNanoS)}
              </div>
            </button>
            <button
              className={styles.device}
              type="button"
              onClick={this.onButtonClicked.bind(null, DEVICE_NAME.NANO_X)}>
              <div className={styles.text}>
                {intl.formatMessage(message.titleLedgerNanoX)}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
