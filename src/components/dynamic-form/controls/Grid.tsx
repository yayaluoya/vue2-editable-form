import DraggableCon from "../com/draggable.vue";
import "../style/grid.scss";
import Item from "../com/item.vue";
import {
  BaseCon,
  type IConRenderOp,
  type IConRightRenderOp,
  type IConRightReterItemOp,
} from "./BaseCon";
import { NonForm } from "./NonForm";

/**
 * 栅格列
 */
class GridCol extends NonForm {
  /** 控件类型 */
  static ConType = "GridCol";
  /** 控件名字 */
  static ConName = "栅格列";

  towable = false;

  colProps = {
    /** 栅格占据的列数 */
    span: 24,
    /** 栅格左侧的间隔格数 */
    offset: 0,
    /** 栅格向右移动格数 */
    push: 0,
    /** 栅格向左移动格数 */
    pull: 0,
  };

  setCol(span?: number, offset?: number, push?: number, pull?: number) {
    typeof span != "undefined" && (this.colProps.span = span);
    typeof offset != "undefined" && (this.colProps.offset = offset);
    typeof push != "undefined" && (this.colProps.push = push);
    typeof pull != "undefined" && (this.colProps.pull = pull);
    return this;
  }

  render({
    ctx,
    formConfig,
    cons,
    formData,
    activateCon,
    parent,
  }: IConRenderOp) {
    if (formData && this.hide) {
      return undefined;
    }
    return (
      <el-col
        class={[
          formData ? "" : "controller",
          "controls__ grid-col",
          activateCon?.key == this.key ? "on" : "border",
          formData ? "form-render" : "",
        ].join(" ")}
        key={this.renderKey}
        span={this.colProps.span}
        offset={this.colProps.offset}
        push={this.colProps.push}
        pull={this.colProps.pull}
        onClick={(e: Event) => {
          e.stopPropagation();
          ctx.emit("activateConF", this);
        }}
      >
        {activateCon?.key == this.key
          ? [
              <div class="con-name">
                <span>{this.conName}</span>
                {this.hide ? (
                  <el-icon style="margin-left: 2px">
                    <Hide />
                  </el-icon>
                ) : null}
              </div>,
              <div class="handler-button">
                <el-icon
                  title="选择父组件"
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    ctx.emit("activateConF", parent);
                  }}
                >
                  <Back />
                </el-icon>
                {this.getHandler(arguments[0])}
              </div>,
            ]
          : null}
        <div class="content">
          {formData ? (
            this.childs.map((con) => {
              return (
                <Item
                  key={con.key}
                  parent={this as BaseCon}
                  formConfig={formConfig}
                  formData={formData}
                  cons={cons}
                  con={con}
                  formRender
                />
              );
            })
          ) : (
            <DraggableCon
              parent={this as BaseCon}
              cons={this.childs}
              formConfig={formConfig}
              activateCon={activateCon}
              onUpdate:cons={(_) => {
                this.childs = _;
              }}
              onUpdate:activateCon={(_) => {
                ctx.emit("activateConF", _);
              }}
              style={
                this.childs.length <= 0
                  ? "min-height: 50px;"
                  : "min-height: 20px;"
              }
            />
          )}
        </div>
      </el-col>
    );
  }

  getHandler({ parent }: IConRenderOp & { parent: Grid }) {
    return [
      <el-icon
        title="上移组件"
        onClick={(e: Event) => {
          e.stopPropagation();
          parent.moveChild(this, "up");
        }}
      >
        <Top />
      </el-icon>,
      <el-icon
        title="下移组件"
        onClick={(e: Event) => {
          e.stopPropagation();
          parent.moveChild(this, "down");
        }}
      >
        <Bottom />
      </el-icon>,
      <el-icon
        title="删除组件"
        onClick={(e: Event) => {
          e.stopPropagation();
          parent.removeChild(this);
        }}
      >
        <DeleteFilled />
      </el-icon>,
    ];
  }

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    let add: IConRightReterItemOp["childs"] = [
      {
        label: "占据列数量",
        editor: (
          <el-input-number
            size="small"
            model-value={this.colProps.span}
            min={1}
            max={24}
            onChange={(_: any) => {
              this.colProps.span = _;
            }}
          />
        ),
      },
      {
        label: "栅格左侧间隔",
        editor: (
          <el-input-number
            size="small"
            model-value={this.colProps.offset}
            min={0}
            max={24}
            onChange={(_: any) => {
              this.colProps.offset = _;
            }}
          />
        ),
      },
      {
        label: "右移格数",
        editor: (
          <el-input-number
            size="small"
            model-value={this.colProps.push}
            min={0}
            max={24}
            onChange={(_: any) => {
              this.colProps.push = _;
            }}
          />
        ),
      },
      {
        label: "左移格数",
        editor: (
          <el-input-number
            size="small"
            model-value={this.colProps.pull}
            min={0}
            max={24}
            onChange={(_: any) => {
              this.colProps.pull = _;
            }}
          />
        ),
      },
    ];
    _.find((_) => _.key == "com")?.childs!.unshift(...add);
    return _;
  }
}

