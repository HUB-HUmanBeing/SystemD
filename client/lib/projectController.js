import Project from "../../imports/classes/Project";

const projectController = {
    projectSubscription : null,
    currentProjectId: null,
    initProjectSession(projectId,userProject, cb){
        const project = Project.findOne(projectId)
        if(project._id == currentProjectId){

        }
    }
}

export default projectController
