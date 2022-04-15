<template>
  <a-form
    class="configuration-replay"
    ref="formRef"
    :model="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 17 }"
  >
    <a-form-item :label="$t('agentVersion')">
      <div>{{ form.version }}</div>
    </a-form-item>
<!--    <a-form-item :label="$t('dataSource')">
      <a-radio-group v-model:value="form.source">
        <a-radio v-for="option in form.sourceOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="$t('accessCI')">
      <div class="flex">
        <a-switch v-model:checked="form.accessCI" />
        <transition
          enter-active-class="animate__animated animate__bounceIn"
          leave-active-class="animate__animated animate__bounceOut"
        >
          <div v-if="form.accessCI">
            <span class="replay-form-label">{{ $t("onlyFor") }}Release: </span>
            <a-switch v-model:checked="form.onlyForRelease" />
          </div>
        </transition>
      </div>
    </a-form-item>
    <a-form-item :label="$t('duration')">
      <a-checkbox-group v-model:value="form.durations" :options="form.durationOptions" />
    </a-form-item>
    <a-form-item :label="$t('subscribers')">
      <main-select class="replay-form-select" />
    </a-form-item>-->
    <a-form-item :label="$t('caseRange')">
      <slider
        class="replay-case-range"
        v-model:value="form.offsetDays"
        :min="1"
        :max="10"
        :tip-formatter="onFormat"
        :unit="$t('days')"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationReplay} from "@/modules/configuration";

  import MainSelect from "@/components/select/MainSelect.vue";
  import Slider from "@/components/slider/Slider.vue";

  export default defineComponent({
    name: "ConfigurationReplay",
    components: {
      MainSelect,
      Slider
    },
    setup: useConfigurationReplay
  });
</script>

<style scoped lang="less">
  .configuration-replay :deep(.ant-form-item-label > label) {
    color: var(--color-antd-text);
  }

  .configuration-replay .replay-case-range {
    width: 70%;
  }

  .configuration-replay .replay-form-label {
    color: var(--color-antd-text);
    margin: 0 8px 0 32px;
  }

  .configuration-replay .replay-form-select {
    max-width: 1170px;
  }
</style>
