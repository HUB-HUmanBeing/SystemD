import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import cryptoServer from "../../../imports/cryptoServer";
import Topic from "../../../imports/classes/Topic";
import minioTools from "../../../imports/minioTools";

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
    /************
     * Methode de création d'un nouveau projet
     * On check tout et on sauvegarde
     * @param projectName
     * @param brunchOfKeys
     * @param firstMember
     * @returns {{project, projectId: (*|*|*|void)}}
     */
    createProject(projectName, brunchOfKeys, firstMember) {
        check(projectName, String)
        const project = Project.findOne({name: projectName})
        check(!!project, false)
        check(brunchOfKeys, {
            asymPublicKey: String,
            symEnc_asymPrivateKey: String,
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
        //on rehash coté serveur la signature utilisateur
        firstMember.userSignature = cryptoServer.hash(firstMember.userSignature)
        let newProject = new Project()
        newProject.name = projectName
        newProject.public.asymPublicKey = brunchOfKeys.asymPublicKey
        newProject.private.symEnc_asymPrivateKey = brunchOfKeys.symEnc_asymPrivateKey
        newProject.private.hashedSymKey = brunchOfKeys.hashedSymKey
        newProject.private.hashedAdminPassword = brunchOfKeys.hashedAdminPassword
        newProject.private.members.push(firstMember)


        return {
            projectId : newProject.save((err, res)=>{
               let projectId= res
                let mainTopic =new Topic({
                    projectId: projectId,
                    symEnc_name: "mainTopic",
                    membersToNotify: [firstMember.memberId],
                    isMainTopic:true,
                    createdBy:firstMember.memberId
                })
                let mainTopicId= mainTopic.save()
                let createdProject = Project.findOne(res)
                createdProject.private.mainTopicId = mainTopicId
                createdProject.save()
            }),
            project: newProject
        }
    }

})
