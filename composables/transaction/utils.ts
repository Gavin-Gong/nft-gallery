import { warningMessage } from '@/utils/notification'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionWithdrawOffer } from './types'

export function transactionOfferFactory(key: 'acceptOffer' | 'withdrawOffer') {
  return function (params: ActionWithdrawOffer, api, executeTransaction) {
    try {
      const { id, item } = tokenIdToRoute(params.nftId)
      const args = [id, item, params.maker]
      const cb = api.tx.marketplace[key]
      executeTransaction({
        cb,
        arg: args,
      })
    } catch (error) {
      warningMessage(error)
    }
  }
}

export const verifyRoyalty = (
  royalty?: Royalty,
): { isValid: boolean; normalizedRoyalty: Royalty } => {
  const normalizedRoyalty = {
    amount: Number(royalty?.amount ?? 0),
    address: royalty?.address ?? '',
  }

  return {
    isValid: isRoyaltyValid(normalizedRoyalty),
    normalizedRoyalty,
  }
}
