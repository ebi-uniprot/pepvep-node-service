
import {
  GeneNode,
  ChromosomeNode,
  Edge
} from '../index';

/**
 * To express the relationship between a `GeneNode` and a
 * `ChromosomeNode`.
 */
 export default class GeneToChromosomeEdge extends Edge {
  readonly start: number;
  readonly end: number;

  constructor(geneNode: GeneNode, chromosomeNode: ChromosomeNode, start: number, end: number) {
    super('GeneToChromosomeEdge', geneNode, chromosomeNode);
    this.start = start;
    this.end = end;
  }

  get geneNode() : GeneNode {
    return <GeneNode>this.source;
  }

  get chromosomeNode() : ChromosomeNode {
    return <ChromosomeNode>this.destination;
  }
 }
