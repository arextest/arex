<template>
  <div class="state-progress">
    <a-tag :class="states[index].class">
      <span>{{ $t(states[index].label) }}</span>
      <template v-if="index === 1">
        <loading3-quarters-outlined class="progress-icon" spin />
        <span class="progress-percent">{{ percent > 99 ? 99 : percent }}%</span>
      </template>
    </a-tag>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import { Loading3QuartersOutlined } from "@/common/icon";
  import {states} from "@/common/constant";

  export default defineComponent({
    name: "StateProgress",
    props: {
      index: {
        type: Number,
        required: true,
        default: 0
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    setup: () => {
      return{
        states
      };
    },
    components: {
      Loading3QuartersOutlined
    }
  });
</script>

<style scoped lang="less">

</style>
