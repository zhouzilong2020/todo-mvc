/**
 * @typedef {!{id: number, completed: boolean, mes: string, due: Date,hide:boolean, tasksetId:number}}
 */
var Todo;

/**
 * @typedef {!{id: number,  name: string, active: number, todoList:TodoList}}
 */
var Taskset;

/**
 * @typedef {!Array<Todo>}
 */
var TodoList;

/**
 * @typedef {!Array<Taskset>}
 */
var TasksetList;

/**
 * Enum containing a known-empty record type, matching only empty records unlike Object.
 *
 * @enum {Object}
 */
const Empty = {
  Record: {},
};

/**
 * Empty ItemQuery type, based on the Empty @enum.
 *
 * @typedef {Empty}
 */
var EmptyItemQuery;

/**
 * Reference to the only EmptyItemQuery instance.
 *
 * @type {EmptyItemQuery}
 */
const emptyItemQuery = Empty.Record;

/**
 * @typedef {!({id: number}|{completed: boolean}|{hide: boolean}|{tasksetId: number}|EmptyItemQuery)}
 */
var ItemQuery;

/**
 * @typedef {!({id: number, mes: string}|{id: number, completed: boolean}|{id: number, hide: boolean}|{id: number, task: boolean})}
 */
var ItemUpdate;
