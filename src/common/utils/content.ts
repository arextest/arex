import {Modal, notification} from "ant-design-vue";
import {createVNode} from "vue";
import { ExclamationCircleOutlined } from "@/common/icon";
import store from "@/store";
import {SET_SCREEN_WIDTH} from "@/store/mutation-types";

export const showMessage = (title: string, content: string, okText: string, cancelText: string, onOk?: () => void,
                            onCancel?: () => void, duration: number = 500, type: string = "confirm") => {
  Modal[type]({
    title,
    content,
    okText,
    cancelText,
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
        onOk ? onOk() : () => {};
      });
    },
    onCancel,
  });
};

export const showNotification = (message: string, description: string, type: string = "open", duration?: number) => {
  let notifier: any = notification;
  notifier[type]({
    message,
    description,
    duration
  })
};

export const checkCount = (object: any) => {
  object.totalCaseCount = object.totalCaseCount || 0;
  object.errorCaseCount = object.errorCaseCount || 0;
  object.successCaseCount = object.successCaseCount || 0;
  object.failCaseCount = object.failCaseCount || 0;
  object.waitCaseCount = object.waitCaseCount || 0;
};

window.addEventListener("resize",() => store.commit(SET_SCREEN_WIDTH, document.body.offsetWidth));
