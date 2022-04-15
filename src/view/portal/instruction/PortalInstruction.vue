<template>
  <div class="portal-instruction">
    <div class="portal-instruction-title">{{ $t("instructions") }}</div>
    <div class="portal-instruction-options">
      <template v-for="option in options" :key="option">
        <a-button
          :class="option === selectedOption ? 'instruction-options-selected' : ''"
          @click="onSelectOption(option)"
        >
          {{ $t(option) }}
        </a-button>
      </template>
    </div>
    <instruction-carousel class="portal-instruction-carousel" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {usePortalInstruction} from "@/modules/portal";

import InstructionCarousel from "@/view/portal/instruction/InstructionCarousel.vue";

export default defineComponent({
  name: "PortalInstruction",
  setup: usePortalInstruction,
  components: {
    InstructionCarousel
  }
});
</script>

<style scoped lang="less">
  .portal-instruction .portal-instruction-title {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
  }

  .portal-instruction .portal-instruction-options {
    margin-top: 32px;
    text-align: center;
  }

  .portal-instruction :deep(.ant-btn) {
    font-size: 16px;
    color: var(--color-high-text);
    background: var(--color-table-background);
    border-radius: 24.5px;
    border: none;
    height: 43px;
    padding: 4px 20px;
    margin: 0 8px;
    &:hover {
      opacity: 0.8;
    }
  }

  .portal-instruction .instruction-options-selected {
    border: 1px solid var(--color-high-text);
    padding: 8px 24px;
  }

  .portal-instruction .portal-instruction-carousel {
    margin-top: 24px;
  }
</style>
