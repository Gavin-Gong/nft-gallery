<template>
  <div>
    <div class="is-flex is-justify-content-space-between">
      <div class="is-flex">
        <div>
          <BasicImage
            :src="avatar"
            :alt="nft?.name"
            class="border image is-48x48"
            :class="{ 'is-50-percent': discarded }" />
        </div>

        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between ml-4 limit-width">
          <div
            class="has-text-weight-bold line-height-1 no-wrap is-clipped is-ellipsis"
            :class="[discarded ? 'has-text-grey' : 'has-text-color']">
            {{ nft.name }}
          </div>
          <div
            class="line-height-1 no-wrap is-clipped is-ellipsis"
            :class="{ 'has-text-grey': discarded }">
            {{ nft.collection?.name || nft.collection.id }}
          </div>
        </div>
      </div>

      <slot name="right" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import { ListCartItem } from '@/stores/listingCart'
import BasicImage from '@/components/shared/view/BasicImage.vue'

const avatar = ref<string>()

const props = defineProps<{
  nft: ListCartItem
  discarded?: boolean
}>()

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft)
  }
}

onMounted(() => {
  getAvatar()
})
</script>

<style scoped lang="scss">
.limit-width {
  max-width: 170px;
}

.line-height-1 {
  line-height: 1;
}

.is-50-percent {
  opacity: 50%;
}
</style>
