import Competences from '/lib/collections/Competences'
import CompetencesSubCategory from '/imports/classes/CompetencesSubCategory'
import CompetencesCategory from '/imports/classes/CompetencesCategory'
import Competence from '/imports/classes/Competence'
import CompetenceTableUnformatted from '/imports/Ressources/CompetenceTableUnformatted'


//remplissage initial de la collection des compétences des catégories et sous-categories  de compétences
if (Competences.find().count() === 0) {
    //on boucle sur le json extrait du tableau csv
    CompetenceTableUnformatted.forEach((unformattedLine, i)=>{
        //si la colone 3 est rensignée, c'est qu'on a a faire a une competence
        if(unformattedLine.column2){
            //on la crée, on l'hydrate avec les valeurs du tableau,
            let competence = new Competence
            competence.index=i
            competence.frenchName = unformattedLine.column3
            competence.category = unformattedLine.column0
            competence.subCategory = unformattedLine.column0+unformattedLine.column1
            //puis on la sauvegarde
            competence.save()
        }else if(unformattedLine.column1){ //sinon, et si la colone 2 est renseignée
            //c'est que c'est une sous catégorie, et on fait pareil
            let competencesSubCategory = new CompetencesSubCategory
            competencesSubCategory.index=unformattedLine.column0+unformattedLine.column1
            competencesSubCategory.category = unformattedLine.column0
            competencesSubCategory.frenchName = unformattedLine.column3
            //puis on la sauvegarde
            competencesSubCategory.save()
        }else{//enfin, si ca n'as pas matché aux deux précedente, c'est que c'est une categorie generale
            let competencesCategory = new CompetencesCategory
            competencesCategory.index=unformattedLine.column0
            competencesCategory.frenchName = unformattedLine.column3.toUpperCase()
            //puis on la sauvegarde
            competencesCategory.save()
        }
    })
}