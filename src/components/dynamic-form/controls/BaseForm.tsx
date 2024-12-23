import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NFlex,
  NFormItem,
  NGrid,
  NGridItem,
  NIcon,
  NInput,
  NInputNumber,
  NScrollbar,
  NSelect,
  NSwitch,
  NText,
  useDialog,
  type FormItemProps,
  type FormItemRule,
} from "naive-ui";
import Draggable from "vuedraggable";
import draggableC from "../config/draggableC";
import {
  BaseCon,
  type BaseRightRenderK,
  type IConRenderOp,
  type IConRightRenderItemOp,
  type IConRightRenderOp,
} from "./BaseCon";
import { AddCircle, Move, RemoveCircle } from "@vicons/ionicons5";
import type { JSX } from "vue/jsx-runtime";
import CodeEditInput from "../com/codeEditInput.vue";

export interface IRule {
  type: FormItemRule["type"] | "";
  message: string;
  required?: boolean;
  trigger?: FormItemRule["trigger"];
  level?: FormItemRule["level"];
  validator?: string;
  pattern?: string;
  min?: number;
  max?: number;
  len?: number;
  enum?: string;
  whitespace?: boolean;
  fields?: Record<string, IRule>;
}

/**
 * 表单控件基类
 */
export class BaseForm extends BaseCon<"form"> {
  label = "控件";
  /** 将值收集到外层表单 model 对象的路径 */
  path: string | undefined = undefined;

  /**
   * 表单的一些属性
   * 见文档 https://www.naiveui.com/zh-CN/os-theme/components/form#FormItem-Props
   */

  private labelAlign: FormItemProps["labelAlign"] = "right";
  private labelPlacement: FormItemProps["labelPlacement"] = "left";
  private labelStyle: FormItemProps["labelStyle"] = "";
  private labelWidth: FormItemProps["labelWidth"] = "auto";
  private showFeedback: FormItemProps["showFeedback"] = true;
  private showLabel: FormItemProps["showLabel"] = true;
  private showRequireMark: FormItemProps["showRequireMark"] = true;
  private requireMarkPlacement: FormItemProps["requireMarkPlacement"] = "right";
  private size: FormItemProps["size"] = "medium";
  /** 校验规则列表 */
  private rule: (IRule & {
    key: string;
  })[] = [];

  private selfProps: (keyof Pick<
    FormItemProps,
    | "labelAlign"
    | "labelPlacement"
    | "labelWidth"
    | "showFeedback"
    | "showLabel"
    | "showRequireMark"
    | "requireMarkPlacement"
    | "size"
  >)[] = [];

  /** 表单默认值 */
  formDefaultValue: any = undefined;

  constructor() {
    super();
    this.path = this.conType.toLocaleLowerCase() + "-" + this.key.slice(0, 7);
    this.label = this.conName;
  }

  getFormDefaultValue() {
    return this.formDefaultValue;
  }

  /**
   * 添加一个表单验证规则
   * @param op
   * @param editable
   */
  addRule(op: IRule) {
    this.rule.push({
      ...op,
      key: BaseCon.getHash(),
    });
  }

  getFormItemProps(): FormItemProps {
    let hRule = (rule: IRule) => {
      let _: FormItemRule = {
        type: rule.type || undefined,
        message: rule.message,
        required: rule.required,
        trigger: rule.trigger,
        level: rule.level,
        pattern: rule.pattern,
        min: rule.min,
        max: rule.max,
        len: rule.len,
        enum: rule.enum?.split(",") || [],
        whitespace: rule.whitespace,
        validator: rule.validator
          ? (rule_, value, callback) => {
              try {
                return new Function(
                  "rule",
                  "value",
                  "callback",
                  rule.validator!
                )(rule_, value, callback);
              } catch (e) {
                console.error("校验函数错了", rule_, value, this, e);
              }
            }
          : undefined,
        fields: rule.fields
          ? Object.keys(rule.fields).reduce<Record<string, any>>((a, b) => {
              (a as any)[b] = hRule(rule.fields![b]);
              return a;
            }, {})
          : undefined,
      };
      return _;
    };
    return {
      label: this.label,
      path: this.path,
      labelAlign: this.selfProps.includes("labelAlign")
        ? this.labelAlign
        : undefined,
      labelPlacement: this.selfProps.includes("labelPlacement")
        ? this.labelPlacement
        : undefined,
      labelStyle: this.labelStyle,
      labelWidth: this.selfProps.includes("labelWidth")
        ? this.labelWidth
        : undefined,
      showFeedback: this.selfProps.includes("showFeedback")
        ? this.showFeedback
        : undefined,
      showLabel: this.selfProps.includes("showLabel")
        ? this.showLabel
        : undefined,
      showRequireMark: this.selfProps.includes("showRequireMark")
        ? this.showRequireMark
        : undefined,
      requireMarkPlacement: this.selfProps.includes("requireMarkPlacement")
        ? this.requireMarkPlacement
        : undefined,
      size: this.selfProps.includes("size") ? this.size : undefined,
      rule: this.rule.map((_) => {
        return hRule(_);
      }),
    };
  }

