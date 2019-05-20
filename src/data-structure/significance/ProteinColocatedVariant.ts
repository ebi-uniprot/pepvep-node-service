/**
 * To define an object that holds relevant details regarding
 * protein colocated variants of a variation.
 */
export default class ProteinColocatedVariant {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
