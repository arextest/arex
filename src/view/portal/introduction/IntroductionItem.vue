<template>
  <template v-if="type">
    <div class="flex introduction-capability-item">
      <img ref="imgRef" v-lazy="imageSrc" alt="" />
      <div>
        <div class="item-title">{{ title }}</div>
        <template v-for="(contentItem, contentIndex) in contents" :key="contentIndex">
          <div>{{ contentItem }}</div>
        </template>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="introduction-feature-item">
      <div class="item-title">{{ title }}</div>
      <div class="feature-item-content">
        <template v-for="(contentItem, contentIndex) in contents" :key="contentIndex">
          <div>{{ contentItem }}</div>
        </template>
      </div>
      <img class="feature-item-img" ref="imgRef" v-lazy="imageSrc" alt="" />
    </div>
  </template>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "IntroductionItem",
  props: {
    type: {
      type: Number,
      default: 1
    },
    imageSrc: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    contents: {
      type: Array,
      default: () => []
    }
  },
  setup: (props: any) => {
    const imgRef = ref();

    /*setTimeout(() => imgRef.value.src += "/" + props.imageName);*/

    return {
      imgRef
    }
  }
});
</script>

<style scoped lang="less">
  .introduction-capability-item img {
    height: 100px;
    width: 100px;
    margin-right: 32px;
  }

  .item-title {
    font-size: 24px;
    font-weight: 500;
  }

  .introduction-feature-item {
    background: #007FE9;
    box-shadow: 0 4px 16px 1px rgba(0, 0, 0, 0.06);
    padding: 18px 24px;
    position: relative;
    color: var(--color-card);
    overflow: hidden;
    margin: 40px 12px 0;
  }

  .introduction-feature-item .feature-item-content {
    margin: 16px 0 24px;
  }

  .introduction-feature-item .feature-item-img {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 16px;
    right: -8px;
  }
</style>
