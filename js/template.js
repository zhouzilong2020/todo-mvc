import "./item.js";
export default class Template {
  /**
   * add a new day bar to the list
   * @param {Date} dueDay
   * @returns
   */
  TimeBar(dueDay) {
    return `<div class="time-bar"  data-id="${dueDay.LeftDay()}">
          <span class="date">${dueDay.Format(
            "yyyy/MM/dd"
          )} ${dueDay.GetDay()}</span>
          <div class="left-day-cnt">
            <span class="num">${dueDay.LeftDay()}</span>
            <span class="text">d left</span>
          </div>
        </div>`;
  }

  /**
   * add a new to do task to the list
   * @param {Taskset} taskset
   * @returns
   */
  Taskset(taskset) {
    return `<div data-id="${taskset.id}" class="taskset-item${
      taskset.active ? " active" : ""
    }">
    <span class="material-icons top-icon">class</span>
    <p class="taskset-name">${taskset.name}</p>
    <p class="task-cnt">${taskset.leftCnt}</p>
    <span class="icon">tasks</span>
  </div>`;
  }

  /**
   * add a new day bar to the list
   * @param {Task} task
   * @returns
   */
  Task(task) {
    return `<div data-id="${
      task.id
    }"  data-due="${task.due.LeftDay()}" class="todo-item ${
      task.completed ? " completed" : ""
    }">
  <div class="icon-container"><div class="finish-icon"></div></div>
  <p>${task.mes}</p>
</div>`;
  }
}
