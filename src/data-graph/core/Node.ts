
import * as crypto from 'crypto';

import {
  EdgeInterface, EdgeListInterface, EdgeNestedListInterface
} from '../index';

/**
 * This is how each `Node` should look like, at bare minimums.
 */
export interface NodeInterface {
  /**
   * For a `Node` this value should always be a string constant "Node".
   */
  readonly role: string;

  /**
   * Indicates what sub-class of `Node` class is this.
   * This should always be as same as the name of the class that
   * extends the `Node` base-class.
   * e.g. 'InputNode' for `InputNode` class.
   */
  readonly type: string;

  /**
   * The `id` of the `Node` should be unique in the whole graph.
   * The id is initally passed when the instance of `Node` sub-class
   * is instantiated. This "raw" id is then passed to the constructor
   * of the `Node` base-class, in which it is internally passed to
   * the `idGenerator` method and the result is stored to be used later
   * as the unique id of that specific node, which can be retrieved
   * via this field.
   */
  readonly id: string;

  /**
   * Will generate a safe string to be used as the unique id of the
   * node. This will not generate a "unique" string, if the passed
   * raw id is not unique.
   */
  idGenerator(rawId: string) : string;

  /**
   * This will return all the different available 'sub-types' of
   * different edges that has been added so far to this instance
   * of node.
   *
   * This will NOT return the edges; It will only return the 'sub-types'
   * as an array of strings.
   */
  getEdgeTypes() : string[];

  /**
   * This will return all the edges of the specified 'sub-type'.
   * The result is an object with the `key` being the unique id
   * of the `Edge` instance and the `value` the actual instance
   * of the `Edge` sub-class.
   */
  getEdges(type: string) : EdgeListInterface | {};

  /**
   * This is used to add an edge between two nodes. Remember edges
   * are taken care of by the `Node` itself -- rather `Graph`.
   *
   * However, you are not supposed to directly call the `addEdge`
   * method on the `Node` instance. There is an `addEdge` method
   * available in the `Graph` instance with a different call signature.
   * That method will call the `addEdge` method on both `source` and
   * `destination` node.
   */
  addEdge(edge: EdgeInterface) : void;

  // TODO
  removeEdge(target: NodeInterface) : void;
  toString() : string;
  toJSON() : object;
}

/**
 * This defines an object/dictionary for storing/returing
 * multiple instances of `NodeInterface`. The 'key' of the
 * object is usually the `id` of the node, however this is
 * not inforced here. The 'value' will be an instance of a
 * sub-class of `Node` class.
 */
export interface NodeInterfaceList {
  [id: string] : NodeInterface;
}

/**
 * In some places instances of `Node` sub-classes are stored
 * while being grouped in their own categories, based on their
 * sub-type.
 *
 * This interface defines a contract to store/return such
 * collections. The `id` here is the name of sub-type which
 * should match with the name of the class that extends `Node`
 * base-class. e.g. 'ProteinNode' for `ProteinNode` class.
 */
export interface NodeInterfaceListsCollection {
  [id: string] : NodeInterfaceList;
}

/**
 * The `Node` base-class. This is not meant to be instantiated, but
 * to be extended for specific use-cases.
 */
export abstract class Node implements NodeInterface {
  readonly role: string = 'Node';
  readonly type: string;
  readonly id: string;

  /**
   * Edges are kept privately here. They are by their 'sub-type'.
   * An example of an `Edge` instance 'sub-type' would be 'InputToProteinEdge'
   * for `InputToProteinEdge` class.
   */
  private _edges: EdgeNestedListInterface = {};

  /**
   * To create an instance of a `Node` class. Note the `id`
   * should be already a 'unique' identifier. The `idGenerator`
   * method only creates a safe-string to be used as the `key`
   * in a JS object. It won't create a unqiue identifier.
   *
   * The `type` value should also be a valid 'sub-class' name
   * based on the available classes in the 'nodes' directory.
   * e.g. 'InputNode' for `InputNode` class. This value can be
   * extracted dynamically from the child-class itself.
   *
   * Note this is a base-class and should be kept generic for
   * all sub-classes. If you need to store extra information
   * and/or add extra functionality that is not useful for all
   * classes, create a sub-class in the 'nodes' directory.
   */
  constructor(id: string) {
    this.id = this.idGenerator(id);
    this.type = this.constructor.name;
  }

  idGenerator(rawId: string): string {
    return crypto.createHash('md5').update(rawId).digest('hex');
  };

  public getEdgeTypes() : string[] {
    return Object.keys(this._edges);
  }

  public getEdges(type: string) : EdgeListInterface | {} {
    if ('undefined' === typeof this._edges[type]) {
      return {};
    }

    return this._edges[type];
  }

  public addEdge(edge: EdgeInterface) : void {
    /**
     * As similar edges will be stored in categories based on
     * their sub-types, here we need to check if this is the
     * first time an `Edge` from a sub-type is being added to
     * a `Node` instance.
     *
     * If this is the first time adding an `Edge` of a sub-type
     * to the graph, then first create an empty object for the
     * whole category, so later on it can be used to store the
     * edges.
     */
    if ('undefined' === typeof this._edges[edge.destination.type]) {
      this._edges[edge.destination.type] = {};
    }

    /**
     * Since we don't want duplicated edges, here we check if this
     * edge has been already assigned to this node. The direct path
     * to an edge -- with complexity of O(1), would be its sub-type
     * and its unique ID.
     *
     * If the node already exists, do nothing and return.
     */
    if ('undefined' !== typeof this._edges[edge.destination.type][edge.destination.id]) {
      return;
    }

    /**
     * An `Edge` is being added to the `Node` instance and is stored
     * in its sub-type category, using its unique identifier.
     */
    this._edges[edge.destination.type][edge.destination.id] = edge;
  }

  public removeEdge(target: NodeInterface) : void {

  }

  public toString() : string {
    return `${this.type}\r\n`;
  }

  public toJSON() : object {
    let result: any = {};

    result.id = this.id.toString();
    result.role = this.role.toString();
    result.type = this.type.toString();

    return result;
  }
}
