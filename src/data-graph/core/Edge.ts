
import { AnyNodeType } from '../index';

/**
 * This is how each individual `Edge` should look like.
 */
export interface EdgeInterface {
  /**
   * For an `Edge` this value should always be a string constant "Edge".
   */
  readonly role: string;

  /**
   * Indicates what sub-class of `Edge` class is this.
   * This should always be same as the name of the class that
   * extends the `Edge` base-class.
   * e.g. 'InputToProteinEdge' for `InputToProteinEdge` class.
   */
  readonly type: string;
  readonly source: AnyNodeType;
  readonly destination: AnyNodeType;
};

/**
 * This is used where a JS Object/Dictionary of Edges is stored/returned.
 * The key should be the ID of the Edge. The value should be the
 * actual instance of the Edge sub-class.
 */
export interface EdgeListInterface {
  [id: string]: EdgeInterface;
};

/**
 * This is where a named category of `EdgeListInterface` is stored/returned.
 * This is used when different sub-classes of Edge class stored in one place.
 */
export interface EdgeNestedListInterface {
  [id: string] : EdgeListInterface;
};

/**
 * The `Edge` base-class. This is not meant to be instantiated, but
 * to be extended for specific use-cases.
 * 
 * Edges are undirected. Each `Edge` keeps track of both `source` and 
 * `destination`. Later on each specific Edge class will implement their
 * own type-guarded `constructor` and getter methods.
 *
 * As an example a custom Edge class that connects an `InputNode` to
 * a `ProteinNode`, would have a `constructor` method that only accepts
 * these two specific sub-types of `Node` class.
 *
 * The same custom edge class will also provide `Edge.proteinNode` as
 * well as `Edge.inputNode`, which means the developer doesn't need to
 * remember and/or check for example if the `InputNode` was stored in
 * the `source` field or `destination`.
*/
export abstract class Edge implements EdgeInterface {
  readonly role: string = 'Edge';
  readonly type: string;
  readonly source: AnyNodeType;
  readonly destination: AnyNodeType;

  constructor(type: string, source: AnyNodeType, destination: AnyNodeType) {
    this.type = type;
    this.source = source;
    this.destination = destination;
  }

  public toString() : string {
    return `${this.type}\r\n`;
  }

  public toJSON() : object {
    let result: any = {};

    result.role = this.role.toString();
    result.type = this.type.toString();
    result.source = this.source.toJSON();
    result.destination = this.destination.toJSON();

    return result;
  }
}
