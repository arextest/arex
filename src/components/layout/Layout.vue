<template>
  <a-layout class="layout">
    <a-layout-sider
      class="sider"
      v-if="showSider"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="width"
    >
      <slot name="logo" />
      <slot name="nav" />
    </a-layout-sider>
    <a-layout-header class="header" v-if="showHeader" :class="collapsedClass" :style="headerHeight">
      <slot name="header" />
    </a-layout-header>
    <a-layout class="children-layout" :class="collapsedClass">
      <a-layout-content>
        <slot name="content" />
      </a-layout-content>
      <a-layout-footer>
        <slot name="footer" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Layout",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    showSider: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 220
    },
    height: {
      type: Number,
      default: 64
    }
  },
  setup: (props) => {
    const collapsedClass = computed(() => {
      return props.showSider ? (props.collapsed ? "collapse-on" : "collapse-off") : "";
    });
    const headerHeight = computed(() => `height: ${props.height}px`)
    return {
      collapsedClass,
      headerHeight
    }
  },
})
</script>

<style scoped lang="less">
  .layout {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  .sider {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
  }

  .header {
    padding: 0;
    position: fixed;
    width: 100%;
    z-index: 1000;
    transition: left 0.2s;
  }

  .collapse-on {
    left: 80px;
  }

  .collapse-off {
    left: 220px;
  }

  .children-layout {
    position: absolute;
    top: 0;
    left: 0;
    transition: left 0.2s;
  }

  .layout :deep(.ant-layout) {
    width: 100%;
  }
</style>
