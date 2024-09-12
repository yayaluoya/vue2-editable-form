import { customAlphabet } from "nanoid";
import { ObjectUtils } from "../tool/obj/ObjectUtils";
import { getFormConfig } from "../config/getFormConfig";
import { FontStyle } from "../com/FontStyle";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 21);

/**
 * @typedef RenderOp
 * @property {import("vue").SetupContext} ctx
 * @property {ReturnType<getFormConfig>} formConfig
 * @property {BaseCon} parent
 * @property {BaseCon[]} cons
 * @property {BaseCon} activateCon
 * @property {Record<string,any>} formData
 */

/**
 * 基类控件
 */
export class BaseCon {
  /** 单例对象 */
  static I;
  /** 控件类型 */
  static ConType = "";
  /** 控件名字 */
  static ConName = "";

  /** 控件类型 */
  conType = "";
  /** 控件名字 */
  conName = "";
  /** 控件实例唯一的key，不可变的 */
  key = "";
  /** 渲染key */
  renderKey = "";
  /** @type {BaseCon[]} 子控件 */
  childs = [];
  /** 布局配置 */
  layout = {
    col: {
      /** 栅格占据的列数 */
      span: 24,
      /** 栅格左侧的间隔格数 */
      offset: 0,
      /** 栅格向右移动格数 */
      push: 0,
      /** 栅格向左移动格数 */
      pull: 0,
    },
  };

  /** 表单属性 */
  formItemProps = {
    /** 最终绑定到formData上的属性名，如果设置为undefined的话表示这个控件不绑定值到formData上 */
    prop: undefined,
    label: "控件",
    labelFontStyle: new FontStyle({
      fontSize: 14,
    }),
    /** 表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性 默认会继承 Form的label-position */
    labelPosition: undefined,
    /** 标签宽度，例如 '50px'。 可以使用 auto。 */
    labelWidth: undefined,
    required: false,
    rules: undefined,
    /** 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。 */
    error: "",
    /** 是否显示校验错误信息 */
    showMessage: true,
    /** 是否在行内显示校验信息 */
    inlineMessage: "",
    /** 用于控制该表单域下组件的默认尺寸 */
    size: undefined,
  };

  /** 表单默认值 */
  formDefaultValue = undefined;

  /** 是否可拖拽 */
  towable = true;

  constructor() {
    this.conType = this.constructor.ConType;
    this.conName = this.constructor.ConName;
    this.key = BaseCon.getKey();
    this.renderKey = BaseCon.getKey();
    // 属性名默认和key同名
    this.formItemProps.prop = this.key;
    this.formItemProps.label = this.conName;
  }

  /** 转JSON字符串 */
  toJSON() {
    let d = { ...this };
    delete d.renderKey;
    delete d.towable;
    return d;
  }

  /**
   * 初始化配置
   * TODO 主要是把一些配置转成class实例
   * @param {*} config 配置信息
   * @param {(config: any[],econs: BaseCon[] = [])=>BaseCon[]} toCons 转换成cons的方法
   * @returns
   */
  initConfig(config, toCons) {
    for (let i in config) {
      this[i] = ObjectUtils.clone2(config[i]);
    }
    this.formItemProps.labelFontStyle = new FontStyle(
      this.formItemProps.labelFontStyle
    );
    this.childs = toCons(this.childs);
    return this;
  }

  /** 更新渲染key */
  upadteRenderKey() {
    this.renderKey = BaseCon.getKey();
    //
    return this;
  }

  /** 获取子控件列表 */
  getChild() {
    return this.childs;
  }

  /** 是否必填字段 */
  getRequired() {
    return this.formItemProps.required;
  }

  /** 克隆自身 */
  clone() {
    let _ = this;
    _ = new this.constructor().initConfig(this);
    return _;
  }

