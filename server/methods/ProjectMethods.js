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
    },
    createProject(projectName, brunchOfKeys, firstMember) {
        check(projectName, String)
        const project = Project.findOne({name: projectName})
        check(!!project, false)
        check(brunchOfKeys, {
            asymPublicKey: String,
            symEnc_AsymPrivateKey: String,
            hashedSymKey: String,
            hashedAdminPassword:String
        })
        check(firstMember, {
            memberId : String,
            role: String,
            symEnc_userId: String,
            symEnc_username: String,
            symEnc_joinAtTs: String,
            userSignature: String
        })

        let newProject = new Project()
        newProject.name = projectName
        console.log()
        newProject.public.asymPublicKey = brunchOfKeys.asymPublicKey
        newProject.private.symEnc_AsymPrivateKey = brunchOfKeys.symEnc_AsymPrivateKey
        newProject.private.hashedSymKey = brunchOfKeys.hashedSymKey
        newProject.private.hashedAdminPassword = brunchOfKeys.hashedAdminPassword

        newProject.private.members.push(firstMember)

        return {
            projectId : newProject.save(),
            project: newProject
        }
    }

})
