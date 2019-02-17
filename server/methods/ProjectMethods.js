
import {check} from "meteor/check";
import Project from "../../imports/classes/Project";


/*********************************
 * METHODES DE LA COLLECTION USERS
 * les autres méthodes sont directement stockées dans la classe
 **************************/

Meteor.methods({
        /**
         * Methode permetant de vérifier si un nom d'utilisateur est déja pris
         * @param projectName
         * @returns {boolean}
         */
        projectNameAlreadyExists(projectName) {
            check(projectName, String)
            const project = Project.findOne({name: projectName})
            return !!project
        }
    }
)
