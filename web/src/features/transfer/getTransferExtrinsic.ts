import { MultiAddress } from "@polkadot-api/descriptors";
import { SS58String } from "polkadot-api";

import { getChainById } from "src/config/chains";
import {
  TokenId,
  getChainIdFromTokenId,
  parseTokenId,
} from "src/config/tokens";
import { getApi, isApiAssetHub } from "src/services/api";

export const getTransferExtrinsic = async (
  tokenId: TokenId,
  plancks: bigint,
  dest: SS58String,
) => {
  const chainId = getChainIdFromTokenId(tokenId);
  if (!chainId) return null;

  const chain = getChainById(chainId);
  if (!chain) return null;

  const api = await getApi(chain.id);

  const token = parseTokenId(tokenId);
  if (chain.id !== token.chainId)
    throw new Error(`Token ${tokenId} is not supported on chain ${chain.name}`);

  switch (token.type) {
    case "asset": {
      if (!isApiAssetHub(api))
        throw new Error(`Chain ${chain.name} does not have the Assets pallet`);

      return api.tx.Assets.transfer({
        id: token.assetId,
        target: MultiAddress.Id(dest),
        amount: plancks,
      });
    }
    case "native": {
      return api.tx.Balances.transfer_keep_alive({
        dest: MultiAddress.Id(dest),
        value: plancks,
      });
    }
  }
};
