
import {
  Node, NodeInterface,
  InputNode,
  ProteinNode
} from '../index';

export type AnyNodeType = Node | NodeInterface | InputNode | ProteinNode;

export type AnyNodeListType = {
  [id: string] : AnyNodeType;
};

export type AnyNodeNestedListType = {
  [id: string] : AnyNodeListType;
};
