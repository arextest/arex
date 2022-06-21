// .eslintrc.js
module.exports = {
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
  env: {
    browser: true,
    es2021: true,
  },
  // 解决vue3 defineProps' is not defined.
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  // 启用的规则
  extends: ["standard"],
  parser: "@typescript-eslint/parser",
  // 引用的插件  下载的插件去掉eslint-plugin-前缀引入
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "import",
    "node",
    "promise",
  ],
  // 自定义规则
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "linebreak-style": "off",
    "comma-dangle": [0, "always-multiline"],
    quotes: [0, "double"],
    semi: [0, "always"],
    "space-before-function-paren": [0, "never"],
    "multiline-ternary": "off",
    camelcase: "off",
  },
};
