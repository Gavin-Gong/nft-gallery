import { useFiatStore } from '@/stores/fiat'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { networkToPrefix, useIdentityStore } from '@/stores/identity'
import { defultTokenChain } from '@/utils/config/chain.config'

type TokenDecimals = Record<Prefix, number>
type TokenIds = Record<Prefix, string | undefined>
export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  chains: Prefix[]
  defaultChain: Prefix
  tokenDecimals: TokenDecimals
  tokenIds: TokenIds
}

const getAssetToken = (asset) => asset?.token || 'KSM'
const getUniqueArrayItems = (items: string[]) => [...new Set(items)]

export default function useToken(filterByCurrentChain = false) {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()
  const { getAvailableAssets } = useIdentityStore()
  const { urlPrefix } = usePrefix()

  const availableAssets = computed(() => {
    if (!filterByCurrentChain) {
      return getAvailableAssets
    }
    return getAvailableAssets.filter((asset) => {
      if (asset.chain === 'kusama') {
        return ['rmrk', 'ksm'].includes(urlPrefix.value)
      }
      return urlPrefix.value === networkToPrefix[asset.chain]
    })
  })

  const availableTokensAcrossAllChains = computed(() =>
    getUniqueArrayItems(Object.values(availableAssets.value).map(getAssetToken))
  )

  const getMatchingAvailableAssetsByToken = (token: string) => {
    return Object.values(availableAssets.value).filter(
      (asset) => token === getAssetToken(asset)
    )
  }

  const getTokenChains = (token: string): Prefix[] => {
    return getMatchingAvailableAssetsByToken(token).map(
      (asset) => networkToPrefix[asset.chain] as Prefix
    )
  }

  const getChainTokenIds = (token: string) => {
    return Object.fromEntries(
      getMatchingAvailableAssetsByToken(token).map((asset) => [
        networkToPrefix[asset.chain],
        asset.tokenId,
      ])
    ) as TokenIds
  }

  const tokens = computed<TokenDetails[]>(() => {
    return availableTokensAcrossAllChains.value.map((tokenSymbol) => {
      const chains = getTokenChains(tokenSymbol)
      const defaultChain = defultTokenChain[tokenSymbol]
      const tokenDecimals = Object.fromEntries(
        chains.map((chain) => [chain, CHAINS[chain].tokenDecimals])
      ) as TokenDecimals
      const tokenIds = getChainTokenIds(tokenSymbol)

      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        chains: chains,
        defaultChain: defaultChain,
        tokenDecimals: tokenDecimals,
        tokenIds: tokenIds,
      }
    })
  })

  const isTokenValidForChain = (token: string, urlPrefix: Prefix) => {
    const isValidToken = availableTokensAcrossAllChains.value.includes(token)
    const isAvailableForCurrentChain = tokens.value
      .map((t) => t.chains.includes(urlPrefix) && t.symbol === token)
      .some(Boolean)
    return !!token && isValidToken && isAvailableForCurrentChain
  }

  return {
    tokens,
    availableTokensAcrossAllChains,
    isTokenValidForChain,
  }
}
