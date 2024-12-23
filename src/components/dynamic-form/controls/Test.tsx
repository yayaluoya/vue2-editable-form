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

  formDefaultValue = {
    number: 60,
    str: "我觉得还行😄",
  };

  props = {
    minNumber: 0,
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

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    _.find((_) => _.key == "form")?.childs.push(
      ...[
        {
          label: "分数最小值",
          editor: <NInputNumber v-model:value={this.props.minNumber} />,
        },
      ]
    );
    return _;
  }

  getRightRule() {
    return [];
  }
}
