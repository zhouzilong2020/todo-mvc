import Template from "./template.js";
import View from "./view.js";
import Controller from "./controller.js";
import Store from "./store.js";
import "./model.js";
import "./dateUtils.js";
import { $on } from "./helper.js";

const template = new Template();
const model = window.model;
const store = new Store("TODO-MVC");
// TODO view和model解耦
const view = new View(template, model);

// controller
const controller = new Controller(store, view);
controller.init();
