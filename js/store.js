import {
  Todo,
  TodoList,
  Taskset,
  TasksetList,
  ItemQuery,
  ItemUpdate,
  emptyItemQuery,
} from "./item.js";

const _todoList = (tasksetList) => {
  const todoList = [];
  let i = tasksetList.length;
  while (i--) {
    todoList.push(tasksetList[i].todoList);
  }
  return todoList;
};
export default class Store {
  /**
   * @param {!string} name localstorage的数据库的key
   * @param {function()} [callback] 回调函数
   */
  constructor(name, callback) {
    /**
     * @type {Storage}
     */
    const localStorage = window.localStorage;

    /**
     * 局部的一个缓存
     * @type {TasksetList}
     */
    let liveTestsetList;

    /**
     * 从localstorage中读取本地的TasksetList
     *
     * @returns {TasksetList} Current array of todos
     */
    this.getLocalStorage = () => {
      return liveTestsetList || JSON.parse(localStorage.getItem(name) || "[]");
    };

    /**
     * 写入本地storage中
     *
     * @param {TasksetList} testsetList 需要存储的tasksetList
     */
    this.setLocalStorage = (testsetList) => {
      localStorage.setItem(
        name,
        JSON.stringify((liveTestsetList = testsetList))
      );
    };

    if (callback) {
      callback();
    }
  }

  /**
   * 从数据库中找到符合query条件的 todo 数据，并作为回掉函数的入参
   *
   * @param {ItemQuery} query query条件
   * @param {function(TodoList)} callback 回掉函数
   *
   * @example
   * db.find({completed: true}, data => {
   *	 // data shall contain items whose completed properties are true
   * })
   */
  findTodo(query, callback) {
    const tasksetList = this.getLocalStorage();
    const todoList = _todoList(tasksetList);
    let k;
    callback(
      todoList.filter((todo) => {
        for (k in query) {
          if (query[k] !== todo[k]) {
            return false;
          }
        }
        return true;
      })
    );
  }

  /**
   * Update an item in the Store.
   *
   * @param {ItemUpdate} update Record with an id and a property to update
   * @param {function()} [callback] Called when partialRecord is applied
   */
  updateTodo(update, callback) {
    const id = update.id;
    const tasksetList = this.getLocalStorage();
    const todoList = _todoList(tasksetList);
    // taskset被变换的todo
    let tasksetChangedTodo = null;

    let i = tasksetList.length;
    let k;
    // 是否已经被更新，当更新发生后就不需要再循环判断了
    let updated = false;

    while (i--) {
      const todoList = tasksetList[i].todoList;
      let j = todoList.length;
      while (j--) {
        if (todoList[j].id === id) {
          tasksetChangedTodo = todoList[j];
          // 如果该todo任务集更换了，需要从原taskset删除，插入到新的taskset中
          if (update.hasOwnProperty("tasksetId")) {
            todoList.splice(j, 1);
          }
          // 更新字段
          for (k in update) {
            tasksetChangedTodo[k] = update[k];
          }
          updated = true;
          break;
        }
      }
      if (!!update) {
        break;
      }
    }

    // 将taskset跟新的todo插入到新任务集合中
    if (update.hasOwnProperty("tasksetId")) {
      while (i--) {
        if (tasksetList[i].id === tasksetChangedTodo.tasksetId) {
          tasksetList[i].todoList.push(tasksetChangedTodo);
          break;
        }
      }
    }

    this.setLocalStorage(tasksetList);

    if (callback) {
      callback();
    }
  }

  /**
   * Insert an todo into the Store.
   *
   * @param {Todo} todo Item to insert
   * @param {function()} [callback] Called when item is inserted
   */
  insertTodo(todo, callback) {
    const tasksetList = this.getLocalStorage();
    let i = tasksetList.length;
    while (i--) {
      if (tasksetList[i].id == todo.tasksetId) {
        tasksetList[i].todoList.push(todo);
      }
    }
    this.setLocalStorage(tasksetList);

    if (callback) {
      callback();
    }
  }

  /**
   * Remove items from the Store based on a query.
   *
   * @param {ItemQuery} query Query matching the items to remove
   * @param {function(TasksetList)|function()} [callback] Called when records matching query are removed
   */
  removeTodo(query, callback) {
    let k;

    const todos = this.getLocalStorage().filter((todo) => {
      for (k in query) {
        if (query[k] !== todo[k]) {
          return true;
        }
      }
      return false;
    });

    this.setLocalStorage(todos);

    if (callback) {
      callback(todos);
    }
  }

  /**
   * Count total, active, and completed todos.
   *
   * @param {function(number, number, number)} callback Called when the count is completed
   */
  count(callback) {
    this.find(emptyItemQuery, (data) => {
      const total = data.length;

      let i = total;
      let completed = 0;

      while (i--) {
        completed += data[i].completed;
      }
      callback(total, total - completed, completed);
    });
  }
}
