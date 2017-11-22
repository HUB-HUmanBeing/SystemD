import Competences from '/lib/collections/Competences'
import Competence from '/imports/classes/Competence'
import CompetenceTableUnformatted from '/imports/Ressources/CompetenceTableUnformatted'
// Fixture data
if (Competences.find().count() === 0) {
    CompetenceTableUnformatted.forEach((unformattedLine, i)=>{
        if(unformattedLine.FIELD3){
            let competence = new Competence
            competence.code=i
            competence.frenchName = unformattedLine.FIELD4
            competence.category = unformattedLine.FIELD1
            competence.subCategory = unformattedLine.FIELD2
            competence.save()
        }
    })
}