import Project from "../../../../imports/classes/Project";

Template.projectMembers.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    members: function () {
        let members = Session.get("currentProjectMembers")
        let result = []
        members.forEach(member=>{
            if(member.role !== "admin"){
                result.push(member)
            }
        })
        console.log(result)
        return result
    },
    admins: function () {
        let members = Session.get("currentProjectMembers")
        let result = []
        members.forEach(member=>{
            if(member.role === "admin"){
                result.push(member)
            }
        })
        console.log(result)
        return result
    }
});

Template.projectMembers.events({
    //add your events here
});

Template.projectMembers.onCreated(function () {
    //add your statement here
});

Template.projectMembers.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(()=>{
        $('#ProjectMemberCollapse').collapsible();
    },400)
});

Template.projectMembers.onDestroyed(function () {
    //add your statement here
});

