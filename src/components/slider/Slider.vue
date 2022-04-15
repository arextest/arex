<template>
  <div class="slider">
    <a-slider class="slider-count" v-model:value="num" :min="min" :max="max" :tip-formatter="tipFormatter" />
    <a-input-number class="slider-input" v-model:value="num" :min="min" :max="max" />
    <div>{{ unit }}</div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed} from "vue";

  export default defineComponent({
    name: "Slider",
    props: {
      value: {
        type: Number,
        default: 0
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      tipFormatter: {
        type: Function,
        default: undefined
      },
      unit: {
        type: String,
        default: ""
      }
    },
    setup: (props: any, { emit }: any) => {
      const num = computed({
        get: () => {
          return props.value;
        },
        set: (value: number | string) => {
          emit("update:value", value === "" ? 0 : value);
        }
      });

      return {
        num
      }
    }
  });
</script>

<style scoped lang="less">
  .slider {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .slider .slider-count {
    flex: 1;
    margin-right: 16px;
  }

  .slider .slider-input {
    margin-right: 8px;
  }
</style>
