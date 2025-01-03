## vue3-dynamic-form

#### vue3 可编辑表单

拖动式的生成动态表单，而且通过 typescript 面向对象开发的，能非常方便的扩展控件，内部 ui 使用的 naive-ui 库，所以能非常方便的定制主题。

demo https://vue3-dynamic-form.dumogu.top/

#### 安装使用

必须要 vue3 的项目才能使用哦

先 npm 安装

```sh
npm i vue3-editable-form-builds
```

安装一下就能直接使用了哦，不用引入 css 文件，也不用依赖别的组件库哦。

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
