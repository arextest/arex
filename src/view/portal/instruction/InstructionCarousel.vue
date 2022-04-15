<template>
  <a-carousel class="instruction-carousel" arrows>
    <template #customPaging="props">
      <a>
        <img :src="`/regression${props.i + 1}.png`" />
      </a>
    </template>
    <template #prevArrow>
      <div class="carousel-custom-slick slick-left-arrow">
        <left-outlined class="custom-slick-icon" />
      </div>
    </template>
    <template #nextArrow>
      <div class="carousel-custom-slick slick-right-arrow">
        <right-outlined class="custom-slick-icon" />
      </div>
    </template>
    <div v-for="item in 3" :key="item">
      <img :src="`/regression${item}.png`" />
    </div>
  </a-carousel>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useInstructionCarousel} from "@/modules/portal";
import { LeftOutlined, RightOutlined } from "@/common/icon";

export default defineComponent({
  name: "InstructionCarousel",
  setup: useInstructionCarousel,
  components: {
    LeftOutlined,
    RightOutlined
  }
});
</script>

<style scoped lang="less">
  .instruction-carousel :deep(.slick-dots) {
    position: relative;
    height: auto;
    bottom: 0;
    margin-top: 8px;
  }

  .instruction-carousel :deep(.slick-slide img) {
    border-radius: 8px;
    display: block;
    margin: auto;
    height: 354px;
    width: 600px;
  }

  .instruction-carousel :deep(.slick-dots li) {
    width: 60px;
    height: 45px;
  }

  .instruction-carousel :deep(.slick-dots li img) {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }

  .instruction-carousel :deep(.slick-dots li.slick-active img) {
    filter: grayscale(0%);
  }

  .instruction-carousel .carousel-custom-slick {
    z-index: 1;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.12);
    height: 50px;
    width: 50px;
    border-radius: 50%;
    &:hover {
      opacity: 0.8;
    }
  }

  .instruction-carousel :deep(.carousel-custom-slick:before) {
    display: none;
  }

  .instruction-carousel :deep(.slick-arrow) {
    top: 175px
  }

  .instruction-carousel .custom-slick-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #5C7080;
    font-size: 20px;
  }
</style>
