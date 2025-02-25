<template>
  <!-- NeoTag -->
  <div
    attached
    closable
    class="tag"
    :class="[`tag--${variant}`, `tag-size--${size}`]">
    <slot></slot>
    <NeoIcon
      v-if="closable"
      aria-close-label="clear filter"
      icon="xmark"
      class="ml-2 is-clickable cross-icon"
      @click="onClose" />
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

type TagSize = 'small' | 'medium'
type TagVariant = 'primary' | 'k-blue' | 'transparent'

withDefaults(
  defineProps<{
    closable?: boolean
    size?: TagSize
    variant?: TagVariant
  }>(),
  {
    closable: false,
    size: 'medium',
    variant: 'primary',
  },
)

const emit = defineEmits(['close'])
const onClose = () => {
  emit('close')
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.tag {
  border-radius: 1rem !important;
  background: transparent;
  font-size: 1rem !important;

  &--primary {
    @include ktheme() {
      border: 1px solid theme('k-primary');
      background-color: theme('k-accentlight2');
      color: theme('text-color');
      .cross-icon {
        &:hover {
          color: theme('k-grey');
        }
      }
    }
  }

  &--transparent {
    @include ktheme() {
      border: 1px solid theme('border-color');
      color: theme('text-color');
      background: transparent;
    }
  }

  &--k-blue {
    @include ktheme() {
      border: 1px solid theme('k-blue');
      background-color: theme('blue-light-hover-color');
    }
  }

  &.tag-size {
    &--medium {
      padding: 0.75rem;
    }

    &--small {
      font-size: 0.75rem !important;
      padding: 0 0.5rem !important;
      height: min-content;
    }
  }

  .tag {
    margin-bottom: 0;
    padding: 0;
    background-color: inherit;

    @include ktheme() {
      color: theme('text-color');
    }

    &:first-child {
      margin-right: 0.3rem;
      cursor: default;
    }
    &.is-delete {
      &:hover,
      &:focus {
        background-color: inherit;
        @include ktheme() {
          color: theme('k-grey');
        }
      }
    }
  }
}
</style>
