import SearchResults from '../data-structure/SearchResults';
import StructuralSignificance from '../data-structure/significance/StructuralSignificance';
import Variation from '../data-structure/Variation';

export default abstract class PDBeDataProcessor {
  public static async process(results: SearchResults, data: any) {
    data.reduce((all, current) => {
      if (current.status === 404) {
        current.data = [];
      }

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
      Object.keys(pdbeResult)
        .forEach((accession) => {
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
      .filter(v => variation.threeLetterAminoAcidBase)
      .forEach((annotation) => {
        if (variation.threeLetterAminoAcidBase.toUpperCase() !== annotation.position_code) {
          return;
        }

        if (variation.isInRange(annotation.position, annotation.position)) {
          structuralSignificance.addAnnotation(annotation);
        }
      });

    pdbeDetails.ligands.positions
      .filter(v => variation.threeLetterAminoAcidBase)
      .forEach((ligand) => {
        if (variation.threeLetterAminoAcidBase.toUpperCase() !== ligand.position_code) {
          return;
        }

        if (variation.isInRange(ligand.position, ligand.position)) {
          structuralSignificance.addLigand(ligand);
        }
      });

    pdbeDetails.interactions.positions
      .filter(v => variation.threeLetterAminoAcidBase)
      .forEach((interaction) => {
        if (variation.threeLetterAminoAcidBase.toUpperCase() !== interaction.position_code) {
          return;
        }

        if (variation.isInRange(interaction.position, interaction.position)) {
          structuralSignificance.addInteraction(interaction);
        }
      });

    pdbeDetails.structures.positions
      .filter(v => variation.threeLetterAminoAcidBase)
      .forEach((structure) => {
        if (variation.threeLetterAminoAcidBase.toUpperCase() !== structure.position_code) {
          return;
        }

        if (variation.isInRange(structure.position, structure.position)) {
          structuralSignificance.addStructure(structure);
        }
      });

    if (structuralSignificance.getStructures().length === 0) {
      return;
    }

    variation.addStructuralSignificance(structuralSignificance);
  }
}
