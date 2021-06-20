/**
 * @typedef {!{id: number, completed: boolean, name: string, due: Date, tasksetId:number}}
 */
 var Task;

/**
 * @typedef {!{id: number,  name: string, leftCnt: number}}
 */
 var Taskset;

/**
 * @typedef {!Array<Item>}
 */
 var TaskList;

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
 * @typedef {!({id: number}|{completed: boolean}|EmptyItemQuery)}
 */
  var ItemQuery;

/**
 * @typedef {!({id: number, title: string}|{id: number, completed: boolean})}
 */
  var ItemUpdate;
