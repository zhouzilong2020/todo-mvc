import Template from "./template.js";
import View from "./view.js";
import Controller from "./controller.js";
// import Store from "./store.js";
import "./model.js";
import "./dateUtils.js";

const template = new Template();
const model = window.model;
// html模版，model数据挂载
const view = new View(template, model);
const controller = new Controller(model, view);
view.init();
view.update();

