import { BaseCon } from "./BaseCon";
import "../style/slider.scss";

/**
 * 滑块
 */
export class Slider extends BaseCon {
  /** 控件类型 */
  static ConType = "Slider";
  /** 控件名字 */
  static ConName = "滑块";
  /** 单例对象 */
  static I = new Slider();

  props = {
    min: 0,
    max: 100,
    step: 1,
    showInput: false,
    range: false,
    marks: [],
  };

  formDefaultValue = 0;

  renderRaw({ formData }) {
    let ref = this.getFormValueRef(formData, this.formDefaultValue);
    return (
      <div className="controls__ slider">
        <el-slider
          model-value={ref.value}
          onInput={(v) => {
            ref.value = v;
          }}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          show-input={this.props.showInput}
          range={this.props.range}
          marks={this.props.marks.reduce((a, b) => {
            a[b.value] = {
              style: b.style,
              label: b.label,
            };
            return a;
          }, {})}
        />
      </div>
    );
  }

  getRight(op, hasEditor = true) {
    let _ = super.getRight(...arguments);
    hasEditor &&
      _.find((_) => _.title == "常用属性").childs.unshift(
        ...[
          {
            label: "最小值",
            editor: (
              <el-input-number
                size="small"
                max={this.props.max}
                model-value={this.props.min}
                onChange={(v) => {
                  this.props.min = v;
                }}
              />
            ),
          },
          {
            label: "最大值",
            editor: (
              <el-input-number
                size="small"
                min={this.props.min}
                model-value={this.props.max}
                onChange={(v) => {
                  this.props.max = v;
                }}
              />
            ),
          },
          {
            label: "步长",
            editor: (
              <el-input-number
                size="small"
                min={0}
                model-value={this.props.step}
                onChange={(v) => {
                  this.props.step = v;
                }}
              />
            ),
          },
          {
            label: "显示输入框",
            editor: (
              <el-switch
                size="small"
                model-value={this.props.showInput}
                onChange={(v) => {
                  this.props.showInput = v;
                }}
              ></el-switch>
            ),
          },
          {
            label: "范围选择",
            editor: (
              <el-switch
                size="small"
                model-value={this.props.range}
                onChange={(v) => {
                  this.props.range = v;
                  if (v) {
                    this.formDefaultValue = [0, 0];
                  } else {
                    this.formDefaultValue = 0;
                  }
                }}
              ></el-switch>
            ),
          },
          {
            label: "标记",
            labelPosition: "top",
            editor: (
              <div class="controls__ slider-right">
                {this.props.marks.map((_, i) => {
                  return (
                    <div className="i">
                      <div className="item">
                        <span>值</span>
                        <el-input-number
                          size="small"
                          model-value={_.value}
                          onChange={(v) => {
                            _.value = v;
                          }}
                        />
                      </div>
                      <div className="item">
                        <span>标记</span>
                        <el-input
                          size="small"
                          clearable
                          model-value={_.label}
                          onInput={(v) => {
                            _.label = v;
                          }}
                        />
                      </div>
                      <div className="item">
                        <span>标记样式</span>
                        <el-input
                          size="small"
                          rows={2}
                          type="textarea"
                          model-value={_.style}
                          onInput={(v) => {
                            _.style = v;
                          }}
                        />
                      </div>
                      <el-icon
                        class="remove"
                        onClick={() => {
                          this.props.marks.splice(i, 1);
                        }}
                      >
                        <CircleClose />
                      </el-icon>
                    </div>
                  );
                })}
                <el-button
                  plain
                  size="small"
                  type="primary"
                  onClick={() => {
                    this.props.marks.push({
                      value: 0,
                      label: "",
                      style: "",
                    });
                  }}
                >
                  增加标记
                </el-button>
              </div>
            ),
          },
        ]
      );
    return _;
  }
}
