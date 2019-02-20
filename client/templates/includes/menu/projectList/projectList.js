import BeautifyScrollbar from 'beautify-scrollbar';

Template.projectList.helpers({


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
    }
});

Template.projectList.events({
    //add your events here
});

Template.projectList.onCreated(function () {
    //add your statement here
this.bs =undefined

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

