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
import {
  NButton,
  NFlex,
  NGrid,
  NGridItem,
  NIcon,
  NInputNumber,
} from "naive-ui";
import { RemoveCircle } from "@vicons/ionicons5";

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
  };

  setCol(span?: number, offset?: number) {
    typeof span != "undefined" && (this.colProps.span = span);
    typeof offset != "undefined" && (this.colProps.offset = offset);
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
      <NGridItem
        class={[
          formData ? "" : "controller",
          "controls__ grid-col",
          activateCon?.key == this.key ? "on" : "border",
          formData ? "form-render" : "",
        ].join(" ")}
        key={this.renderKey}
        span={this.colProps.span}
        offset={this.colProps.offset}
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
        <div
          class="content"
          onClick={(e: Event) => {
            e.stopPropagation();
            ctx.emit("activateConF", this);
          }}
        >
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
      </NGridItem>
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

  props = {
    cols: 24,
    xGap: 0,
    yGap: 0,
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
      <NGrid
        class={[
          "controls__ grid",
          op.activateCon?.key == this.key ? "" : "border",
          op.formData ? "form-render" : "",
        ].join(" ")}
        cols={this.props.cols}
        xGap={this.props.xGap}
        yGap={this.props.yGap}
      >
        {this.list.map((_) => {
          return _.render({
            ...op,
            parent: this,
          });
        })}
      </NGrid>
    );
  }

  getRight(op: IConRightRenderOp) {
    let _ = super.getRight(op);
    let add: IConRightReterItemOp["childs"] = [
      {
        label: "栅格数量",
        editor: <NInputNumber v-model:value={this.props.cols} min={0} />,
      },
      {
        label: "横向间隔",
        editor: <NInputNumber v-model:value={this.props.xGap} min={0} />,
      },
      {
        label: "纵向间隔",
        editor: <NInputNumber v-model:value={this.props.yGap} min={0} />,
      },
    ];
    let push: IConRightReterItemOp["childs"] = [
      {
        label: "当前栅格列",
      },
      {
        editor: (
          <NFlex vertical>
            {this.list.map((_, i) => {
              return (
                <NGrid xGap={5}>
                  <NGridItem span={6}>栅格{i + 1}</NGridItem>
                  <NGridItem span={18}>
                    <NFlex wrap={false}>
                      <NInputNumber
                        v-model:value={_.colProps.span}
                        min={1}
                        max={24}
                      />
                      <NButton
                        quaternary
                        circle
                        disabled={this.list.length <= 1}
                        onClick={() => {
                          this.list.splice(i, 1);
                        }}
                      >
                        <NIcon size={20}>
                          <RemoveCircle />
                        </NIcon>
                      </NButton>
                    </NFlex>
                  </NGridItem>
                </NGrid>
              );
            })}
            <NButton
              size="small"
              type="primary"
              onClick={() => {
                this.list.push(new GridCol().setCol(12));
              }}
            >
              增加栅格
            </NButton>
          </NFlex>
        ),
      },
    ];
    _.find((_) => _.key == "com")?.childs!.unshift(...add);
    _.find((_) => _.key == "com")?.childs!.push(...push);
    return _;
  }
}
