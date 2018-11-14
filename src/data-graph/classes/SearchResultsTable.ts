
import {
  SearchResultsGraph,
  InputNode
} from '../index';

export default class SearchResultsTable {
  readonly graph: SearchResultsGraph;
  private _groups = [];

  constructor(graph: SearchResultsGraph) {
    this.graph = graph;
  }

  public generateDataObject() {
    this.generateInputGroups();
  }

  private generateInputGroups() {
    this._groups = Object.values(this.graph.getNodes('InputNode'))
      .map(inputNode => this.createInputGroup(<InputNode>inputNode))
  }

  private createInputGroup(inputNode: InputNode) {
    return {
      key: inputNode.id,
      input: inputNode.raw,
      rows: this.generateRows(inputNode)
    }
  }

  private generateRows(inputNode: InputNode) {
    return Object.values(this.graph.getNodes('InputNode'))
      .map(inputNode => {
        // get variation nodes first

        // loop through each of them

        // then create 
        // return this.generateRows()
      });
  }

  private generateSingleRow() {

  }
}
