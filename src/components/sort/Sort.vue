<template>
  <div class="sort" @click="onClick">
    <span class="sort-name">{{ label }}</span>
    <div class="sort-icon">
      <div :class="state === 1 ? 'sort-icon-selected' : 'sort-icon-unselected'">
        <caret-up-outlined />
      </div>
      <div class="sort-icon-down" :class="state === -1 ? 'sort-icon-selected' : 'sort-icon-unselected'">
        <caret-down-outlined />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import { CaretDownOutlined, CaretUpOutlined } from "@/common/icon";

  export default defineComponent({
    name: "Sort",
    props: {
      label: {
        type: String,
        default: ""
      },
      sortKey: {
        type: String,
        default: ""
      }
    },
    setup: (props: any, { emit }: any) => {
      const state = ref(0);

      const onClick = () => {
        switch (state.value) {
          case -1:
            state.value++;
            break;
          case 0:
            state.value++;
            break;
          case 1:
            state.value = state.value - 2;
            break;
          default: break;
        }
        emit("onClick");
      }

      const onSort = (array: any[]) => {
        let key = props.sortKey;
        switch (state.value) {
          case -1:
            if (array && key) {
              array.sort((a, b) => b[key] - a[key]);
            }
            break;
          case 1:
            if (array && key) {
              array.sort((a, b) => a[key] - b[key]);
            }
            break;
          default: break;
        }
      };

      return {
        state,

        onClick,
        onSort
      }
    },
    components: {
      CaretDownOutlined,
      CaretUpOutlined
    }
  });
</script>

<style scoped lang="less">
  .sort {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .sort .sort-name {
    margin-right: 4px;
  }

  .sort .sort-icon {
    font-size: 10px;
  }

  .sort .sort-icon-down {
    margin-top: -12px;
  }

  .sort .sort-icon-unselected {
    color: rgba(0, 0, 0, 0.45);
  }

  .sort .sort-icon-selected {
    color: rgba(0, 0, 0);
  }
</style>
