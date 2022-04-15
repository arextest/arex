<template>
  <div>
    <a-modal
        width="600px"
        :destroy-on-close="true"
        :visible="visible"
        :title="$t('listKey')"
        :footer="false"
        @ok="changeVisible(false)" @cancel="changeVisible(false)" @close="changeVisible(false)">
      <div style="display: flex;justify-content: space-between;" v-if="treeData.length !== 0">
        <div style="width: 100%;height: 500px;overflow-y: scroll">
          <p style="font-weight: bolder">{{$t('select')}} {{$t('listKey')}}</p>
          <a-tree
              style="background-color: rgb(221, 243, 227);padding: 10px;border-radius: 5px;height: 100%;width: 100%;"
              :defaultExpandAll="true"
              v-model:checkedKeys="checkedKeys"
              checkable
              :selectable="false"
              :tree-data="treeData"
          >
            <template #title="{ title, key }">
              <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
              <template v-else>{{ title }}</template>
            </template>
          </a-tree>
        </div>

<!--        <div style="margin-left: 28px;margin-right: 14px;height: 100%;flex: 1">-->
<!--          <p style="font-weight: bolder">已选{{$t('listKey')}}</p>-->
<!--          <a-empty v-show="detailsList.length ===0" />-->

<!--          <div v-for="(item,index) of detailsList" :key="index">-->
<!--            <div style="display: flex;align-items: center;justify-content: space-between;">-->
<!--              <div style="width: 450px">-->
<!--                <p>-->
<!--                  <span style="font-weight: bolder">ListPath: </span>-->
<!--                  <span style="font-size: 14px">{{item.pathName}}</span>-->
<!--                </p>-->

<!--                <p>-->
<!--                  <span style="font-weight: bolder">Key_List: </span>-->
<!--                  <span style="font-size: 14px">{{JSON.stringify(item.pathValue)}}</span>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div style="cursor: pointer" @click="remove({id:item.id})">-->
<!--                <close-outlined />-->
<!--              </div>-->
<!--            </div>-->
<!--            <a-divider/>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <p v-else>{{$t('pleaseSelectAPath')}}</p>
      <a-button type="primary" style="margin-top: 14px" @click="submit">{{$t('save')}} Sort Key</a-button>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, watch} from 'vue';
import {
  comparisonModifyInsert,
  comparisonModifyRemove,
  comparisonUseResultAsList,
  queryMsgSchema
} from "@/request/analysis";
import {message} from "ant-design-vue";
import {
  CloseOutlined
} from '@ant-design/icons-vue';
export default defineComponent({
  components:{CloseOutlined},
  props:{
    visible: {
      type: Boolean,
      default: false
    },
    outParams:{
      type:Object,
      default:{
        "id": "",
        "listPath": "",
        "useTestMsg": false
      }
    },
    planItem:{
      type:Object,
      default:{
      }
    }
  },
  setup(props,{emit}) {
    const treeData = ref([])
    const checkedKeys = ref<string[]>([]);
    const detailsList = ref([])
    function changeVisible(val:any) {
      emit('changeVisible',{visible: val})
    }
    const comparisonUseResult:any = ref({})
    function getDetailsListByPathName() {
      comparisonUseResultAsList({appId:props.planItem.appId}).then((res:any)=>{
        detailsList.value = res[0].detailsList.filter((item:any)=>item.pathName === props.outParams?.listPath)
        comparisonUseResult.value = res[0]
        checkedKeys.value = detailsList.value[0]?.pathValue || []
      })
    }
    function renderData() {
      checkedKeys.value = []
      queryMsgSchema({
        ...props.outParams,
        listPath:props.outParams?.listPath
      }).then((res:any)=>{
        emit('isArr',res.schema?true:false)
        const schema = res.schema?JSON.parse(res.schema):{}
        function recur(schema:any,result:any,p:any) {
          if (schema.properties){
            const o = schema.properties
            for (const k in o) {
              if (o[k].items){
                result.push({
                  title:k,
                  key:[...p,k].join('/'),
                  children:[]
                })
                recur(o[k].items,result.find((item:any)=>item.title ===k).children,[...p,k])
              } else {
                result.push({
                  title:k,
                  key:[...p,k].join('/'),
                })
              }
            }
          }
          return result
        }
        treeData.value = recur(schema,[],[])
        // 根据所选的
        getDetailsListByPathName()
      })
    }
    watch(()=>props.outParams,()=>{
      renderData()
    },{
      deep:true
    })
    function remove({id}:any) {
      comparisonModifyRemove({
        "id": comparisonUseResult.id,
        "appId": props.planItem.appId,
        "operationId": props.planItem.operationId,
        "categoryType": 0,
        "detailsList": [
          {
            "id": id
          }
        ]
      }).then(res=>{
        message.success('删除成功')
        getDetailsListByPathName()
      })
    }
    function submit() {


      Promise.all(detailsList.value.map(item=>{


        return comparisonModifyRemove({
          "id": comparisonUseResult.id,
          "appId": props.planItem.appId,
          "operationId": props.planItem.operationId,
          "categoryType": 0,
          "detailsList": [
            {
              "id": item.id
            }
          ]
        })

      })).then(res=>{
        comparisonModifyInsert({
          "appId": props.planItem.appId,
          "operationId": props.planItem.operationId,
          "categoryType": 0,
          "detailsList": [
            {
              "pathName": props.outParams?.listPath,
              "pathValue": [...checkedKeys.value]
            }
          ]
        }).then(res=>{
          if (res){
            message.success('保存成功')
            getDetailsListByPathName()
          }
        })
      })




    }
    return {
      props,
      changeVisible,
      treeData,
      checkedKeys,
      submit,
      detailsList,
      remove
    };
  },
});
</script>
<style lang="less">
#jsoneditorBox{
  width: 100%;
  height: 450px;
  /*隐藏元素*/
  button.jsoneditor-button.jsoneditor-contextmenu-button{
    display: none;
  }
  .jsoneditor-menu>button{
    display: none;
  }

  /*隐藏搜索框*/
  div.jsoneditor-menu > div > div.jsoneditor-frame > button.jsoneditor-refresh{
    display: none;
  }
  div.jsoneditor-menu > div > div.jsoneditor-frame > input[type=text]{
    cursor: not-allowed;
    display: none;
  }
  div.jsoneditor-menu > div.jsoneditor-search{
    display: none;
  }
}
</style>
