import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import { i18n } from "./common/locale";
import lazyPlugin from "vue3-lazy";
import JsonViewer from "vue3-json-viewer";
import "@/assets/less/base.less";
import "ant-design-vue/dist/antd.less";
import "@/assets/less/global.less";
import "animate.css";
import 'jsoneditor/dist/jsoneditor.min.css'
import "vue3-json-viewer/dist/index.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Antd);
app.use(i18n);
app.use(JsonViewer);
app.use(lazyPlugin, {});
app.mount("#app");