  /**
   * 获取表单值ref，如果存在formdata的话就改formdata里面的值，反之则改formDefaultValue
   * @template V
   * @param {RenderOp['formData']} formData
   * @param {V} value 这个参数只是为了类型推断
   * @returns {{value: V}}
   */
  getFormValueRef(formData = undefined, value = undefined) {
    return Object.defineProperties(
      {},
      {
        value: {
          get: () => {
            return formData
              ? formData[this.formItemProps.prop]
              : this.formDefaultValue;
          },
          set: (v) => {
            formData
              ? (formData[this.formItemProps.prop] = v)
              : (this.formDefaultValue = v);
          },
        },
      }
    );
  }

  /**
   * 拖动事件
   */
  draggableE(e, ...arg) {}

  /**
   * formData改变事件
   * @param {*} formData
   * @param {BaseCon[]} cons
   */
  formDataChangeE(formData, cons) {}

  /**
   * 渲染拖拽时显示的元素
   * @param {RenderOp} op
   * @returns
   */
  renderDrag(op) {
    return this.renderCol(...arguments);
  }

  /**
   * 渲染行元素
   * @param {RenderOp} op
   * @returns
   */
  renderCol({ ctx, activateCon, formData, parent }) {
    return (
      <el-col
        key={this.renderKey}
        span={this.layout.col.span}
        offset={this.layout.col.offset}
        push={this.layout.col.push}
        pull={this.layout.col.pull}
      >
        {formData ? (
          this.renderFormItem(...arguments)
        ) : (
          <div
            class={[
              "controller",
              activateCon?.key == this.key ? "on" : "",
            ].join(" ")}
            onClick={(e) => {
              e.stopPropagation();
              ctx.emit("activateConF", this);
            }}
          >
            {this.towable ? (
              <div class="drag-handler">
                <el-icon>
                  <Rank />
                </el-icon>
                <span>{this.conName}</span>
              </div>
            ) : (
              <div class="con-name">
                <span>{this.conName}</span>
              </div>
            )}
            <div class="handler-button">
              <el-icon
                title="选择父组件"
                onClick={(e) => {
                  e.stopPropagation();
                  ctx.emit("activateConF", parent);
                }}
              >
                <Back />
              </el-icon>
              {this.getHandler(...arguments)}
            </div>
            <div class="form-item">{this.renderFormItem(...arguments)}</div>
          </div>
        )}
      </el-col>
    );
  }

  /**
   * 获取handler元素
   * @param {RenderOp} op
   * @returns
   */
  getHandler({ ctx }) {
    return [
      <el-icon
        title="上移组件"
        onClick={(e) => {
          e.stopPropagation();
          ctx.emit("moveF", this, "up");
        }}
      >
        <Top />
      </el-icon>,
      <el-icon
        title="下移组件"
        onClick={(e) => {
          e.stopPropagation();
          ctx.emit("moveF", this, "down");
        }}
      >
        <Bottom />
      </el-icon>,
      <el-icon
        title="删除组件"
        onClick={(e) => {
          e.stopPropagation();
          ctx.emit("removeF", this);
        }}
      >
        <DeleteFilled />
      </el-icon>,
    ];
  }

  /**
   * 渲染表单元素
   * @param {RenderOp} op
   * @returns
   */
  renderFormItem({ formConfig }) {
    return (
      <el-form-item
        prop={this.formItemProps.prop}
        label={this.formItemProps.label}
        label-position={this.formItemProps.labelPosition}
        label-width={
          //没有label时不显示label
          this.formItemProps.label ? this.formItemProps.labelWidth : "0px"
        }
        required={this.formItemProps.required}
        rules={this.formItemProps.rules}
        error={this.formItemProps.error}
        show-message={this.formItemProps.showMessage}
        inline-message={this.formItemProps.inlineMessage}
        size={this.formItemProps.size}
      >
        {{
          label: (...arg) => {
            return (
              <div style={`display: inline-flex`}>
                <span
                  style={{
                    "font-size":
                      this.formItemProps.labelFontStyle.fontSize + "px",
                    color: this.formItemProps.labelFontStyle.color,
                    // 'text-align': this.formItemProps.labelFontStyle.textAlign,
                    "font-weight": this.formItemProps.labelFontStyle.fontWeight,
                    "text-decoration":
                      this.formItemProps.labelFontStyle.textDecoration,
                    "font-style": this.formItemProps.labelFontStyle.fontStyle,
                  }}
                >
                  {this.formItemProps.label}
                  {formConfig.labelsuffix}
                </span>
              </div>
            );
          },
          default: () => {
            return this.renderRaw(...arguments);
          },
        }}
      </el-form-item>
    );
  }

