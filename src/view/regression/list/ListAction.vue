<template>
  <div class="list-action">
    <a class="list-action-item" @click="onClickReplay">{{ $t('startReplay') }}</a>
    <a @click="onClickReport" >{{ $t('lastedReport') }}</a>
    <list-replay-modal ref="listReplayModalRef" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useListActions} from "@/modules/regression";

import ListReplayModal from "@/view/regression/list/ListReplayModal.vue";

export default defineComponent({
  name: "ListActions",
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  setup: useListActions,
  components: {
    ListReplayModal
  },
});
</script>

<style scoped lang="less">
  .list-action {
    display: flex;
    flex-wrap: wrap;
  }

  .list-action .list-action-item {
    margin-right: 32px;
    color: #00BB74;
    &:hover {
      opacity: 0.8;
    }
  }

  .list-action .list-action-replay {
    color: #00BB74;
    &:hover {
      opacity: 0.8;
    }
  }
</style>
