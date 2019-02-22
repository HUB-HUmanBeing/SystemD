import BeautifyScrollbar from 'beautify-scrollbar';

Template.projectList.helpers({

    currentProjectId: function(){
      return Template.instance().currentProjectId.get()
    },
    currentProjectSection: function(){
        return Template.instance().currentProjectSection.get()
    },
    //add you helpers here
    decryptedProjects: function () {
        Meteor.setTimeout(()=>{
            Meteor.setTimeout(()=>{
                let menuProjectsContainer = document.getElementById('menuProjectsContainer')
                if(menuProjectsContainer && Template.instance()){

                    Template.instance().bs = new BeautifyScrollbar(menuProjectsContainer);
                }

            },100)

            $('#projectsList').collapsible();
        },100)
        return Session.get('projects')
    },

});

Template.projectList.events({
    //add your events here
});

Template.projectList.onCreated(function () {
    //add your statement here
this.bs =undefined
    this.currentProjectId = new ReactiveVar('')
    this.currentProjectSection = new ReactiveVar('')

    Tracker.autorun(()=>{
        FlowRouter.watchPathChange()
        let currentRoute = FlowRouter.current()
        this.currentProjectId.set(currentRoute.params.projectId)
        let currentSection = currentRoute.route.name.split("-")[1]
        this.currentProjectSection.set(currentSection)
    })

});

Template.projectList.onRendered(function () {
    //add your statement here
});

Template.projectList.onDestroyed(function () {
    //add your statement here
    if(this.bs){
        bs.destroy()
    }
});

