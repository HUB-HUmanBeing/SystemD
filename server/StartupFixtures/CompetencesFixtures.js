import Competences from '/lib/collections/Competences'
import CompetencesSubCategory from '/imports/classes/CompetencesSubCategory'
import CompetencesCategory from '/imports/classes/CompetencesCategory'
import Competence from '/imports/classes/Competence'
import CompetenceTableUnformatted from '/imports/Ressources/CompetenceTableUnformatted'
// Fixture data
if (Competences.find().count() === 0) {
    CompetenceTableUnformatted.forEach((unformattedLine, i)=>{
        if(unformattedLine.FIELD3){
            let competence = new Competence
            competence.index=i
            competence.frenchName = unformattedLine.FIELD4
            competence.category = unformattedLine.FIELD1
            competence.subCategory = unformattedLine.FIELD2
            competence.save()
        }else if(unformattedLine.FIELD2){
            let competencesSubCategory = new CompetencesSubCategory
            competencesSubCategory.index=unformattedLine.FIELD2
            competencesSubCategory.category = unformattedLine.FIELD1
            competencesSubCategory.frenchName = unformattedLine.FIELD4
            competencesSubCategory.save()
        }else{
            let competencesCategory = new CompetencesCategory
            competencesCategory.index=unformattedLine.FIELD1
            competencesCategory.frenchName = unformattedLine.FIELD4
            competencesCategory.save()
        }
    })
}