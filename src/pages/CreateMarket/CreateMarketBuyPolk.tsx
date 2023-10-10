import { useState } from 'react';

import { roundNumber } from 'helpers/math';

import { Text, ProgressBar, Icon } from 'components';
import { ButtonLoading } from 'components/Button';

import { useAppSelector, useNetwork } from 'hooks';

type CreateMarketBuyPolkProps = {
  requiredPolkBalance: number;
};

function CreateMarketBuyPolk({
  requiredPolkBalance
}: CreateMarketBuyPolkProps) {
  const [isLoadingBuyPolk, setIsLoadingBuyPolk] = useState(false);

  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);

  const {
    network: { buyEc20Url }
  } = useNetwork();

  async function handleBuyPolk() {
    setIsLoadingBuyPolk(true);

    window.open(buyEc20Url, '_blank');

    setIsLoadingBuyPolk(false);
  }

  return (
    <div className="pm-p-create-market-buy-polk">
      <div className="pm-p-create-market-buy-polk__group--column">
        <Icon
          size="lg"
          name="Warning"
          className="pm-p-create-market-buy-polk__icon"
        />
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          className="pm-p-create-market-buy-polk__title"
        >
          <>
            {`You need an additional `}
            <Text
              as="strong"
              scale="body"
              fontWeight="semibold"
              className="pm-p-create-market-buy-polk__amount"
            >
              {`${roundNumber(requiredPolkBalance - polkBalance, 2)} POLK`}
            </Text>
            {` to create markets.`}
          </>
        </Text>
      </div>
      <ProgressBar
        min={0}
        max={requiredPolkBalance}
        percent={(polkBalance / requiredPolkBalance) * 100}
        color="warning"
      />
      {/* <ButtonLoading
        size="sm"
        color="warning"
        fullwidth
        onClick={handleBuyPolk}
        loading={isLoadingBuyPolk}
      >
        Buy $POLK
      </ButtonLoading> */}
    </div>
  );
}

export default CreateMarketBuyPolk;
