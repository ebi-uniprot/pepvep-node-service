
import * as crypto from 'crypto';

import {
  AnyNodeType, AnyNodeListType,
  EdgeInterface, EdgeListInterface, EdgeNestedListInterface
} from '../index';

/**
 * This is how each `Node` should look like, at bare minimums.
 */
export interface NodeInterface {
  readonly role: string;
  readonly type: string;
  readonly id: string;
  idGenerator(source: string) : string;
  getEdgeTypes() : string[];
  getEdges(role: string) : EdgeListInterface | {};
  addEdge(edge: EdgeInterface) : void;
  removeEdge(target: AnyNodeType) : void;
  toString() : string;
  toJSON() : object;
}

/**
 * The `Node` base-class. This is not meant to be instantiated, but
 * to be extended for specific use-cases.
 */
export abstract class Node implements NodeInterface {
  readonly role: string = 'Node';
  readonly type: string;
  readonly id: string;
  private _edges: EdgeNestedListInterface = {};

  constructor(id: string, type: string) {
    this.type = type;
    this.id = this.idGenerator(id);
  }

  idGenerator(id: string): string {
    return crypto.createHash('md5').update(id).digest('hex');
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
    // create edge category if not created yet
    if ('undefined' === typeof this._edges[edge.destination.type]) {
      this._edges[edge.destination.type] = {};
    }
    // existing edge
    if ('undefined' !== typeof this._edges[edge.destination.type][edge.destination.id]) {
      return;
    }
    // store the edge
    this._edges[edge.destination.type][edge.destination.id] = edge;
  }

  public removeEdge(target: AnyNodeType) : void {

  }

  public toString() : string {
    return `${this.type}\r\n`;
  }

  public toJSON() : object {
    let result: any = {};

    result.id = this.id.toString();
    result.role = this.role.toString();
    result.type = this.type.toString();
    // result.

    return result;
  }
}
