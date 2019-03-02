import cryptoTools from "../../lib/cryptoTools";

import hubCrypto from "../../lib/hubCrypto";
import Project from "../../../imports/classes/Project";
import projectController from "../../lib/controllers/projectController";

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
        let sectionsList = [
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
            }
        ]
        if(projectController.isAdmin(Template.instance().currentProjectId.get())){
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

Template.projectLayout.events({
    //add your events here
});

Template.projectLayout.onCreated(function () {
    //id du projet courant
    this.currentProjectId = new ReactiveVar('')
    //section courante
    this.currentProjectSection = new ReactiveVar('')
    //le projet courant
    this.currentProject = new ReactiveVar({})
    //si rempli ca affiche un loader
    this.decrypting = new ReactiveVar()

    /*********
     * récupération et déchiffrement des infos du projet courant
     */
    Tracker.autorun(() => {
        //on commence par récuperer l'id du projet à partir de la route
        FlowRouter.watchPathChange()
        let currentRoute = FlowRouter.current()
        let currentProjectId = currentRoute.params.projectId
        //on fait prompter le loader si c'est pas le projet courant
        if(this.currentProjectId.get() !== currentProjectId){
            this.decrypting.set([
                __('projectLayout.decrypting1')
            ])
            this.currentProjectId.set(currentProjectId)
        }
        //on récupere aussi la section visitée
        let currentSection = currentRoute.route.name.split("-")[1]
        this.currentProjectSection.set(currentSection)

        //on récupere les userProjects de l'utilisateur
        let userProjects = Session.get("projects")
        //on chope le bon
        if (userProjects && userProjects.length) {
            let currentUserProject = null
            userProjects.forEach(userProject => {
                if (currentProjectId === userProject.asymEnc_projectId) {
                    currentUserProject = userProject
                }
            })
            //si on le trouve
            if (currentUserProject) {
                //on fait partir un timer afin de mesurer le temps que ca prends
                let tsStart = Date.now()
                //on souscrit au projet
                Meteor.subscribe('ProjectForMembers', currentProjectId, cryptoTools.hash(currentUserProject.asymEnc_projectSymKey), () => {
                    Tracker.autorun(() => {
                        //on find le projet
                        let currentProject = Project.findOne(currentProjectId)
                        if(currentProject){
                            this.currentProject.set(currentProject)
                            //on recupere la clef projet
                            cryptoTools.importSymKey(currentUserProject.asymEnc_projectSymKey, currentProject.name, (symKey) => {
                                hubCrypto.symDecryptData(currentProject.private.symEnc_asymPrivateKey, symKey, currentProject.name, (privateKey) => {
                                    //on stocke en session les clefs ce qui sera pratique pour la suite
                                    Session.set("currentProjectSimKey", currentUserProject.asymEnc_projectSymKey)
                                    Session.set("currentProjectPrivateKey", privateKey)
                                    //on dechiffre les membres du projet
                                    let currentProjectMembers = []
                                    let keyParam = {symKey: symKey, vector: currentProject.name}
                                    currentProject.private.members.forEach((encryptedMember,i) => {
                                        cryptoTools.decryptObject(encryptedMember, keyParam, (decryptedMember)=>{
                                            currentProjectMembers.push(decryptedMember)
                                            if(i === currentProject.private.members.length-1){
                                                Meteor.setTimeout(()=>{
                                                    //on stocke la liste des membres en session
                                                    Session.set("currentProjectMembers", currentProjectMembers)
                                                    //on fait fermer le loader
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

