<template>
  <div data-testid="item-section-buy">
    <GalleryItemPriceSection v-if="nft.price" title="Price" :price="nft.price">
      <div v-if="Number(nft.price)" class="is-flex desktop-full-w">
        <div class="is-flex buy-button-width">
          <NeoButton
            :label="label"
            size="large"
            class="button-height w-full"
            variant="k-accent"
            data-testid="item-buy"
            @click="onClick" />
        </div>

        <NeoButton
          class="button-height no-border-left"
          data-testid="item-add-to-cart"
          @click="onClickShoppingCart">
          <img :src="cartIcon" class="image is-32x32" />
        </NeoButton>
      </div>

      <div v-else>{{ $t('nft.notListed') }}</div>
    </GalleryItemPriceSection>

    <OnRampModal :value="showRampModal" @close="showRampModal = false" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import OnRampModal from '@/components/shared/OnRampModal.vue'
import { openShoppingCart } from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import type { NFT } from '@/components/rmrk/service/scheme'
import { nftToShoppingCartItem } from '@/components/common/shoppingCart/utils'

const props = defineProps<{ nft: NFT }>()

const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { cartIcon } = useShoppingCartIcon(props.nft.id)

const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const showRampModal = ref(false)

enum BuyStatus {
  BUY,
  CART,
}

const btnStatus = computed(() =>
  shoppingCartStore.isItemInCart(props.nft.id) ? BuyStatus.CART : BuyStatus.BUY,
)

const label = computed(() => {
  if (btnStatus.value === BuyStatus.CART) {
    return $i18n.t('shoppingCart.gotToCart')
  }
  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'nft.action.buy',
  )
})

const openCompletePurcahseModal = () => {
  shoppingCartStore.setItemToBuy(nftToShoppingCartItem(props.nft))
  preferencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'buy-now',
  })
}

function onClick() {
  if (btnStatus.value === BuyStatus.CART) {
    openShoppingCart()
  } else {
    doAfterLogin({ onLoginSuccess: openCompletePurcahseModal })
  }
}

const onClickShoppingCart = () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  } else {
    shoppingCartStore.setItem(nftToShoppingCartItem(props.nft))
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

:deep(.button-height) {
  height: 55px !important;
}

.buy-button-width {
  width: 10rem;

  @include until-widescreen {
    width: 100%;
    flex-grow: 1;
  }

  .wrapper {
    width: 100%;
  }
}

.desktop-full-w {
  @include until-widescreen {
    width: 100%;
  }
}
</style>
