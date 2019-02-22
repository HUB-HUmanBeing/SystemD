import cryptoTools from "../../lib/cryptoTools";

import hubCrypto from "../../lib/hubCrypto";
import Project from "../../../imports/classes/Project";

Template.projectLayout.helpers({
    //add you helpers here
    decrypting: function () {
        return Template.instance().decrypting.get()
    },
    currentProject : function () {
        return Template.instance().currentProject.get()
    },
    sections: function () {
        const isActive = function (section) {
            if (Template.instance().currentProjectSection.get() === section ) {
                return "active"
            } else {
                return null
            }
        };
        return [
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
            }, {
                name: __("menuProject.params"),
                path: 'params',
                icon: 'settings',
                isActive:isActive('params'),
            }
        ]
    }
});

Template.projectLayout.events({
    //add your events here
});

Template.projectLayout.onCreated(function () {
    //add your statement here

    this.currentProjectId = new ReactiveVar('')
    this.currentProjectSection = new ReactiveVar('')
    this.currentProject = new ReactiveVar({})
    this.decrypting = new ReactiveVar()

    Tracker.autorun(() => {

        FlowRouter.watchPathChange()
        let currentRoute = FlowRouter.current()
        let currentProjectId = currentRoute.params.projectId

        if(this.currentProjectId.get() !== currentProjectId){
            this.decrypting.set([
                __('projectLayout.decrypting1')
            ])
        }
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

                let tsStart = Date.now()
                Meteor.subscribe('ProjectForMembers', currentProjectId, cryptoTools.hash(currentUserProject.asymEnc_projectSymKey), () => {
                    Tracker.autorun(() => {
                        let currentProject = Project.findOne(currentProjectId)
                        if(currentProject){
                            this.currentProject.set(currentProject)
                            cryptoTools.importSymKey(currentUserProject.asymEnc_projectSymKey, currentProject.name, (simKey) => {
                                hubCrypto.symDecryptData(currentProject.private.symEnc_asymPrivateKey, simKey, currentProject.name, (privateKey) => {
                                    Session.set("currentProjectPrivateKey", privateKey)
                                    let currentProjectMembers = []
                                    let keyParam = {simKey: simKey, vector: currentProject.name}

                                    currentProject.private.members.forEach((encryptedMember,i) => {
                                        cryptoTools.decryptObject(encryptedMember, keyParam, (decryptedMember)=>{
                                            currentProjectMembers.push(decryptedMember)
                                            if(i === currentProject.private.members.length-1){
                                                Meteor.setTimeout(()=>{
                                                    Session.set("currentProjectMembers", currentProjectMembers)
                                                    let duration = Date.now()-tsStart
                                                    if(duration>1000){
                                                      this.decrypting.set(false)
                                                     }else {
                                                        Meteor.setTimeout(()=>{
                                                            this.decrypting.set(false)
                                                        },1000-duration)
                                                    }

                                                }, i*20)

                                            }
                                        })
                                    })
                                })
                            })
                        }

                    })
                })
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

