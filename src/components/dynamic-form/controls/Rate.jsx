import { BaseCon } from "./BaseCon";
import "../style/rate.scss";

/**
 * 评分
 */
export class Rate extends BaseCon {
  /** 控件类型 */
  static ConType = "Rate";
  /** 控件名字 */
  static ConName = "评分";
  /** 单例对象 */
  static I = new Rate();

  props = {
    max: 5,
    allowHalf: false,
    clearable: false,
    showText: false,
    texts: ["", "", "", "", ""],
  };

  formDefaultValue = 0;

  renderRaw({ formData }) {
    let ref = this.getFormValueRef(formData, this.formDefaultValue);
    return (
      <el-rate
        model-value={ref.value}
        onChange={(v) => {
          ref.value = v;
        }}
        max={this.props.max}
        allow-half={this.props.allowHalf}
        clearable={this.props.clearable}
        show-text={this.props.showText}
        texts={this.props.texts}
      />
    );
  }

  getRight(op, hasEditor = true) {
    let _ = super.getRight(...arguments);
    hasEditor &&
      _.find((_) => _.title == "常用属性").childs.unshift(
        ...[
          {
            label: "最大分值",
            editor: (
              <el-input-number
                size="small"
                min={1}
                model-value={this.props.max}
                onChange={(v) => {
                  this.props.max = v;
                  if (this.props.texts.length > v) {
                    this.props.texts = this.props.texts.slice(0, v);
                  } else {
                    this.props.texts.push(
                      ...new Array(v - this.props.texts.length).fill("")
                    );
                  }
                }}
              />
            ),
          },
          {
            label: "允许半选",
            editor: (
              <el-switch
                size="small"
                model-value={this.props.allowHalf}
                onChange={(v) => {
                  this.props.allowHalf = v;
                }}
              ></el-switch>
            ),
          },
          {
            label: "可清除",
            editor: (
              <el-switch
                size="small"
                model-value={this.props.clearable}
                onChange={(v) => {
                  this.props.clearable = v;
                }}
              ></el-switch>
            ),
          },
          {
            label: "显示辅助文字",
            editor: (
              <el-switch
                size="small"
                model-value={this.props.showText}
                onChange={(v) => {
                  this.props.showText = v;
                }}
              ></el-switch>
            ),
          },
          this.props.showText && {
            label: "辅助文字",
            labelPosition: "top",
            editor: (
              <div class="controls__ rate">
                <div className="list">
                  {this.props.texts.map((_, i) => {
                    return (
                      <div className="i">
                        <span>{i + 1}</span>
                        <el-input
                          size="small"
                          model-value={_}
                          onInput={(v) => {
                            this.props.texts[i] = v;
                          }}
                        />
                        <el-icon
                          class="remove"
                          onClick={() => {
                            this.props.texts.splice(i, 1);
                          }}
                        >
                          <CircleClose />
                        </el-icon>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          },
        ]
      );
    return _;
  }
}
