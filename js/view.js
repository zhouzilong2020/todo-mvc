import { qs, $delegate, $on } from "./helper.js";
import "./dateUtils.js";
import { TasksetList, TodoList } from "./item.js";

// toggle finish 的父节点为icon container,该节点的父节点有该list的id
const _itemId = (element) =>
  parseInt(
    element.dataset.id ||
      element.parentNode.dataset.id ||
      element.parentNode.parentNode.dataset.id,
    10
  );

const _active = (element) =>
  element.classList.contains("active") ||
  element.parentNode.classList.contains("active");

const _complete = (element) =>
  element.classList.contains("completed") ||
  element.parentNode.classList.contains("completed");

const _dueTime = (element) =>
  parseInt(element.dataset.due || element.parentNode.dataset.due, 10);

const _toggleId = (element) =>
  element.dataset.id ||
  element.parentNode.dataset.id ||
  element.parentNode.parentNode.dataset.id;

const _activeTasksetId = (eleList) => {
  let i = eleList.length;
  const result = [];
  while (i--) {
    if (eleList[i].classList.contains("active")) {
      result.push(eleList[i].dataset.id);
    }
  }
  return result;
};

export default class View {
  /**
   * @param {!Template} template 模版生成
   */
  constructor(template) {
    this.template = template;

    this.$topToggle = qs(".top-bar .toggle");

    this.$leftCnt = qs(".top-bar .toggle .toggle-item .toggle-left");
    this.$doneCnt = qs(".top-bar .toggle .toggle-item .toggle-done");
    this.$totalCnt = qs(".top-bar .toggle .toggle-item .toggle-total");

    this.$inputBar = qs(".top-bar .input-bar");
    this.$input = qs(".top-bar .input-bar .text-input");

    this.$todoContainer = qs(".todo-container");

    this.$tasksetList = qs(".taskset-list");

    var hasRenderedTaskset = false;
  }

  // 初始化绑定操作
  init() {
    this.bindToggleTimebar((leftDay) => {
      const todoList = this.$todoContainer.querySelectorAll(".todo-item");
      const changeVisibilityIdList = [];
      for (var i = 0, len = todoList.length; i < len; i++) {
        var itemLeftDay = _dueTime(todoList[i]);
        console.log(itemLeftDay, leftDay);
        if (leftDay === itemLeftDay) {
          // 将该item的display 设置为none
          changeVisibilityIdList.push(todoList[i]);
        }
      }
      console.log(changeVisibilityIdList);
      this.setTodoItemVisibility(changeVisibilityIdList);
    });

    this.bindToggleTopbar((toggleId) => {
      this.toggleTopBar(toggleId);
    });

    // TODO 怎么存储？
    this.bindAddNewTodo(() => {});

    // 如何添加截止日期？
    // const date = this.$inputBar.querySelector(".date-selector");
    // console.log(date.click());
  }

  /**
   * 绑定顶部toggle
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindToggleTopbar(handler, verbose) {
    $delegate(
      this.$topToggle,
      [".toggle-item", ".toggle-item span", ".toggle-item p"],
      "click",
      ({ target }) => {
        handler(_toggleId(target));
      },
      true,
      !!verbose
    );
  }

  /**
   * 绑定任务集toggle
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindToggleTaskset(handler, verbose) {
    $delegate(
      this.$tasksetList,
      [".taskset-item", ".taskset-item span", ".taskset-item p"],
      "click",
      ({ target }) => {
        // 当前状态取反为下一个状态
        handler(_itemId(target), !_active(target));
      },
      true,
      !!verbose
    );
  }

  /**
   * TODO 绑定新添加一个todo
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindAddNewTodo(handler, verbose) {
    const eventHandler = (event) => {
      if (event.code == "Enter") {
        const mes = this.$input.value;
        const curTaskset = _activeTasksetId(this.$tasksetList.children);

        if (curTaskset.length > 1 || curTaskset.length <= 0) {
          // 仅能有一个在这里！
          alert(
            "A task can only be added to one taskset, please toggle one taskset and try again!"
          );
          return;
        } else if (curTaskset.length === 1) {
          handler(mes, curTaskset[0]);
        }
      }
    };
    $on(this.$inputBar.querySelector("span"), "click", eventHandler, true);
    $on(this.$input, "keyup", eventHandler, true);
  }

  /**
   * 绑定toggle todo
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindToggleItemComplete(handler, verbose) {
    $delegate(
      this.$todoContainer,
      [".todo-item .finish-icon", ".todo-item", ".todo-item p"],
      "click",
      ({ target }) => {
        // 当前complete状态取反为下一个状态
        handler(_itemId(target), !_complete(target));
      },
      true,
      !!verbose
    );
  }

  /**
   * 绑定toggle 时间轴，隐藏或者展示中间的task
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindToggleTimebar(handler, verbose) {
    $delegate(
      this.$todoContainer,
      [".time-bar", ".time-bar span", ".time-bar div"],
      "click",
      ({ target }) => {
        handler(_itemId(target));
      },
      true,
      !!verbose
    );
  }

  /**
   * toggle顶部的筛选框
   *
   * @param {!number} id toggle-item ID
   */
  toggleTopBar(id) {
    console.log(id);
    const toggleList = this.$topToggle.children;
    let i = toggleList.length;
    while (i--) {
      if (toggleList[i].dataset.id == id) {
        if (!toggleList[i].classList.contains("active")) {
          toggleList[i].classList.add("active");
        }
      } else {
        if (toggleList[i].classList.contains("active")) {
          toggleList[i].classList.remove("active");
        }
      }
    }
  }

