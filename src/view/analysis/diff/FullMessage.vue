<template>
  <div>
    <a-modal
      class="full-message-modal"
      v-model:visible="visible"
      :title="$t('fullMsg')"
      :closable="false"
      @ok="onOk"
      @cancel="onCancel"
      width="1388px"
    >
<!--      <div class="full-message-modal-search">-->
<!--        <a-input-search-->
<!--          v-model:value="value"-->
<!--          placeholder="input search text"-->
<!--          enter-button-->
<!--          @search="onSearch"-->
<!--        />-->
<!--      </div>-->
<!--      不为空对象时再渲染-->
      <div class="flex">
        <MessageTree :jsonData="jsonData"></MessageTree>
<!--        <div class="full-message-modal-left">-->
<!--          <component is="message-tree" ref="messageTreeLeft"/>-->
<!--        </div>-->

<!--        <div class="full-message-modal-right">-->
<!--          <component is="message-tree" ref="messageTreeRight"/>-->
<!--        </div>-->
      </div>
    </a-modal>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {useFullMessage} from "@/modules/analysis";
import MessageTree from "@/view/analysis/diff/MessageTree.vue";

export default defineComponent({
  name: "FullMessage",
  setup: useFullMessage,
  components: {MessageTree}
})
</script>

<style scoped lang="less">
.full-message-modal {
  margin: 8px 0 -8px;
}

.full-message-modal .full-message-modal-search {
  margin-bottom: 4px;
}

.full-message-modal .full-message-modal-left {
  padding-right: 8px;
  width: 50%;
  height: 600px;
}

.full-message-modal .full-message-modal-right {
  padding-left: 8px;
  width: 50%;
  height: 600px;
}
</style>
