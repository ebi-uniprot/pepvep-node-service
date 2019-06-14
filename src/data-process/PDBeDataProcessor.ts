import SearchResults from '../data-structure/SearchResults';
import StructuralSignificance from '../data-structure/significance/StructuralSignificance';
import Variation from '../data-structure/Variation';

export default abstract class PDBeDataProcessor {
  public static async process(results: SearchResults, data: any) {
    data.reduce((all, current) => {
      current.data
        .forEach((i) => {
          const accession = Object.keys(i)[0];
          const item = i[accession];

          if (Object.keys(item.all_structures).length) {
            all.push({ [accession]: item });
          }
        });

      return all;
    }, [])
    .forEach((pdbeResult) => {
      const accession = Object.keys(pdbeResult)[0];
      const pdbeDetails = pdbeResult[accession];

      results.getProteinsByAccession(accession)
        .forEach((protein) => {
          protein.getVariations()
            .forEach((variation) => {
              const structrualSignificance : StructuralSignificance
                = new StructuralSignificance();

              PDBeDataProcessor.collectStructuralSignificancesData(
                structrualSignificance,
                variation,
                pdbeDetails,
              );
            });
        });
    });
  }

  private static collectStructuralSignificancesData(
    structuralSignificance: StructuralSignificance,
    variation: Variation,
    pdbeDetails: any,
  ) {
    structuralSignificance.proteinLength = parseInt(pdbeDetails.length, 10);

    structuralSignificance.addAllStructures(pdbeDetails.all_structures);

    pdbeDetails.annotations.positions
      .forEach((annotation) => {
        if (variation.isInRange(annotation.position, annotation.position)) {
          structuralSignificance.addAnnotation(annotation);
        }
      });

    pdbeDetails.ligands.positions
      .forEach((ligand) => {
        if (variation.isInRange(ligand.position, ligand.position)) {
          structuralSignificance.addLigand(ligand);
        }
      });

    pdbeDetails.interactions.positions
      .forEach((interaction) => {
        if (variation.isInRange(interaction.position, interaction.position)) {
          structuralSignificance.addInteraction(interaction);
        }
      });

    pdbeDetails.structures.positions
      .forEach((structure) => {
        if (variation.isInRange(structure.position, structure.position)) {
          structuralSignificance.addStructure(structure);
        }
      });

    variation.addStructuralSignificance(structuralSignificance);
  }
}
