<template>
  <a-popover v-model:visible="visible" trigger="click" :placement="placement">
    <template #content>
      <div class="popover-content" :style="{ 'width': width + 'px' }">
        <template v-if="title">
          <div class="popover-content-header">
            <span class="content-header-title">{{ title }}</span>
            <close-outlined class="content-header-icon" @click="onClose" />
          </div>
        </template>
        <template v-if="title">
          <a-divider class="popover-content-divider" />
        </template>
        <div class="popover-content-center">
          <slot name="center" />
        </div>
        <template v-if="title">
          <a-divider class="popover-content-divider" />
        </template>
        <template v-if="footer">
          <div class="popover-content-footer">
            <a-button class="content-footer-button" @click="onClose">{{ $t('cancel') }}</a-button>
            <a-button type="primary" @click="onConfirm">{{ $t('confirm') }}</a-button>
          </div>
        </template>
      </div>
    </template>
    <slot />
  </a-popover>
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue';
  import { CloseOutlined } from "@/common/icon";

  export default defineComponent({
    name: "Popover",
    props: {
      placement: {
        type: String,
        default: "bottom"
      },
      width: {
        type: Number,
        default: 640
      },
      title: {
        type: String,
        default: ""
      },
      footer: {
        type: Boolean,
        default: true
      }
    },
    components: {
      CloseOutlined
    },
    setup: (props: any, { emit }: any) => {
      const visible = ref(false);

      const onClose = () => {
        visible.value = false;
        emit("onClose");
      };

      const onConfirm = () => {
        visible.value = false;
        emit("onConfirm");
      };

      return {
        visible,

        onClose,
        onConfirm
      }
    }
  });
</script>

<style scoped lang="less">
  .popover-content {
    margin: -12px -16px;
  }

  .popover-content .popover-content-header {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .popover-content .content-header-title {
    flex: 1;
  }

  .popover-content .content-header-icon {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .popover-content .popover-content-divider {
    margin: 0;
  }

  .popover-content .popover-content-center {
    padding: 24px;
  }

  .popover-content .popover-content-footer {
    text-align: right;
    padding: 8px 16px;
  }

  .popover-content .content-footer-button {
    margin-right: 12px;
  }
</style>