/**
 * 栅格
 */
export class Grid extends NonForm {
  /** 控件类型 */
  static ConType = "Grid";
  /** 控件名字 */
  static ConName = "栅格";
  /** 单例对象 */
  static I = new Grid();

  rowProps = {
    /** 栅格间隔 */
    gutter: 0,
    /** flex 布局下的水平排列方式 */
    justify: "start",
    /** flex 布局下的垂直排列方式 */
    align: "top",
  };

  list = [new GridCol().setCol(12), new GridCol().setCol(12)];

  getChild() {
    return this.list;
  }

  initConfig(configs: any, toCons: any) {
    super.initConfig(configs, toCons);
    this.list = toCons(this.list, [GridCol]);
    return this;
  }

  /**
   * @param con
   * @param type
   */
  moveChild(con: GridCol, type: "up" | "down") {
    BaseCon.moveCon(this.list, con, type);
  }
  /**
   * @param con
   */
  removeChild(con: GridCol) {
    let i = this.list.findIndex((_) => _.key == con.key);
    if (i >= 0) {
      this.list.splice(i, 1);
    }
  }

  renderRaw(op: IConRenderOp) {
    return (
      <el-row
        class={[
          "controls__ grid",
          op.activateCon?.key == this.key ? "" : "border",
          op.formData ? "form-render" : "",
        ].join(" ")}
        gutter={this.rowProps.gutter}
        justify={this.rowProps.justify}
        align={this.rowProps.align}
      >
        {this.list.map((_) => {
          return _.render({
            ...op,
            parent: this,
          });
        })}
      </el-row>
    );
  }

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    let add: IConRightReterItemOp["childs"] = [
      {
        label: "栅格间隔",
        editor: (
          <el-input-number
            size="small"
            model-value={this.rowProps.gutter}
            min={0}
            onChange={(_: any) => {
              this.rowProps.gutter = _;
            }}
          />
        ),
      },
      {
        label: "水平排列方式",
        editor: (
          <el-select
            model-value={this.rowProps.justify}
            size="small"
            onChange={(_: any) => {
              this.rowProps.justify = _;
            }}
            placeholder="请选择"
          >
            <el-option label="start" value="start" />
            <el-option label="end" value="end" />
            <el-option label="center" value="center" />
            <el-option label="space-around" value="space-around" />
            <el-option label="space-between" value="space-between" />
            <el-option label="space-evenly" value="space-evenly" />
          </el-select>
        ),
      },
      {
        label: "垂直排列方式",
        editor: (
          <el-select
            model-value={this.rowProps.align}
            size="small"
            onChange={(_: any) => {
              this.rowProps.align = _;
            }}
            placeholder="请选择"
          >
            <el-option label="top" value="top" />
            <el-option label="middle" value="middle" />
            <el-option label="bottom" value="bottom" />
          </el-select>
        ),
      },
    ];
    let push: IConRightReterItemOp["childs"] = [
      {
        label: "当前栅格列：",
      },
      {
        editor: (
          <div class="controls__ grid-right">
            {this.list.map((_, i) => {
              return (
                <div class="i">
                  <span>栅格{i + 1}</span>
                  <div>
                    <el-input-number
                      size="small"
                      model-value={_.colProps.span}
                      min={1}
                      max={24}
                      onChange={(__: any) => {
                        _.colProps.span = __;
                      }}
                    />
                    <el-icon
                      onClick={() => {
                        this.list.splice(i, 1);
                      }}
                    >
                      <CircleClose />
                    </el-icon>
                  </div>
                </div>
              );
            })}
            <el-button
              plain
              size="small"
              type="primary"
              onClick={() => {
                this.list.push(new GridCol().setCol(12));
              }}
            >
              增加栅格
            </el-button>
          </div>
        ),
      },
    ];
    _.find((_) => _.key == "com")?.childs!.unshift(...add);
    _.find((_) => _.key == "com")?.childs!.push(...push);
    return _;
  }
}
