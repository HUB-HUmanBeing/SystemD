import cryptoTools from "./cryptoTools";

const projectController = {
    getCurrentUserProject(projectId){
        let userProject = null
        Session.get("projects").forEach((project)=>{
            if(project.asymEnc_projectId === projectId){
                userProject = project
            }
        })
        return userProject

    },
    isAdmin(projectId){
        return this.getCurrentUserProject(projectId).role === "admin"
    },
    isMember(projectId){
        return !!this.getCurrentUserProject(projectId)
    },
    //crée l'objet authinfo nécessaire à l'authentification pour editer sur un projet
    getAuthInfo(projectId) {
        let userProject = this.getCurrentUserProject(projectId)
        return {
            memberId: userProject.asymEnc_memberId,
            userSignature: cryptoTools.hash(userProject.asymEnc_memberId + Session.get("stringifiedAsymPrivateKey"))
        }


    },
}

export default projectController