  /**
   * 设置是否显示label
   * @param value 
   */
  setShowLabel(value: FormItemProps["showLabel"]) {
    this.showLabel = value;
    if (!this.selfProps.includes("showLabel")) {
      this.selfProps.push("showLabel");
    }
  }

  /**
   * 获取表单值ref，如果存在formdata的话就改formdata里面的值，反之则改formDefaultValue
   * @param formData
   */
  getFormValueRef<V>(formData: any = undefined, v: V): { value: V } {
    return Object.defineProperties(
      {},
      {
        value: {
          get: () => {
            return formData ? formData[this.path || ""] : this.formDefaultValue;
          },
          set: (v) => {
            formData
              ? (formData[this.path || ""] = v)
              : (this.formDefaultValue = v);
          },
        },
      }
    ) as any;
  }

  renderMiddleware(op: IConRenderOp) {
    let formItemProps = this.getFormItemProps();
    return (
      <NFormItem
        path={formItemProps.path}
        label={formItemProps.label}
        label-align={formItemProps.labelAlign}
        label-placement={formItemProps.labelPlacement}
        label-style={formItemProps.labelStyle}
        label-width={formItemProps.labelWidth}
        rule={formItemProps.rule}
        show-feedback={formItemProps.showFeedback}
        show-label={formItemProps.showLabel}
        show-require-mark={formItemProps.showRequireMark}
        require-mark-placement={formItemProps.requireMarkPlacement}
        size={formItemProps.size}
      >
        {this.renderRaw(op)}
      </NFormItem>
    );
  }

