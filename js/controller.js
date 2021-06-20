import View from "./view.js";

export default class Controller {
  /**
   * @param  {!model} model A Store instance
   * @param  {!View} view A View instance
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindAddNewTask(this.addNewTask);
  }

  addNewTask() {}
}
