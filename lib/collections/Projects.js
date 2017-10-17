const Projects = new Mongo.Collection('projects');

Meteor.methods({
        projectToolbarData(projectId){
            check(projectId, String);
            let projectToolbarData = {
                name : "",
                imgUrl : "",
                color : "",
                userRoles : []
            }
            let project = Projects.findOne({_id : projectId})

                projectToolbarData.name = "Projet - " + project.name;
                projectToolbarData.imgUrl = project.imgUrl;
                projectToolbarData.color = "orange";
                if(userId = Meteor.userId()){
                    project.members.forEach(function (member) {
                        if(userId === member.user_id){
                            projectToolbarData.userRoles = member.roles
                        }
                    })
                }


            return projectToolbarData
        }
    }
)
export default Projects