  /**
   * 渲染
   * @param {RenderOp} op
   * @returns
   */
  renderRaw(op) {
    return <div></div>;
  }

  /**
   * 渲染右边编辑栏目
   * @param {RenderOp} op
   * @returns
   */
  renderRight(op) {
    return this.getRight(...arguments).map((_, i) => {
      return (
        <el-collapse-item title={_.title} name={_.title}>
          {_.childs.map((__) => {
            let { editor, ...props } = __.editor;
            return <el-form-item>{editor}</el-form-item>;
          })}
        </el-collapse-item>
      );
    });
  }

  /**
   * 获取右边编辑栏目
   * @param {RenderOp} op
   * @returns
   */
  getRight(op, hasEditor = true) {
    return [
      {
        title: "常用属性",
        childs: [
          {
            label: "",
            editor: hasEditor && <div>编辑</div>,
          },
        ],
      },
    ];
  }

  /**
   * 通过key查找某个控件实例
   * @param {BaseCon[]} list
   * @param {string|(a: BaseCon)=>boolean} key
   * @returns {BaseCon}
   */
  static findCon(list, key) {
    let equi = (o, key) => {
      switch (true) {
        case typeof key == "function":
          return key(o);
        default:
          return o.key == key;
      }
    };
    for (let o of list) {
      if (equi(o, key)) {
        return o;
      } else {
        let oo = BaseCon.findCon(o.getChild(), key);
        if (oo) {
          return oo;
        }
      }
    }
  }

  /**
   * 组件遍历，并返回所有的组件
   * @param {BaseCon[]} list
   * @param {(item: BaseCon, i: index)=>void} f
   * @returns {BaseCon[]}
   */
  static consForeach(list, f = undefined) {
    let cons = [];
    list.forEach((item, i) => {
      f?.(item, i);
      cons.push(item, ...BaseCon.consForeach(item.getChild(), f));
    });
    return cons;
  }

  /**
   * 插入控件
   * @param {BaseCon[]} list
   * @param {string} key
   * @param {BaseCon} con
   * @param {'up'|'down'} type
   */
  static insertCon(list, key, con, type = "down") {
    if (list.length == 0 || !key) {
      list.push(con);
      return;
    }
    let i = list.findIndex((_) => _.key == key);
    if (i >= 0) {
      list.splice(
        i +
          {
            up: 0,
            down: 1,
          }[type],
        0,
        con
      );
    } else {
      list.forEach((_) => {
        _.getChild().length > 0 &&
          BaseCon.insertCon(_.getChild(), key, con, type);
      });
    }
  }

  /**
   * 移动控件
   * @param {BaseCon[]} list
   * @param {BaseCon} con
   * @param {'up'|'down'} type
   */
  static moveCon(list, con, type) {
    let i = list.findIndex((_) => _.key == con.key);
    if (i >= 0) {
      switch (type) {
        case "up":
          if (i != 0) {
            list[i] = list[i - 1];
            list[i - 1] = con;
          }
          break;
        case "down":
          if (i != list.length - 1) {
            list[i] = list[i + 1];
            list[i + 1] = con;
          }
          break;
      }
    } else {
      list.forEach((_) => {
        BaseCon.moveCon(_.getChild(), con, type);
      });
    }
  }

  /** 获取唯一的key */
  static getKey() {
    return `key_${BaseCon.getHash()}`;
  }
  /** 获取唯一哈希值 */
  static getHash() {
    return nanoid();
  }
}
