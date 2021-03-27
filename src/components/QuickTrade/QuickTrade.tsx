import React, { useState } from 'react';

import { InfoIcon } from 'assets/icons';

import AmountInput from '../AmountInput';
import Button from '../Button';
import Checkbox from '../Checkbox';
import MarketSelect from '../MarketSelect';
import MiniTable from '../MiniTable';
import ToggleButton from '../ToggleButton';
import { markets, toggleButtonItems, miniTableItems } from './mock';

const QuickTrade = () => {
  const [acceptRules, setAcceptRules] = useState(false);
  const [acceptOddChanges, setAcceptOddChanges] = useState(false);

  function handleChangeAcceptRules() {
    setAcceptRules(!acceptRules);
  }

  function handleChangeAcceptOddChanges(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event.currentTarget);
    setAcceptOddChanges(!acceptOddChanges);
  }

  return (
    <div className="quick-trade sticky">
      <div className="quick-trade__group">
        <MarketSelect markets={markets} />
        <Button
          size="sm"
          style={{
            backgroundColor: '#12161D',
            color: '#F3F4F6',
            border: 'none'
          }}
        >
          <span>Add liquidity</span>
          <InfoIcon />
        </Button>
      </div>

      <div className="quick-trade__group">
        <ToggleButton buttons={toggleButtonItems} />
        <AmountInput label="Buy Fractions" max={0.0104} />
        <MiniTable items={miniTableItems} />
        <div className="quick-trade__terms">
          <Checkbox
            label="Accept rules of the agreement"
            checked={acceptRules}
            onChange={() => handleChangeAcceptRules()}
          />
          <Checkbox
            label="Accept any odd changes"
            checked={acceptOddChanges}
            onChange={event => handleChangeAcceptOddChanges(event)}
          />
        </div>
        <Button color="success" size="lg">
          Buy
        </Button>
      </div>
    </div>
  );
};

export default QuickTrade;
