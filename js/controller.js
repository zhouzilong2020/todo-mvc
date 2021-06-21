import View from "./view.js";
import Store from "./store.js";
import { emptyItemQuery } from "./item.js";

export default class Controller {
  /**
   * @param  {!Store} store A Store instance
   * @param  {!View} view A View instance
   */
  constructor(store, view) {
    this.store = store;
    this.view = view;

    const curActiveTasksetId = [];
    const curToggleBtn = [];

    this.view.bindAddNewTodo(this.addItem.bind(this));

  }

  init() {
    this.view.init();
    this.store.init(this.view.renderTaskset.bind(this.view));
    this._filter();
  }

  toggleItem() {
    (id) => {
      this.toggleItemCompleted(id);
    };
  }

  /**
   * 插入一条新的todo
   *
   * @param {!string} mes todo的内容
   * @param {!number} tasksetId todo所属的taskset
   * @param {!Date} due todo的截止日期
   */
  addItem(mes, tasksetId, due) {
    if (!!!due) {
      due = new Date(Date.now() + Math.random() * 1000000 + 1000000);
    }
    this.store.insert(
      {
        id: Date.now(),
        mes,
        due,
        tasksetId,
        completed: false,
        hide: false,
      },
      () => {
        this.view.clearNewTodo();
        this._filter();
      }
    );
  }

  /**
   * 删除一条记录
   *
   * @param {!number} id
   */
  removeItem(id) {
    this.store.remove({ id }, () => {
      this.view.removeItem(id);
    });
  }

  /**
   * 更新item的完成情况
   *
   * @param {!number} id
   * @param {!boolean} completed
   */
  toggleCompleted(id, completed) {
    this.store.update({ id, completed }, () => {
      // TODO 看看这个会不会出错？
      this.view.toggleItemCompleted(id);
    });
  }

  /**
   * 根据当前页面状态重新查找数据进行渲染
   * TODO 增量式渲染
   */
  _filter() {
    const route = this._activeRoute;

    // if (
    //   force ||
    //   this._lastActiveRoute !== "" ||
    //   this._lastActiveRoute !== route
    // ) {
    this.store.find(emptyItemQuery, this.view.renderItem.bind(this.view));
  }
}
