import BeautifyScrollbar from 'beautify-scrollbar';

Template.projectList.helpers({

    currentProjectId: function () {
        return Template.instance().currentProjectId.get()
    },
    currentProjectSection: function () {
        return Template.instance().currentProjectSection.get()
    },
    //add you helpers here
    decryptedProjects: function () {
        let instance = Template.instance()
        Meteor.setTimeout(() => {

            Meteor.setTimeout(() => {
                let menuProjectsContainer = document.getElementById('menuProjectsContainer')
                if (menuProjectsContainer && instance) {
                    if (Meteor.Device.isDesktop()) {
                        if(instance.bs){
                            instance.bs.destroy()
                        }
                        instance.bs = new BeautifyScrollbar(menuProjectsContainer);
                        Meteor.setTimeout(() => {
                            if (!instance.scrollDone && instance.currentProjectId.get() && $("#menuProject-" + instance.currentProjectId.get()).offset()) {
                                $('#menuProjectsContainer').animate({
                                    scrollTop: $("#menuProject-" + instance.currentProjectId.get()).offset().top - 160
                                });
                                instance.scrollDone = true
                            }

                        },200)
                    }else{
                        Meteor.setTimeout(() => {
                            if (!instance.scrollDone && instance.currentProjectId.get() && $("#menuProject-" + instance.currentProjectId.get()).offset()) {
                                $('.general-menu').animate({
                                    scrollTop: $("#menuProject-" + instance.currentProjectId.get()).offset().top - 300
                                });
                                instance.scrollDone = true
                            }

                        },300)
                    }
                }

            }, 100)

            $('#projectsList').collapsible();
        }, 100)
        return Session.get('projects')
    },

});

Template.projectList.events({
    //add your events here
});

Template.projectList.onCreated(function () {
    //add your statement here
    this.bs = undefined
    this.currentProjectId = new ReactiveVar('')
    this.currentProjectSection = new ReactiveVar('')

    this.autorun(() => {
        FlowRouter.watchPathChange()
        let currentRoute = FlowRouter.current()
        if (currentRoute.params.projectId) {
            window.localStorage.setItem("lastOpenedProjectId", currentRoute.params.projectId)
            this.currentProjectId.set(currentRoute.params.projectId)
            let currentSection = currentRoute.route.name.split("-")[1]
            this.currentProjectSection.set(currentSection)
        } else {
            this.currentProjectId.set(window.localStorage.getItem("lastOpenedProjectId"))
        }

    })

});

Template.projectList.onRendered(function () {
    //add your statement here
});

Template.projectList.onDestroyed(function () {
    //add your statement here
    if (this.bs) {
        this.bs.destroy()
    }
});

