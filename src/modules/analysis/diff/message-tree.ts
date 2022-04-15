import {ref, watch} from "vue";
import type {TreeProps} from "ant-design-vue";

export default () => {
  const expandedKeys = ref();
  const selectedKeys = ref();
  const treeData = ref<TreeProps['treeData']>([]);

  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys);
  });
  watch(selectedKeys, () => {
    console.log('selectedKeys', selectedKeys);
  });

  const onInitData = (jsonData: string) => {
    if (!jsonData) {
      return
    }
    let json = JSON.parse(jsonData)


    treeData.value = [
      {
        title: 'parent 1',
        key: '0-0',

      },
    ];
  }

  function getTreeData(json: any) {
    if (!json){
      return
    }
    const list: TreeProps['treeData'] = []
  }

  return {
    treeData,
    expandedKeys,
    selectedKeys,
    onInitData
  }
}
