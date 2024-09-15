import { predefineColors } from "../config/predefineColors";
import { ObjectUtils } from "../tool/obj/ObjectUtils";

/**
 * 字体样式控制器
 */
export class FontStyleCon {
  fontSize = 16;
  color = "#000000";
  fontWeight = "normal";
  textDecoration = "";
  fontStyle = "";

  /**
   * @param {Partial<FontStyleCon>} op
   */
  constructor(op = {}) {
    for (let i in op) {
      this[i] = ObjectUtils.clone2(op[i]);
    }
  }

  render() {
    return [
      {
        label: "标签字体字号",
        editor: (
          <el-select
            model-value={this.fontSize}
            onChange={(v) => {
              this.fontSize = v;
            }}
            placeholder="请选择"
            size="small"
            filterable
          >
            {new Array(13).fill(0).map((_, i) => {
              return <el-option label={12 + i} value={12 + i}></el-option>;
            })}
          </el-select>
        ),
      },
      {
        label: "标签字体颜色",
        editor: (
          <el-color-picker
            model-value={this.color}
            onChange={(v) => {
              this.color = v;
            }}
            predefine={predefineColors}
            size="small"
          />
        ),
      },
    ];
  }
}
