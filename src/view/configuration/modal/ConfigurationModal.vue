<template>
  <a-modal class="configuration-modal" v-model:visible="visible" :closable="false" width="70%">
    <template #title>
      <div class="flex">
        <div class="modal-title">
          <template v-if="showArrow">
            <arrow-left-outlined class="title-back-arrow" @click="onBack" />
          </template>
          <span>{{ title }}</span>
        </div>
        <div class="modal-close-icon">
          <close-outlined @click="onCancel" />
        </div>
      </div>
    </template>
    <component class="modal-content" :is="component.is" :ref="component.ref" />
    <template #footer>
      <template v-if="component.is === 'configuration-comparison'">
        <template v-if="showArrow">
          <a-button @click="onBack">{{ $t("back") }}</a-button>
          <a-button type="primary" @click="onSave(true)">{{ $t("save") }}</a-button>
        </template>
        <a-button v-else type="primary" @click="onClose">{{ $t("close") }}</a-button>
      </template>
      <template v-else>
        <a-button @click="onCancel">{{ $t("cancel") }}</a-button>
        <a-button type="primary" @click="onSave(false)">{{ $t("save") }}</a-button>
      </template>
    </template>
  </a-modal>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationModal} from "@/modules/configuration";
  import { CloseOutlined, ArrowLeftOutlined } from "@/common/icon";

  import Popover from "@/components/popover/Popover.vue";
  import ConfigurationRecord from "@/view/configuration/record/ConfigurationRecord.vue";
  import ConfigurationReplay from "@/view/configuration/replay/ConfigurationReplay.vue";
  import ConfigurationComparison from "@/view/configuration/comparison/ConfigurationComparison.vue";
  import ConfigurationTemplate from "@/view/configuration/template/ConfigurationTemplate.vue";

  export default defineComponent({
    name: "ConfigurationModal",
    components: {
      Popover,
      ConfigurationRecord,
      ConfigurationReplay,
      ConfigurationComparison,
      ConfigurationTemplate,
      CloseOutlined,
      ArrowLeftOutlined
    },
    setup: useConfigurationModal
  });
</script>

<style scoped lang="less">
  .configuration-modal {
    width: 30% !important;
  }

  .configuration-modal .modal-title {
    flex: 1
  }

  .configuration-modal .modal-close-icon {
    text-align: right;
    color: var(--color-low-text);
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .modal-title .title-back-arrow {
    cursor: pointer;
    margin-right: 16px;
    color: var(--color-low-text);
    &:hover {
      color: var(--color-high-text);
    }
  }
</style>
