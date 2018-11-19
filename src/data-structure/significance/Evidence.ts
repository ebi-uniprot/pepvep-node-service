
class Evidence {
  code: string; // should be Enum
  sourceName: string;
  sourceId: string;
  sourceUrl: string;
  sourceAlternativeUrl: string;

  constructor(
    code: string,
    sourceName: string,
    sourceId: string,
    sourceUrl: string,
    sourceAlternativeUrl: string,
  ) {
    this.code = code;
    this.sourceName = sourceName;
    this.sourceId = sourceId;
    this.sourceUrl = sourceUrl;
    this.sourceAlternativeUrl = sourceAlternativeUrl;
  }
}

export default Evidence;
