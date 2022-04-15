<template>
  <a-modal
    class="list-replay-modal"
    v-model:visible="visible"
    :title="title"
    :closable="false"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      class="replay-modal-form"
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="$t('targetHost')" name="targetEnv">
<!--        <main-select :select="form.targetEnv" @onSelect="onValidate('targetEnv')" />-->
        <a-input v-model:value.trim="form.targetEnv.value" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useListReplayModal} from "@/modules/regression";

  import MainSelect from "@/components/select/MainSelect.vue";

  export default defineComponent({
    name: "ListReplayModal",
    components: {
      MainSelect
    },
    props: {
      planType: {
        type: Number,
        default: 0
      }
    },
    setup: useListReplayModal
  });
</script>

<style scoped lang="less">
  .list-replay-modal .replay-modal-form {
    margin: 8px 0 -8px;
  }
</style>