  /**
   * toggle任务集合是否被选中
   *
   * @param {!number} id Taskset ID
   */
  toggleTaskset(id) {
    const tasksetItem = this.$tasksetList.querySelector(`[data-id="${id}"]`);

    if (tasksetItem.classList.contains("active")) {
      tasksetItem.classList.remove("active");
    } else {
      tasksetItem.classList.add("active");
    }
  }

  /**
   * 将剩余日期等于这个数值的全部隐藏
   *
   * @param {HTMLElement} eleList
   */
  setTodoItemVisibility(eleList) {
    let i = eleList.length;
    while (i--) {
      if (eleList[i].classList.contains("hide")) {
        eleList[i].classList.remove("hide");
      } else {
        eleList[i].classList.add("hide");
      }
    }
  }

  /**
   * toggle task的完成状态
   *
   * @param {!number} id Item ID
   */
  toggleItemCompleted(id) {
    const listItem = this.$todoContainer.querySelector(`[data-id="${id}"]`);
    if (!listItem) {
      return;
    }
    if (listItem.classList.contains("completed")) {
      listItem.classList.remove("completed");
    } else {
      listItem.classList.add("completed");
    }
  }

  clearNewTodo() {
    this.$input.value = "";
  }

  /**
   * 根据传入的TodoList 渲染页面
   *
   * @param {TodoList} todoList
   */
  renderItem(todoList) {
    // TODO 增量式更新
    this.$todoContainer.innerHTML = "";
    // TODO 按照不同顺序排列
    // TODO 按照优先级排列
    // 排序规则
    //  1. due 少的优先
    //  2. 未完成优先
    //  3. 后添加的优先
    todoList.sort((a, b) => {
      return (
        (!b.completed && a.completed) || // b已完成，a未完成，b优先级高
        a.due - b.due || // b剩余日期小于a
        b.id - a.id // b添加于a之后
      );
    });

    todoList.reduce(
      (pre, cur) => {
        // 反序列化
        cur.due = new Date(cur.due);
        if (pre.due.getDate() !== cur.due.getDate()) {
          this.$todoContainer.innerHTML += this.template.TimeBar(cur.due);
        }
        this.$todoContainer.innerHTML += this.template.Todo(cur);
        return cur;
      },
      { due: new Date(0) }
    );
  }

  /**
   * 根据传入的TasksetList 渲染页面, 仅在首次渲染时候有效！
   *
   * @param {TasksetList} tasksetList
   */
  renderTaskset(tasksetList) {
    tasksetList.reduce((pre, cur) => {
      cur.leftCnt = 0;
      // 统计每一个任务集合中未完成的数量
      cur.todoList.forEach((element) => {
        if (!!!element.completed) {
          cur.leftCnt++;
        }
      });
      this.$tasksetList.innerHTML += this.template.Taskset(cur);
    }, 0);
  }

  setStatistic(total, left, done) {
    this.$leftCnt.innerText = left;
    this.$doneCnt.innerText = done;
    this.$totalCnt.innerText = total;
  }
}
