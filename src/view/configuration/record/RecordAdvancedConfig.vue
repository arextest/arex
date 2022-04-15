<template>
  <a-form
    class="record-advanced-config"
    ref="formRef"
    :model="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 17 }"
  >
    <a-form-item :label="$t('apiToRecord')">
      <main-select class="config-form-select" :select="form.apiToRecord" />
    </a-form-item>
    <a-form-item :label="$t('apiNotToRecord')">
      <main-select class="config-form-select" :select="form.apiNotToRecord" />
    </a-form-item>
    <a-form-item :label="$t('dependentApiNotToRecord')">
      <main-select class="config-form-select" :select="form.dependentApiNotToRecord" />
    </a-form-item>
    <a-form-item :label="$t('servicesToRecord')">
      <main-select class="config-form-select" :select="form.servicesToRecord" />
    </a-form-item>
    <a-form-item :label="$t('dependentServicesNotToRecord')">
      <main-select class="config-form-select" :select="form.dependentServicesNotToRecord" />
    </a-form-item>
    <a-form-item :label="$t('javaTimeClass')">
      <div class="config-classes">
        <template v-for="timeClass in form.timeClasses" :key="timeClass">
          <a-checkbox class="config-class-item" v-model:checked="timeClass.value">{{ timeClass.label }}</a-checkbox>
        </template>
      </div>
      <div class="config-classes-tip">({{ $t("pleaseConfirmTheTimeClass") }})</div>
    </a-form-item>
    <a-form-item :label="$t('dynamicClasses')">
      <record-class-table :form="form" @onSet="onSetDynamicClasses" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useRecordAdvancedConfig} from "@/modules/configuration";

  import MainSelect from "@/components/select/MainSelect.vue";
  import RecordClassTable from "@/view/configuration/record/RecordClassTable.vue";

  export default defineComponent({
    name: "RecordAdvancedConfig",
    components: {
      MainSelect,
      RecordClassTable
    },
    props: {
      form: {
        type: Object,
        default: () => ({})
      }
    },
    setup: useRecordAdvancedConfig
  });
</script>

<style scoped lang="less">
  .record-advanced-config :deep(.ant-form-item-label > label) {
    color: var(--color-antd-text);
  }

  .record-advanced-config .config-form-input {
    margin-top: 8px;
    max-width: 1170px;
  }

  .record-advanced-config .config-classes {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    margin-top: -4px;
  }

  .record-advanced-config .config-class-item {
    width: 27%;
    word-break: break-all;
    margin: 8px 32px 0 0 ;
  }

  .record-advanced-config .config-classes-tip {
    color: var(--color-error);
    margin-top: 8px;
  }

  .record-advanced-config .config-form-select {
    max-width: 1170px;
  }

  .record-advanced-config :deep(.ant-form-item-label) {
    white-space: normal;
  }
</style>
