---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "vue3-dynamic-form"
  text: "vue3可编辑表单"
  tagline: 拖动式的生成动态表单，而且通过typescript面向对象开发的，能非常方便的扩展控件，内部ui使用的naive-ui库，所以能非常方便的定制主题。
  actions:
    - theme: brand
      text: Start
      link: /install
    - theme: alt
      text: 试一试
      link: https://vue3-dynamic-form.dumogu.top
---

#### 主题定制

因为内部控件都是用的 naive-ui，所以要定制组件的话用 naive-ui 的 n-config-provider 组件包裹 vue3EditableForm 组件就行了

具体实现请看 https://www.naiveui.com/zh-CN/light/docs/customize-theme

#### 控件定制

只要继承 BaseCon 类就能作为一个控件了，实现父类的一些方法就能自定义功能了

比如说我想自定义一个控件，它有一个输入框，还有一个按钮，按下这个按钮就打印这个输入框中的内容到控制面板。而且可以通过右侧的编辑栏编辑 input 输入框的空白占位符。

```js
export class A extends BaseCon {
  /** 控件类型 */
  static ConType = "A";
  /** 控件名字 */
  static ConName = "这是个控件";
  /** 单例对象 */
  static I = new A();

  input = "";
  placeholder = "";

  /**
   * 获取这个控件的实际 vnode
   */
  renderRaw() {
    return (
      <div>
        <input v-module={this.input} placeholder={this.placeholder} />
        <button
          onClick={() => {
            alert(this.input);
          }}
        />
      </div>
    );
  }

  /**
   * 获取右侧编辑栏的编辑项 vnode
   * 可以完全覆盖父类 getRight 返回的内容，也能扩展父类 getRight 返回的内容。
   * 这里就扩展一下
   * 因为是 ts 写的，所以在编辑器里面写的时候有完整的类型提示的。
   */
  getRight(op) {
    let _ = super.getRight(op);
    _.find((_) => _.key == "com")?.childs.push(
      ...[
        {
          label: "空白占位符",
          editor: <input v-module={this.placeholder} />,
        },
      ]
    );
    return _;
  }
}
```

然后把 A 通过 extendCons 属性传给 vue3EditableForm 组件，就能在组件左侧的扩展类型里面看到这个控件了。

###### 除了上述的 renderRaw 和 getRight 外还有很多可覆盖的方法，BaseCon 具体做的事情如下

- 渲染控件 vnode

  render -> renderMiddleware -> renderRaw

  先调用 render 方法，此方法负责在控件 vnode 外包装一些操作按钮，比如上移下移删除这些按钮，当然这些按钮也是可自定义的，只需实现 getHandler 方法就行了，然后 render 方法会调用 renderMiddleware 方法这个方法作为渲染中间件调用，它默认会直接调用 renderRaw 方法。像 BaseForm 类就是通过这个方法包装了一层 NFormItem。而那些布局控件就是重写了 render 方法。

- 渲染右侧编辑栏

  renderRight -> getRight

  先调用 renderRight 方法，renderRight 方法调用 getRight 返回的配置生成 vnode 给右侧编辑栏使用。
