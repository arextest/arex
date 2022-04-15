<template>
  <div class="comparison-message">
    <a-tabs v-model:activeKey="activeKey" animated @change="onChangeTab">
      <a-tab-pane key="message" :tab="$t('message')">
        <a-textarea class="message-textarea" v-model:value.trim="msg" rows="24" />
      </a-tab-pane>
      <a-tab-pane key="tree" tab="Tree">
        <div class="message-content">
          <div class="message-content-tree">
            <comparison-tree
              :data="tree"
              :single-choice="isSortView"
              @onCheckListNode="onCheckListNode"
              @onCheckNode="onCheckNode"
            />
          </div>
          <div v-if="isSortView" class="message-content-tree">
            <comparison-tree :data="childTree" @onCheckNode="onCheckNode" />
          </div>
          <div v-if="!isSortView" class="message-content-list">
            <div class="list-title">{{ `${$t("selected")} ${selectedNodes.length} ${$t("items")}`  }}</div>
            <a-list v-if="selectedNodes.length > 0" :data-source="selectedNodes">
              <template #renderItem="{ item }">
                <a-list-item>{{ item.pathValue[0] || "" }}</a-list-item>
              </template>
            </a-list>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useComparisonMessage} from "@/modules/configuration";

  import ComparisonTree from "@/view/configuration/comparison/ComparisonTree.vue";

  export default defineComponent({
    name: "ComparisonMessage",
    components: {
      ComparisonTree
    },
    setup: useComparisonMessage
  });
</script>

<style scoped>
  .comparison-message {
    margin-top: -16px;
    width: 100%;
  }

  .comparison-message :deep(.ant-tabs-top > .ant-tabs-nav::before) {
    border: none;
  }

  .comparison-message :deep(.ant-tabs-tab + .ant-tabs-tab) {
    margin-left: 24px;
  }

  .comparison-message .message-content {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .comparison-message .message-content-tree {
    flex: 1;
    margin-right: 12px;
    background: var(--color-border);
    border-radius: 8px;
  }

  .comparison-message :deep(.ant-tree) {
    background: var(--color-border);
    padding: 8px;
    border-radius: 8px;
  }

  .comparison-message .message-content-list {
    flex: 1;
    margin-left: 12px;
  }

  .message-content-list .list-title {
    font-weight: 600;
  }
</style>
