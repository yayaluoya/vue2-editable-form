import {
  NDivider,
  NInput,
  NSelect,
  NSwitch,
  type DividerProps,
} from "naive-ui";
import type { IConRightRenderOp, IConRightReterItemOp } from "./BaseCon";
import { NonForm } from "./NonForm";

/**
 * 分隔线
 */
export class Divider extends NonForm {
  /** 控件类型 */
  static ConType = "Divider";
  /** 控件名字 */
  static ConName = "分隔线";
  /** 单例对象 */
  static I = new Divider();

  props: {
    dashed: boolean;
    titlePlacement: DividerProps["titlePlacement"];
    title: string;
  } = {
    dashed: false,
    titlePlacement: "center",
    title: "",
  };

  renderRaw() {
    return (
      <NDivider
        dashed={this.props.dashed}
        titlePlacement={this.props.titlePlacement}
      >
        {this.props.title}
      </NDivider>
    );
  }

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    let add: IConRightReterItemOp["childs"] = [
      {
        label: "虚线分割",
        editor: <NSwitch v-model:value={this.props.dashed} />,
      },
      {
        label: "标题位置",
        editor: (
          <NSelect
            v-model:value={this.props.titlePlacement}
            placeholder="请选择"
            options={[
              { label: "left", value: "left" },
              { label: "center", value: "center" },
              { label: "right", value: "right" },
            ]}
          />
        ),
      },
      {
        label: "标题",
        editor: <NInput v-model:value={this.props.title} />,
      },
    ];
    _.find((_) => _.key == "com")?.childs!.unshift(...add);
    return _;
  }
}
