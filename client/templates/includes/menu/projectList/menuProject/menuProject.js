import projectController from "../../../../../lib/projectController";

Template.menuProject.helpers({
    //add you helpers here
    sections: function () {
        const isActive = function (section) {
            if (Template.currentData().currentProjectSection === section && Template.currentData().currentProjectId ===Template.currentData().project.asymEnc_projectId ) {
                return "active"
            } else {
                return null
            }
        };
        let sectionsList =[
            {
                name: __("menuProject.home"),
                path: 'home',
                icon: 'home',
                isActive:isActive('home'),
            },
            {
                name: __("menuProject.forum"),
                path: 'forum',
                icon: 'chat',
                isActive:isActive('forum'),
            },
            {
                name: __("menuProject.calendar"),
                path: 'calendar',
                icon: 'view_comfy',
                isActive:isActive('calendar'),
            },
            {
                name: __("menuProject.tasks"),
                path: 'tasks',
                icon: 'format_list_bulleted',
                isActive:isActive('tasks'),
            },
            {
                name: __("menuProject.maps"),
                path: 'maps',
                icon: 'map',
                isActive:isActive('maps'),
            },
            {
                name: __("menuProject.members"),
                path: 'members',
                icon: 'group',
                isActive:isActive('members'),
            },
        ]
        if(projectController.isAdmin(Template.currentData().project.asymEnc_projectId)){
            sectionsList.push( {
                name: __("menuProject.params"),
                path: 'params',
                icon: 'settings',
                isActive:isActive('params'),
            })
        }
        return sectionsList
    }
});

Template.menuProject.events({
    //add your events here
});

Template.menuProject.onCreated(function () {
    //add your statement here
});

Template.menuProject.onRendered(function () {
    //add your statement here
});

Template.menuProject.onDestroyed(function () {
    //add your statement here
});

