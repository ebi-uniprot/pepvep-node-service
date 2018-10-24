
import {
  EdgeInterface,
  AnyNodeType, AnyNodeListType, AnyNodeNestedListType
} from '../index';

/**
 * Our base class for a generic Graph. This can be used
 * on its own, but it meant to be extend with more useful
 * methods, to avoid code-duplication in the application.
 */
export default class Graph {
  /**
   * A graph is only concerend about the Nodes. All edges
   * are stored within their respective nodes and will keep
   * a bi-directional connection to both sides.
   *
   * The `this._nodes` object has two levels. The first is
   * the sub-type of each Node e.g. `InputNode` or `ProteinNode`.
   * Inside that -- which is an object by itself, Nodes of each
   * sub-type are stored with their `Node.id` as the key and
   * the actual Node instance as the value.
   */
  public _nodes: AnyNodeNestedListType = {};
  
  /**
   * Accepts and adds any instances of Node sub-types to the
   * graph. For `AnyNodeType` definition check `AnyNodeType.ts`
   */
  public addNode(node: AnyNodeType) : void {
    /**
     * As similar nodes will be stored in categories based on
     * their sub-types, here we need to check if this is the
     * firt time a `Node` from a sub-type is being added to the
     * graph.
     *
     * If this is the first time adding a `Node` of a sub-type
     * to the graph, then first create an empty object for the
     * whole category, so later on it can be used to store the
     * nodes.
     */
    if ('undefined' === typeof this._nodes[node.type]) {
      this._nodes[node.type] = {};
    }

    /**
     * Since we don't want duplicated nodes, here we check if
     * this node already exists in our graph. The direct path
     * to a node -- with complexity of O(1), would be its sub-type
     * and its unique ID.
     *
     * If the node already exists, do nothing and return.
     */
    if ('undefined' !== typeof this._nodes[node.type][node.id]) {
      return;
    }

    /**
     * A `Node` is being added to this `Graph` instance and is stored
     * in its sub-type category, using its unique identifier.
     */
    this._nodes[node.type][node.id] = node;
  }

  /**
   * This is not a "node search" functionlity for the graph. This
   * is how you can quickly access to a node -- O(1), and in order
   * to do that you need to know both sub-type of the node and its
   * unique ID.
   *
   * In case this is not what you are looking for, all the available
   * sub-types in the graph can be retreived via `getNodeTypes` method
   * and later that information can be used to get all nodes of a
   * sub-type via `getNodes` method. The unique ID of each node are
   * `key`s of the returned object, with actual node instances as the
   * value. 
   */
  public getNode(type: string, id: string) : AnyNodeType | undefined {
    return this._nodes[type][id];
  }

  /**
   * This will return all the available 'sub-type' which has been added
   * to the graph so far.
   */
  public getNodeTypes() : string[] {
    return Object.keys(this._nodes);
  }

  /**
   * This method will only return every node that exists in a sub-type
   * category e.g. `InputNode`. In order to get all nodes regardless of
   * their category, use `getAllNodes` method instead.
   */
  public getNodes(type: string) : AnyNodeListType | {} {
    /**
     * This method should always return a JS Object, because probably
     * the rest of the code is making that assumption as well. Therefore,
     * in case the requested sub-type doesn't exist in the graph, instead
     * of returning 'undefined', return an empty object, so the other side
     * of code doesn't have to make type checks all the time.
     */
    if ('undefined' === typeof this._nodes[type]) {
      return {};
    }

    /**
     * Returns all nodes of a 'sub-type' NOT all the available nodes in
     * the graph. If you need that functionality, used `getAllNodes` istead.
     */
    return this._nodes[type];
  }

  /**
   * This method will return all of the available nodes in the graph
   * regardless of their sub-type or relationship.
   */
  public getAllNodes() : AnyNodeListType | {} {
    return this.getNodeTypes()
      .map(nodeType => {
        const nodes = this.getNodes(nodeType);
        return Object.keys(nodes)
          .forEach(nodeId => nodes[nodeId]);
      });
  }

  /**
   * In order to create an edge between two nodes, we would need to
   * an instance of either the Edge base-class or one of its sub-types.
   *
   * An edge would contain references to both `source` and `destination`.
   * Here, in the graph level, we just pass the Edge instance to each
   * node. The `addEdge` method on the `Node` class will handle the logic
   * for adding the edge.
   *
   * Remember that graph doesn't store the edges; Edges are stored in
   * the nodes. The `addEdge` method here merely exists, so the developer
   * doesn't have to call the `addEdge` method on both nodes!
   */
  public addEdge(edge: EdgeInterface) : void {
    edge.source.addEdge(edge);
    edge.destination.addEdge(edge);
  }

  // TODO
  public removeEdge(source: AnyNodeType, destination: AnyNodeType) : void {
    source.removeEdge(destination);
    destination.removeEdge(source);
  }

  // TODO
  public toString() : string {
    let output: string = ``;

    this.getNodeTypes()
      .forEach(nodeType => {
        const nodes = this.getNodes(nodeType);
        Object.keys(nodes)
          .forEach(nodeId => {
            const node = nodes[nodeId];
            output += `\nNODE: ${node.toString()}`;

            node.getEdgeTypes()
              .forEach(edgeType => {
                const edges = node.getEdges(edgeType);
                Object.keys(edges)
                  .forEach(edgeId => {
                    const edge = edges[edgeId];
                    output += `EDGE: ${edge.destination.toString()}`;
                  });
              });
          });
      });

    return output;
  }

  // TODO
  public toJSON() : object {
    let result: any = {};

    this.getNodeTypes()
      .forEach(nodeType => {
        const nodes = this.getNodes(nodeType);
        Object.keys(nodes)
          .forEach(nodeId => {
            const node = nodes[nodeId];

          });
      });

    return result;
  }
}
