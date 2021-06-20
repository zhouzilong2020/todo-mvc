import { qs, $delegate, $on } from "./helper.js";
import "./dateUtils.js";

// toggle finish 的父节点为icon container,该节点的父节点有该list的id
const _itemId = (element) =>
  parseInt(
    element.dataset.id ||
      element.parentNode.dataset.id ||
      element.parentNode.parentNode.dataset.id,
    10
  );

const _dueTime = (element) =>
  parseInt(element.dataset.due || element.parentNode.dataset.due, 10);

const _toggleId = (element) =>
  element.dataset.id ||
  element.parentNode.dataset.id ||
  element.parentNode.parentNode.dataset.id;

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class View {
  /**
   * @param {!Template} template 模版生成
   * @param {model} model 生成模版所需要的数据（数据驱动）
   */
  constructor(template, model) {
    this.template = template;
    this.model = model.data;

    this.$topToggle = qs(".top-bar .toggle");

    this.$leftCnt = qs(".top-bar .toggle .toggle-item .toggle-left");
    this.$doneCnt = qs(".top-bar .toggle .toggle-item .toggle-done");
    this.$totalCnt = qs(".top-bar .toggle .toggle-item .toggle-total");

    this.$inputBar = qs(".top-bar .input-bar");

    this.$todoContainer = qs(".todo-container");

    this.$tasksetList = qs(".taskset-list");
  }

  // 初始化绑定操作
  init() {
    console.log("view init");

    this.bindToggleTodoItem((id) => {
      this.toggleItemCompleted(id);
    });

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
    this.bindToggleTaskset((tasksetId) => {
      this.toggleTasksetActiveness(tasksetId);
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
        handler(_itemId(target));
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
    $on(
      this.$inputBar.querySelector(".text-input"),
      "keyup",
      (event) => {
        if (event.code == "Enter") {
          // console.log("enter");
          const date = this.$inputBar.querySelector(".date-selector");

          // console.log(date);
          date.click();
          // handler(_itemId(target));
        }
      },
      true
    );
    $on(
      this.$inputBar.querySelector("span"),
      "click",
      (event) => {
        // console.log("event");
        // handler(_itemId(target));
      },
      true
    );
  }

  /**
   * 绑定toggle todo
   * @param {function} handler handle function
   * @param {!boolean} verbose 打印事件冒泡和捕获信息
   */
  bindToggleTodoItem(handler, verbose) {
    $delegate(
      this.$todoContainer,
      [".todo-item .finish-icon", ".todo-item", ".todo-item p"],
      "click",
      ({ target }) => {
        handler(_itemId(target));
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
  toggleTasksetActiveness(id) {
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

  /**
   * 数据驱动更新函数！
   */
  update() {
    // 总任务数量统计信息
    var leftCnt = 0;
    var totalCnt = 0;
    // 获取全部的list
    const allTodoList = [];
    this.model.taskset.reduce((preVal, curVal) => {
      allTodoList.push(...curVal.todoList);
      curVal.leftCnt = 0;
      // 统计每一个任务集合中未完成的数量
      curVal.todoList.forEach((element) => {
        totalCnt++; // 所有任务数量+1
        if (!element.completed) {
          leftCnt++; // 剩余任务数量+1
          curVal.leftCnt++;
        }
      });
      this.$tasksetList.innerHTML += this.template.Taskset(curVal);
    }, 0);
    allTodoList.sort((a, b) => {
      return a.due - b.due;
    });

    allTodoList.reduce(
      (preVal, curVal) => {
        if (preVal.due.getDate() !== curVal.due.getDate()) {
          this.$todoContainer.innerHTML += this.template.TimeBar(curVal.due);
        }
        this.$todoContainer.innerHTML += this.template.Todo(curVal);
        return curVal;
      },
      { due: new Date(0) }
    );
    this.$leftCnt.innerHTML = leftCnt;
    this.$totalCnt.innerHTML = totalCnt;
    this.$doneCnt.innerHTML = totalCnt - leftCnt;
  }
}
