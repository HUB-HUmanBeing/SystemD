import cryptoTools from "../../lib/cryptoTools";

Template.projectLayout.helpers({
    //add you helpers here
    decripting: function () {
        return Template.instance().decripting.get()
    }
});

Template.projectLayout.events({
    //add your events here
});

Template.projectLayout.onCreated(function () {
    //add your statement here
    this.decripting = new ReactiveVar([
        'Déchiffrement des informations projet',
    ])
    this.currentProjectId = new ReactiveVar('')
    this.currentProjectSection = new ReactiveVar('')
    this.currentSubscription = {
        projectId: null,
        subscription: null
    }
    Tracker.autorun(() => {
        FlowRouter.watchPathChange()
        let currentRoute = FlowRouter.current()
        let currentProjectId = currentRoute.params.projectId
        this.currentProjectId.set(currentProjectId)
        let currentSection = currentRoute.route.name.split("-")[1]
        this.currentProjectSection.set(currentSection)


        let userProjects = Session.get("projects")
        if (userProjects && userProjects.length) {
            let currentUserProject = null
            userProjects.forEach(userProject => {
                if (currentProjectId === userProject.asymEnc_projectId) {
                    currentUserProject = userProject
                }
            })
            if (currentUserProject) {
                console.log(1)
                if (this.currentSubscription.projectId !== currentProjectId) {
                    console.log(2)
                    if (this.currentSubscription.subscription) {
                        console.log(3)
                        this.currentSubscription.subscription.stop()
                    }
                    this.currentSubscription.projectId = currentProjectId
                    this.currentSubscription.subscription = Meteor.subscribe('ProjectForMembers', currentProjectId, cryptoTools.hash(currentUserProject.asymEnc_projectSymKey), () => {
                        console.log("souscription passée")
                    })
                }
            } else {

                //FlowRouter.go('/403')
            }

        }
    })


});

Template.projectLayout.onRendered(function () {
    //add your statement here
});

Template.projectLayout.onDestroyed(function () {
    //add your statement here
});

