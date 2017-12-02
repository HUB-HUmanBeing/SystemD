
import CollaboratorAdvert from "/imports/classes/CollaboratorAdvert";
import  Project from '/imports/classes/Project'

/*********************
 * Methodes des annonces de recherche de collaborateurs
 */
CollaboratorAdvert.extend({
    meteorMethods: {
        createAdvert() {
            let project = Project.findOne({_id : this.project_id})
            check(project.isAdmin(Meteor.userId()), true)
            console.log(this)
            return this.save()
        }
    }
})