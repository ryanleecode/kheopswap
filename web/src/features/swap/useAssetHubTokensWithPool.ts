import { useMemo } from "react";

import {
  usePoolsByChainId,
  useRelayChains,
  useTokensByChainId,
} from "src/hooks";

export const useAssetHubTokensWithPool = () => {
  const { assetHub } = useRelayChains();

  const { data: tokens, isLoading: isLoadingTokens } = useTokensByChainId({
    chainId: assetHub.id,
  });
  const { data: pools, isLoading: isLoadingPools } = usePoolsByChainId({
    chainId: assetHub.id,
  });

  const [tokensWithPools, isLoading] = useMemo(() => {
    if (!tokens || !pools) return [[], true];
    const tokensWithPools = tokens.filter((token) =>
      pools.some((pool) => pool.tokenIds.includes(token.id)),
    );
    return [tokensWithPools, isLoadingTokens || isLoadingPools];
  }, [isLoadingPools, isLoadingTokens, pools, tokens]);

  return { data: tokensWithPools, isLoading };
};
