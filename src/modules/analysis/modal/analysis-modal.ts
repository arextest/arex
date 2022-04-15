import {nextTick, ref} from "vue";

export default () => {
  const caseListTableRef = ref();
  const caseListFilterRef = ref();
  const visible = ref(false);

  const onOk = () => {
    onCancel()
  }

  const onCancel = () => {
    visible.value = false
  }

  const onShow = async () => {
    visible.value = true
    await nextTick();
    let params = {
      pageIndex: 1,
      pageSize: 10
    }
    caseListTableRef.value.onSetItems(params);
  }

  const onSearch = () => {
    let params = {
      pageIndex: 1,
      pageSize: 10,
      keyWord: undefined,
      diffResultCode: undefined
    }
    if (caseListFilterRef.value.searchKey) {
      params.keyWord = caseListFilterRef.value.searchKey
      caseListTableRef.value.keyWord = caseListFilterRef.value.searchKey
    }
    if (caseListFilterRef.value.diffResultCodeSelect && caseListFilterRef.value.diffResultCodeSelect.value != -1) {
      params.diffResultCode = caseListFilterRef.value.diffResultCodeSelect.value
      caseListTableRef.value.searchDiffCode = caseListFilterRef.value.diffResultCodeSelect.value
    }
    caseListTableRef.value.onSetItems(params);


  }

  return {
    visible,
    caseListTableRef,
    caseListFilterRef,

    onOk,
    onCancel,
    onShow,
    onSearch
  }
}
