# 控件列表

## Alert 提示

## BaseCon 控件基类

所有控件均从此类继承

## BaseForm 表单控件基类 从 BaseCon 继承

重写了基类的 renderMiddleware 方法，返回一个 NFormItem 组件

内置了一些表单属性

扩展了 BaseCon 的右侧编辑栏，用来编辑 NFormItem 的一些基本属性和校验规则。

## BaseOption 有多个选项的控件的基类 从 BaseForm 继承

Checkbox，Radio，Select 都是继承的这个类

这个类里面有一个选项列表，并扩展了右侧编辑栏来编辑这些选项

## Button 按钮

## Card 卡片

## Checkbox 多选框

## Collapse 折叠面板

## ColorPicker 颜色选择器

## DatePicker 日期选择器

## Divider 分隔线

## Grid 栅格

## Input 输入框

## InputNumber 数字输入框

## Interval 空白间隔

## LabelPage 标签页

## Radio 单选框

## Rate 评分

## Select 选择器

## Slider 滑块

## Split 面板分割

## Switch 开关

## Table 表格

## Test 测试

这是一个测试控件，看看它的实现逻辑就能知道想自定义一个控件需要这么做了。

```tsx
import {
  BaseCon,
  type IConRenderOp,
  type IConRightRenderItemOp,
  type IConRightRenderOp,
} from "./BaseCon";
import {
  NFlex,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NSwitch,
  NText,
} from "naive-ui";
import { BaseForm, type IRule } from "./BaseForm";

/**
 * 测试
 */
export class Test extends BaseForm {
  /** 控件类型 */
  static ConType = "Test";
  /** 控件名字 */
  static ConName = "测试";
  /** 单例对象 */
  static I = new Test();

  /** 表单默认值 */
  formDefaultValue = {
    number: 1,
    str: "字符串",
    b: false,
  };

  props = {
    minNumber: 10,
  };

  constructor() {
    super();
    this.addRule({
      type: "object",
      message: "",
      fields: {
        number: {
          type: "number",
          min: this.props.minNumber,
          message: "数字不能小于" + this.props.minNumber,
        },
      },
    });
    this.setShowLabel(false);
  }

  /**
   * 最底层渲染方法
   * @param op
   */
  renderRaw({ formData }: IConRenderOp) {
    let { value } = this.getFormValueRef(formData, this.formDefaultValue);
    return (
      <NFlex vertical>
        <NText style={"color: blue;font-size: 20px;"}>
          你觉得这个组件怎么样？
        </NText>
        <NGrid xGap={5} yGap={5}>
          <NGridItem span={5}>
            <NText>评价:</NText>
          </NGridItem>
          <NGridItem span={20}>
            <NInput v-model:value={value.str} />
          </NGridItem>
        </NGrid>
        <NGrid xGap={5} yGap={5}>
          <NGridItem span={5}>
            <NText>分数:</NText>
          </NGridItem>
          <NGridItem span={20}>
            <NInputNumber v-model:value={value.number} />
          </NGridItem>
        </NGrid>
      </NFlex>
    );
  }

  /**
   * 获取右侧编辑栏默认展开的栏目
   */
  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    _.find((_) => _.key == "form")?.childs.push(
      ...[
        {
          label: "数字最小值",
          editor: <NInputNumber v-model:value={this.props.minNumber} />,
        },
      ]
    );
    return _;
  }

  /**
   * 覆盖掉右侧的校验规则编辑栏，可以在这里自定义校验规则的编辑
   */
  getRightRule() {
    return [];
  }
}
```

## Text 文字

## TimePicker 时间选择器

## Upload 文件上传
