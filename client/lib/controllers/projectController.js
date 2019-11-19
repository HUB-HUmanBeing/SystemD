import cryptoTools from "../cryptoTools";

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
    //ne pas utiliser, c'est buggé
    getCurrentUserProjectIndex(projectId){
        let userProjectIndex = null
        Session.get("projects").forEach((project,i)=>{
            if(project.asymEnc_projectId === projectId){
                userProjectIndex = i
            }
        })
        return userProjectIndex

    },
    isAdmin(projectId){
        return this.getCurrentUserProject(projectId).asymEnc_role === "admin"
    },
    checkAdminOrReroute(projectId){
        Tracker.autorun(()=>{
          if(!this.isAdmin(projectId)){
             this.timeoutBeforeReroute = Meteor.setTimeout(()=>{
                 if(!this.isAdmin(projectId)) {
                     FlowRouter.go("/403")
                 }
              }, 1000)

            }else{

            }
        })

    },
    isMember(projectId){
        return !!this.getCurrentUserProject(projectId)
    },
    getCurrentMemberId(projectId){
        return this.getCurrentUserProject(projectId).asymEnc_memberId
    },
    //crée l'objet authinfo nécessaire à l'authentification pour editer sur un projet
    getAuthInfo(projectId) {
        let userProject = this.getCurrentUserProject(projectId)
        //console.log(Session.get("stringifiedAsymPrivateKey"))
        return {
            memberId: userProject.asymEnc_memberId,
            userSignature: cryptoTools.hash(userProject.asymEnc_memberId + Session.get("stringifiedAsymPrivateKey"))
        }
    }
}

export default projectController
