<template>
  <div class="pagination">
    <div class="pagination-prefix">
      <slot name="prefix" />
    </div>
    <a-pagination
      :size="size"
      :show-size-changer="showSizeChanger"
      v-model:current="pagination.current"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
      :show-total="onFormatTotal"
      @change="onChange"
      @showSizeChange="onChange"
    />
  </div>
</template>

<script lang="ts">
  import {defineComponent, reactive} from "vue";
  import {useI18n} from "vue-i18n";

  export default defineComponent({
    name: "Pagination",
    props: {
      size: {
        type: String,
        default: ""
      },
      showSizeChanger: {
        type: Boolean,
        default: true
      },
      showTotal: {
        type: Boolean,
        default: true
      }
    },
    setup: (props: any, { emit }: any) => {
      const { locale } = useI18n();
      const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

      const onFormatTotal = (total: number, range: number[]) => {
        return props.showTotal ? locale.value === 'zh' ? `当前 ${range[0]}-${range[1]} 共 ${total} 条` :
          `${range[0]}-${range[1]} of ${total} items` : "";
      };

      const onChange = () => {
        emit("onChange", { pageIndex: pagination.current, pageSize: pagination.pageSize });
      };

      const onSlice = (array: any[]) => {
        return array.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize);
      };

      const onReset = () => {
        pagination.current = 1;
        pagination.total = 0;
      };

      return {
        pagination,

        onFormatTotal,
        onChange,
        onReset,
        onSlice
      }
    }
  })
</script>

<style scoped>
  .pagination {
    display: flex;
    margin-top: 16px;
  }

  .pagination .pagination-prefix {
    flex: 1;
  }
</style>
