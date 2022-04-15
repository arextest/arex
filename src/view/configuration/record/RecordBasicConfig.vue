<template>
  <a-form
    class="record-basic-config"
    ref="formRef"
    :model="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 18 }"
  >
    <a-form-item :label="$t('agentVersion')">
      <div>{{ form.version }}</div>
    </a-form-item>
    <a-form-item :label="$t('duration')">
      <template v-for="(dateItem, dateIndex) in dates" :key="dateItem">
        <a-checkbox
          :checked="form.durations.includes(dateIndex)"
          @change="(e) => onChange(e, dateIndex)"
        >
          {{ $t(dateItem) }}
        </a-checkbox>
        <a-divider v-if="dateIndex === 0" class="basic-config-divider" type="vertical" />
      </template>
    </a-form-item>
    <a-form-item :label="$t('recordPeriod')" name="period">
      <a-time-range-picker v-model:value="form.period" />
    </a-form-item>
    <a-form-item :label="$t('recordFrequency')">
      <slider
        class="basic-config-frequency"
        v-model:value="form.frequency"
        :min="1"
        :tip-formatter="onFormat"
        :unit="$t('times100s')"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useRecordBasicConfig} from "@/modules/configuration";

  import Slider from "@/components/slider/Slider.vue";

  export default defineComponent({
    name: "RecordBasicConfig",
    components: {
      Slider
    },
    props: {
      form: {
        type: Object,
        default: () => ({})
      }
    },
    setup: useRecordBasicConfig
  });
</script>

<style scoped lang="less">
  .record-basic-config .basic-config-frequency {
    width: 70%;
  }

  .record-basic-config .frequency-slider {
    flex: 1;
    margin-right: 16px;
  }

  .record-basic-config .frequency-input {
    margin-right: 8px;
  }

  .record-basic-config :deep(.ant-form-item-label > label) {
    color: var(--color-antd-text);
  }

  .record-basic-config .basic-config-divider {
    margin: 0 16px;
    height: 24px;
  }
</style>
