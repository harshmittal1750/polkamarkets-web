import type { Network } from 'types/network';
import { Banner } from 'ui';

import { Link, NetworkSelector } from 'components';

import wrongNetwork from './WrongNetwork.module.scss';

type WrongNetworkProps = {
  network: Network;
};

export default function WrongNetwork({ network }: WrongNetworkProps) {
  return (
    <Banner
      $type="warning"
      $variant="subtle"
      actions={
        <NetworkSelector
          anchorOrigin="right"
          size="xs"
          color="warning"
          variant="normal"
        />
      }
    >
      The selected network <strong>{network.name}</strong> does not match your
      wallet&apos;s active one. Change the App network or learn{' '}
      <Link
        className={wrongNetwork.link}
        title="how to change"
        target="_blank"
        rel="noreferrer noopener"
        href="https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC"
      />{' '}
      it in MetaMask.
    </Banner>
  );
}
