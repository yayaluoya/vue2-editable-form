# 安装使用

必须要 vue3 的项目才能使用哦

先 npm 安装

```sh
npm i vue3-editable-form-builds
```

安装一下就能直接使用了哦，不用引入 css 文件，也不用依赖别的组件库哦。

`vue3-editable-form-builds` 导出的模块如下

```ts
/**
 * 所有的内部控件列表
 */
export {
  Alert,
  BaseCon,
  BaseForm,
  BaseOption,
  Button,
  Card,
  Checkbox,
  Collapse,
  ColorPicker,
  DatePicker,
  Divider,
  Grid,
  Input,
  InputNumber,
  Interval,
  LabelPage,
  Radio,
  Rate,
  Select,
  Slider,
  Split,
  Switch,
  Table,
  Test,
  Text,
  TimePicker,
  Upload,
} from "./src/components/dynamic-form/controls/index";
/**
 * 控件工具类
 * ConT.toConfigs 能把控件实例列表转成配置文件
 * ConT.toCons 能把配置文件转成控件实例列表
 * ConT.getFromData 通过实例列表获取默认 formData
 */
export { ConT } from "./src/components/dynamic-form/ConT";
/**
 * 获取一个默认的表单配置信息
 */
export { getFormConfig } from "./src/components/dynamic-form/config/getFormConfig";
/**
 * 表单编辑组件
 */
export { default as vue3EditableForm } from "./src/components/dynamic-form/index.vue";
/**
 * 表单渲染组件
 */
export { default as vue3EditableFormRender } from "./src/components/dynamic-form/render.vue";
```

使用表单编辑组件示例

```vue
<script>
import { defineComponent, ref } from "vue";
import {
  vue3EditableForm,
  getFormConfig,
  Test,
} from "vue3-editable-form-builds";

export default defineComponent({
  components: { vue3EditableForm },
  setup() {
    let cons = ref([]);
    /**
     * 扩展控件列表
     */
    let extendCons = ref([Test]);
    let formConfig = ref(getFormConfig());
    return {
      cons,
      formConfig,
      extendCons,
    };
  },
});
</script>

<template>
  <vue3EditableForm
    :cons="cons"
    :extendCons="extendCons"
    :formConfig="formConfig"
    @update:cons="
      (v) => {
        cons = v;
      }
    "
  />
</template>
```

使用表单渲染组件示例

```vue
<script>
import { defineComponent, ref } from "vue";
import {
  vue3EditableFormRender,
  ConT,
  getFormConfig,
} from "vue3-editable-form-builds";

export default defineComponent({
  components: { vue3EditableFormRender },
  setup() {
    /**
     * 通过配置信息生成控件实例列表
     */
    let cons = ref(ConT.toCons([]));
    let formConfig = ref(getFormConfig());
    let formData = ref(ConT.getFromData(cons));
    return {
      cons,
      formConfig,
      formData,
    };
  },
});
</script>

<template>
  <vue3EditableFormRender
    :cons="cons"
    :formConfig="formConfig"
    :formData="formData"
  />
</template>
```
