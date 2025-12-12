import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import App from "./App.vue";

// 导入 TDesign 样式
import "tdesign-vue-next/dist/reset.css";
import "tdesign-vue-next/es/style/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