  getRightDefaultExpanded(): (BaseRightRenderK | "form")[] {
    return [...super.getRightDefaultExpanded(), "form"];
  }

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    _.push({
      key: "form",
      title: "表单属性",
      childs: [
        {
          label: "表单字段路径",
        },
        {
          editor: <NInput v-model:value={this.path} />,
        },
        {
          label: "标签名",
          editor: <NInput v-model:value={this.label} />,
        },
        {
          label: "标签宽度",
          editor: (
            <NFlex wrap={false} align="center">
              <NCheckbox
                checked={this.selfProps.includes("labelWidth")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("labelWidth")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "labelWidth"
                      ));
                }}
              ></NCheckbox>
              <NInput v-model:value={this.labelWidth} />
            </NFlex>
          ),
        },
        {
          label: "标签对齐方式",
          editor: (
            <NFlex wrap={false} align="center" style={"width: 100%"}>
              <NCheckbox
                checked={this.selfProps.includes("labelAlign")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("labelAlign")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "labelAlign"
                      ));
                }}
              ></NCheckbox>
              <NSelect
                v-model:value={this.labelAlign}
                placeholder="请选择"
                options={[
                  { label: "left", value: "left" },
                  { label: "center", value: "center" },
                  { label: "right", value: "right" },
                ]}
              />
            </NFlex>
          ),
        },
        {
          label: "标签位置",
          editor: (
            <NFlex wrap={false} align="center" style={"width: 100%"}>
              <NCheckbox
                checked={this.selfProps.includes("labelPlacement")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("labelPlacement")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "labelPlacement"
                      ));
                }}
              ></NCheckbox>
              <NSelect
                v-model:value={this.labelPlacement}
                placeholder="请选择"
                options={[
                  { label: "left", value: "left" },
                  { label: "top", value: "top" },
                ]}
              />
            </NFlex>
          ),
        },
        {
          label: "标签样式",
        },
        {
          editor: <NInput v-model:value={this.labelStyle} type="textarea" />,
        },
        {
          label: "展示标签",
          editor: (
            <NFlex wrap={false} align="center">
              <NCheckbox
                checked={this.selfProps.includes("showLabel")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("showLabel")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "showLabel"
                      ));
                }}
              ></NCheckbox>
              <NSwitch v-model:value={this.showLabel} />
            </NFlex>
          ),
        },
        {
          label: "展示必填星号",
          editor: (
            <NFlex wrap={false} align="center" style={"width: 100%"}>
              <NCheckbox
                checked={this.selfProps.includes("showRequireMark")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("showRequireMark")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "showRequireMark"
                      ));
                }}
              ></NCheckbox>
              <NSwitch v-model:value={this.showRequireMark} />
            </NFlex>
          ),
        },
        {
          label: "必填星号位置",
          editor: (
            <NFlex wrap={false} align="center" style={"width: 100%"}>
              <NCheckbox
                checked={this.selfProps.includes("requireMarkPlacement")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("requireMarkPlacement")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "requireMarkPlacement"
                      ));
                }}
              ></NCheckbox>
              <NSelect
                v-model:value={this.requireMarkPlacement}
                placeholder="请选择"
                options={[
                  { label: "left", value: "left" },
                  { label: "right", value: "right" },
                  { label: "right-hanging", value: "right-hanging" },
                ]}
              />
            </NFlex>
          ),
        },
        {
          label: "展示校验反馈",
          editor: (
            <NFlex wrap={false} align="center">
              <NCheckbox
                checked={this.selfProps.includes("showFeedback")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("showFeedback")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "showFeedback"
                      ));
                }}
              ></NCheckbox>
              <NSwitch v-model:value={this.showFeedback} />
            </NFlex>
          ),
        },
        {
          label: "尺寸",
          editor: (
            <NFlex wrap={false} align="center" style={"width: 100%"}>
              <NCheckbox
                checked={this.selfProps.includes("size")}
                on-update:checked={(v: boolean) => {
                  v
                    ? this.selfProps.push("size")
                    : (this.selfProps = this.selfProps.filter(
                        (_) => _ != "size"
                      ));
                }}
              ></NCheckbox>
              <NSelect
                v-model:value={this.size}
                placeholder="请选择"
                options={[
                  { label: "large", value: "large" },
                  { label: "medium", value: "medium" },
                  { label: "small", value: "small" },
                ]}
              />
            </NFlex>
          ),
        },
        ...this.getRightRule(),
      ],
    });
    return _;
  }

  getRightRule(): IConRightRenderItemOp["childs"] {
    const dialog = useDialog();
    let getP = (
      r: IRule,
      p: keyof IRule,
      title: string,
      h: JSX.Element,
      branch = false
    ) => {
      if (typeof r[p] == "undefined") {
        return;
      }
      return (
        <>
          <NGridItem span={branch ? 24 : 10}>{title}</NGridItem>
          <NGridItem span={branch ? 24 : 14}>{h}</NGridItem>
        </>
      );
    };
    let getPAdd = function <T extends keyof IRule>(
      r: IRule,
      p: T,
      df: IRule[T],
      title: string,
      content: string,
      d = false
    ) {
      return (
        <NCard size="small">
          {{
            header: () => {
              return (
                <NFlex align="center">
                  <NText>{title}</NText>
                  <NSwitch
                    disabled={d}
                    value={typeof r[p] != "undefined"}
                    onUpdate:value={(v) => {
                      v ? (r[p] = df) : ((r as any)[p] = undefined);
                    }}
                  ></NSwitch>
                </NFlex>
              );
            },
            default: () => {
              return (
                <NFlex vertical>
                  {content
                    .split(/\n/)
                    .map((_) => _.trim())
                    .filter(Boolean)
                    .map((_) => (
                      <NText>{_}</NText>
                    ))}
                </NFlex>
              );
            },
          }}
        </NCard>
      );
    };
    return [
      {
        label: "校验列表",
      },
      {
        editor: (
          <NFlex vertical style={"width: 100%"}>
            <Draggable
              class="draggable"
              modelValue={this.rule}
              onUpdate:modelValue={(_: any[]) => {
                this.rule = [..._];
              }}
              animation={draggableC.animation}
              handle=".drag-handler"
              item-key="key"
            >
              {{
                item: ({
                  element: _,
                }: {
                  element: getArrayItemType<BaseForm["rule"]>;
                }) => {
                  return (
                    <NCard style="margin-bottom: 10px;width: 100%" size="small">
                      <NFlex wrap={false} justify="space-between">
                        <NGrid yGap={5} xGap={5}>
                          {[
                            getP(
                              _,
                              "type",
                              "数据类型",
                              <NSelect
                                v-model:value={_.type}
                                placeholder="请选择"
                                options={[
                                  { label: "string", value: "string" },
                                  { label: "number", value: "number" },
                                  { label: "boolean", value: "boolean" },
                                  { label: "integer", value: "integer" },
                                  { label: "float", value: "float" },
                                  { label: "array", value: "array" },
                                  { label: "enum", value: "enum" },
                                  { label: "date", value: "date" },
                                  { label: "url", value: "url" },
                                  { label: "hex", value: "hex" },
                                  { label: "email", value: "email" },
                                ]}
                              />
                            ),
                            getP(
                              _,
                              "message",
                              "错误提示",
                              <NInput v-model:value={_.message} />
                            ),
                            getP(
                              _,
                              "required",
                              "必填",
                              <NSwitch v-model:value={_.required} />
                            ),
                            getP(
                              _,
                              "trigger",
                              "触发方式",
                              <NSelect
                                v-model:value={_.trigger}
                                multiple
                                placeholder="请选择"
                                options={[
                                  { label: "input", value: "input" },
                                  { label: "change", value: "change" },
                                  { label: "blur", value: "blur" },
                                  { label: "focus", value: "focus" },
                                ]}
                              />
                            ),
                            getP(
                              _,
                              "level",
                              "错误提示类型",
                              <NSelect
                                v-model:value={_.level}
                                placeholder="请选择"
                                options={[
                                  { label: "error", value: "error" },
                                  { label: "warning", value: "warning" },
                                ]}
                              />
                            ),
                            getP(
                              _,
                              "pattern",
                              "正则校验",
                              <NInput v-model:value={_.pattern} />
                            ),
                            getP(
                              _,
                              "min",
                              "最小值",
                              <NInputNumber v-model:value={_.min} />
                            ),
                            getP(
                              _,
                              "max",
                              "最大值",
                              <NInputNumber v-model:value={_.max} />
                            ),
                            getP(
                              _,
                              "len",
                              "最值",
                              <NInputNumber v-model:value={_.len} />
                            ),
                            getP(
                              _,
                              "enum",
                              "枚举",
                              <NInput v-model:value={_.enum} />
                            ),
                            getP(
                              _,
                              "whitespace",
                              "空格检测",
                              <NSwitch v-model:value={_.whitespace} />
                            ),
                            getP(
                              _,
                              "validator",
                              "校验函数",
                              <NFlex vertical>
                                <NText>
                                  function (rule, value, callback) {"{"}
                                </NText>
                                <CodeEditInput
                                  value={_.validator}
                                  onUpdate:value={(v) => {
                                    _.validator = v;
                                  }}
                                  options={{
                                    lang: "javascript",
                                  }}
                                />
                                <NText>{"}"}</NText>
                              </NFlex>,
                              true
                            ),
                          ]}
                          <NGridItem span={10}>
                            <NButton
                              size="small"
                              onClick={() => {
                                let d = dialog.success({
                                  showIcon: false,
                                  style: `width: 500px;`,
                                  title: "启用规则",
                                  content: () => {
                                    return (
                                      <NScrollbar style="height: 600px">
                                        <NFlex vertical>
                                          {[
                                            getPAdd(
                                              _,
                                              "type",
                                              "string",
                                              "数据类型",
                                              `
                                            string: 必须是字符串类型。
                                            number: 必须是数字类型。
                                            boolean: 必须是boolean类型。
                                            integer: 必须是数字类型和整数。
                                            float: 必须是数字类型和浮点数类型。
                                            array: 数组。
                                            enum: 取值必须在enum中存在。
                                            date: 取值必须由date决定
                                            url: 必须是url类型。
                                            hex: 必须是hex类型。
                                            email: 必须是email类型。
                                            `,
                                              true
                                            ),
                                            getPAdd(
                                              _,
                                              "message",
                                              "",
                                              "错误提示",
                                              `验证失败时提示的消息`
                                            ),
                                            getPAdd(
                                              _,
                                              "required",
                                              false,
                                              "是否必填",
                                              "必需的规则属性指示该字段必须存在于正在验证的源对象上"
                                            ),
                                            getPAdd(
                                              _,
                                              "trigger",
                                              [],
                                              "触发方式",
                                              "触发校验的时机"
                                            ),
                                            getPAdd(
                                              _,
                                              "level",
                                              "error",
                                              "错误提示类型",
                                              `
                                            error: 报错。
                                            warning: 警告。
                                            `
                                            ),
                                            getPAdd(
                                              _,
                                              "pattern",
                                              "",
                                              "匹配值的正则表达式",
                                              "匹配值的正则表达式"
                                            ),
                                            getPAdd(
                                              _,
                                              "min",
                                              0,
                                              "最小值",
                                              "对于字符串和数组类型，比较是根据长度进行的，对于数字类型，数字不得小于 min"
                                            ),
                                            getPAdd(
                                              _,
                                              "max",
                                              0,
                                              "最大值",
                                              "对于字符串和数组类型，比较是根据长度进行的，对于数字类型，数字不得大于 max"
                                            ),
                                            getPAdd(
                                              _,
                                              "len",
                                              0,
                                              "长度验证",
                                              "要验证字段的确切长度，请指定len属性。对于字符串和数组类型，比较是在length属性上执行的，对于数字类型，该属性表示数字的精确匹配，也就是说，它可能只严格等于len。"
                                            ),
                                            getPAdd(
                                              _,
                                              "enum",
                                              "",
                                              "枚举",
                                              "要验证可能值列表中的值，请使用带有枚举属性的enum类型，该属性列出该字段的有效值"
                                            ),
                                            getPAdd(
                                              _,
                                              "whitespace",
                                              false,
                                              "空格检测",
                                              "通常将只包含空格的必填字段视为错误。规则必须是字符串类型。"
                                            ),
                                            getPAdd(
                                              _,
                                              "validator",
                                              "",
                                              "字段自定义验证函数",
                                              `字段自定义验证函数 参数为:
                                              rule: 当前字段的校验规则
                                              value: 当前字段的值
                                              callback: xxx
                                              `
                                            ),
                                          ]}
                                        </NFlex>
                                      </NScrollbar>
                                    );
                                  },
                                });
                              }}
                            >
                              启用规则
                            </NButton>
                          </NGridItem>
                          <NGridItem span={14}></NGridItem>
                        </NGrid>
                        <NFlex vertical align="center">
                          <NIcon
                            class="drag-handler"
                            style="cursor: move;"
                            size={20}
                          >
                            <Move />
                          </NIcon>
                          <NButton
                            size="small"
                            quaternary
                            circle
                            onClick={() => {
                              let i = this.rule.findIndex(
                                (__) => _.key == __.key
                              );
                              if (i >= 0) {
                                this.rule.splice(i, 1);
                              }
                            }}
                          >
                            <NIcon size={20}>
                              <RemoveCircle />
                            </NIcon>
                          </NButton>
                        </NFlex>
                      </NFlex>
                    </NCard>
                  );
                },
              }}
            </Draggable>
            <NButton
              type="primary"
              onClick={() => {
                this.rule.push({
                  key: BaseCon.getHash(),
                  type: "",
                  message: "",
                });
              }}
            >
              增加校验
            </NButton>
          </NFlex>
        ),
      },
    ];
  }
}
