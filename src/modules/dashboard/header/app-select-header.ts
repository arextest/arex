import {ref} from 'vue';
import {debounce} from "@/common/utils";
import {queryAllAppId} from "@/request/dashboard";

export default (props: any, {emit}: any) => {
  const selectedAppId = ref();
  const options: any = ref([]);
  const onChange = debounce((value: string) => {
    console.log(`selected ${value}`);
    emit("onChange", {appId: value});
  });
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const onSetAppIds = () => {
    options.value = [];
    queryAllAppId().then((res: any) => {
      if (res && res.appIds) {
        res.appIds.forEach((appId: any) => {
          let option = {value: appId, label: appId};
          options.value.push(option);
        });
        if (options.value.length > 0) {
          selectedAppId.value = options.value[0].value;
          emit("onChange", {appId: selectedAppId.value});
        }
      }
    }).catch((err: any) => {
      console.log(err);
    })
  };
  onSetAppIds();
  return {
    selectedAppId,
    onChange,
    options,
    filterOption
  };
}
