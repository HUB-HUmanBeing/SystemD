import projectController from "../../../../../lib/controllers/projectController";
import ProjectNotifications from "../../../../../../lib/collections/ProjectNotifications";

Template.menuProject.helpers({
    //add you helpers here
    totalNotifs: function () {
        return ProjectNotifications.find({projectId: Template.currentData().project.asymEnc_projectId}).count()
    },
    sections: function () {
        let projectId = Template.currentData().project.asymEnc_projectId
        const isActive = function (section) {
            if (Template.currentData().currentProjectSection === section && Template.currentData().currentProjectId === projectId) {
                return "active"
            } else {
                return null
            }
        };
        const notifsCountBySection = function (section) {
            return ProjectNotifications.find({
                "$and": [
                    {projectId: projectId},
                    {section: section}]
            }).count()
        }
        let sectionsList = [
            // {
            //     name: __("menuProject.home"),
            //     path: 'home',
            //     icon: 'home',
            //     isActive: isActive('home'),
            //     notifsCount: notifsCountBySection('home')
            // },
            {
                name: __("menuProject.forum"),
                path: 'forum',
                icon: 'chat',
                isActive: isActive('forum'),
                notifsCount: notifsCountBySection('forum')
            },
            {
                name: __("menuProject.calendar"),
                path: 'calendar',
                icon: 'view_comfy',
                isActive: isActive('calendar'),
                notifsCount: notifsCountBySection('calendar')
            },
            {
                name: __("menuProject.tasks"),
                path: 'tasks',
                icon: 'format_list_bulleted',
                isActive: isActive('tasks'),
                notifsCount: notifsCountBySection('tasks')
            },
            {
                name: __("menuProject.maps"),
                path: 'maps',
                icon: 'map',
                isActive: isActive('maps'),
                notifsCount: notifsCountBySection('maps')
            },
            {
                name: __("menuProject.members"),
                path: 'members',
                icon: 'group',
                isActive: isActive('members'),
                notifsCount: notifsCountBySection('members')
            },
        ]
        if (projectController.isAdmin(Template.currentData().project.asymEnc_projectId)) {
            sectionsList.push({
                name: __("menuProject.params"),
                path: 'params',
                icon: 'settings',
                isActive: isActive('params'),
                notifsCount: notifsCountBySection('params')
            })
        }
        return sectionsList
    }
});

Template.menuProject.events({
    //add your events here
    'click [openNotifModal]' : function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        Session.set("showNotifications", event.target.id)
        $('#notifModal').modal('open');
    },
    'dblclick [projectTitle]' : function (event, instance) {
        FlowRouter.go("/project/"+Template.currentData().project.asymEnc_projectId+"/forum")
    }
});

Template.menuProject.onCreated(function () {
    //add your statement here
    let projectId = Template.currentData().project.asymEnc_projectId
    let authInfo = projectController.getAuthInfo(projectId)
    Meteor.subscribe("getProjectNotificationsForMember", authInfo, projectId, (err) => {
        if (err) {
            console.log(err)
        }
    })
});

Template.menuProject.onRendered(function () {
    //add your statement here
});

Template.menuProject.onDestroyed(function () {
    //add your statement here
});

