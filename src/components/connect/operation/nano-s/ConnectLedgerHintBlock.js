// @flow
import React from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages } from 'react-intl';

import OparationBase from '../base/OparationBase';
import type {
  DeviceNameType,
  ProgressStateType
}  from '../../../../types/cmn';
import {
  PROGRESS_STATE,
  OPARATION_NAME,
  DEVICE_NAME
} from '../../../../types/cmn';

import HintTextBlock from '../../../widgets/HintTextBlock';
import hintConnect1GIF from '../../../../assets/img/hint-connect-1.gif';
import hintConnect2GIF from '../../../../assets/img/hint-connect-2.gif';
import styles from './ConnectYoroiHintBlock.scss';

const message = defineMessages({
  nanoSPinCode: {
    id: 'hint.nanoS.common.pinCode',
    defaultMessage: '!!!Enter your PIN on your Ledger device, using the right and left buttons to select each number and then both buttons to confirm.'
  },
  nanoSCardanoApp: {
    id: 'hint.nanoS.common.CardanoApp',
    defaultMessage: '!!!Enter your PIN on your Ledger device, using the right and left buttons to select each number and then both buttons to confirm.'
  },  
  exportPublicKey: {
    id: 'hint.connect.exportPublicKey',
    defaultMessage: '!!!Press BOTH.'
  },
  confirmExportPublicKey: {
    id: 'hint.common.confirmExportPublicKey',
    defaultMessage: '!!!Press RIGHT.'
  },
});

type Props = {|
  deviceType: DeviceNameType,
  progressState: ProgressStateType,
|};

@observer
export default class ConnectYoroiHintBlock extends React.Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };

  render() {
    const { deviceType } = this.props;
    let LeftBlock = (<div>LEFT</div>);
    let RightBlock = (<div>RIGHT</div>);

    switch (deviceType) {
      case DEVICE_NAME.NANO_S:
        LeftBlock = (
          <div>
            <HintTextBlock
              number={1}
              text={message.nanoSPinCode}
              imagePath={hintConnect1GIF}
            />
            <HintTextBlock
              number={2}
              text={message.nanoSCardanoApp}
              imagePath={hintConnect2GIF}
            />
          </div>
        );

        RightBlock = (
          <div>
            <img src={hintConnect1GIF} alt="HintImage" />
          </div>
        );
        break;
      case DEVICE_NAME.NANO_X:
        break;
      default:
        return (null);
    }
    return (
      <OparationBase
        LeftBlock={LeftBlock}
        RightBlock={RightBlock}
      />
    );
  }
}
