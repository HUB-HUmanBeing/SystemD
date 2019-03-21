import Project from "../../../../imports/classes/Project";
import hubCrypto from "/client/lib/hubCrypto";
import cryptoTools from "/client/lib/cryptoTools";
import User from "/imports/classes/User";
import Topic from "../../../../imports/classes/Topic";
import projectController from "../../../lib/controllers/projectController";

const validateNewProjectForm = {
    /**
     *check if the name of the project is not already taken
     * @param username
     * @param callback
     */
    checkUnicity(projectName, callback) {
        Meteor.call('projectNameAlreadyExists', projectName, function (error, result) {
            if (error) {
                console.log(error)
                Materialize.toast(__('newProjectJs.error'), 6000, 'toastError')
            } else {
                callback(!result)
            }
        })

    },
    /****
     * check if the username given by the user is valid
     * @param event
     * @param instance
     */
    validateProjectName(event, instance) {
        let projectName = $('#projectName').val();
        let errors = instance.errors.get()
        const regexMail = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        if (projectName) {
            if (projectName.length < 4) {
                errors.projectName = [__('newProjectJs.name4')]
                instance.errors.set(errors)
            } else if (projectName.length > 50) {
                errors.projectName = [__('newProjectJs.name50')]
                instance.errors.set(errors)
            } else if (regexMail.test(projectName)) {
                errors.projectName = [__('newProjectJs.errmail')]
                instance.errors.set(errors)
            } else {
                this.checkUnicity(projectName, (isOk) => {
                    if (isOk) {
                        errors.projectName = 'valid'
                        instance.errors.set(errors)
                    } else {
                        errors.projectName = [__('newProjectJs.alreadyTaken')]
                        instance.errors.set(errors)
                    }
                })
            }
        } else {
            errors.projectName = [__('newProjectJs.nameProject')]
            instance.errors.set(errors)
        }
    },
    /***
     *  check if the form ids valid and inform the use
     * @param instance
     * @returns {boolean}
     */
    isValid(instance) {
        let errors = instance.errors.get()
        let errorList = []
        let isValid = true
        let missingFields = false
        Object.keys(errors).forEach((key) => {
            if (errors[key] != "valid") {
                isValid = false
                if (errorList.length == 0) {
                    errorList.push(__('newProjectJs.errForm'))
                }
                if (errors[key].length) {
                    errorList = [...errorList, ...errors[key]]
                } else {
                    missingFields = true
                }
            }
        })
        if (missingFields) {
            errorList.push(__('newProjectJs.missInfo'))
        }
        if (errorList.length) {
            errorList.forEach((err, i) => {
                Meteor.setTimeout(() => {
                    Materialize.toast(err, 6000, 'toastError')
                }, i * 500)

            })
        }
        return isValid
    }
}
Template.newProject.helpers({
    //add you helpers here
    errors: function () {
        return Template.instance().errors.get()
    },
    newProjectComplete: function () {
        return Template.instance().newProjectComplete.get()

    }
});

Template.newProject.events({
    //add your events here
    'keyup #projectName, touchend #projectName , blur #projectName ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateNewProjectForm.validateProjectName(event, instance)
        }, 200)
    },
    /****************
     * création d'un nouveau projet
     * 1--- création des clefs projet
     * 2--- création du premier admin
     * 3--- envoi de la methode de création
     * 4--- ajout du projet dans les projets de l'utilisateur
     */

    'submit #newProjectForm ': function (event, instance) {
        event.preventDefault()
        //on verifie que le formulaire est valide
        if (validateNewProjectForm.isValid(instance)) {
            //on récupere le nom de projet saisi
            let projectName = $('#projectName').val();
            //on lance le visuel de chargement
            instance.newProjectComplete.set([
                __('newProjectJs.generation'),
                __('newProjectJs.creation'),
                __('newProjectJs.initialization')
            ])
            //on genere un password administrateur
            let adminPassword = cryptoTools.generateRandomPassword()
            //on genere un couple clef privée chiffrée clef publique pour le projet + clef symetrique
            hubCrypto.generateNewProjectBrunchOfKeys(projectName, Meteor.user().public.asymPublicKey, (projectBrunchOfKeys) => {
                //on prepare l'objet avec toutes les clef de projet a envoyer dans la methode de création
                let brunchOfKeyToSend = {
                    asymPublicKey: projectBrunchOfKeys.projectAsymPublicKey,
                    symEnc_asymPrivateKey: projectBrunchOfKeys.encryptedAsymPrivateKey,
                    hashedSymKey: cryptoTools.hash(projectBrunchOfKeys.stringifiedSymKey),
                    hashedAdminPassword: cryptoTools.hash(adminPassword)
                }
                //on genere un nouveau membre pour le projet à partir des infos de l'utilisateur courant
                let newMemberId = cryptoTools.generateId()
                let uncryptedNewMember = {
                    memberId: newMemberId,
                    role: 'admin',
                    symEnc_userId: Meteor.userId(),
                    symEnc_username: Meteor.user().username,
                    symEnc_joinAtTs: String(Date.now()),
                    userSignature: cryptoTools.hash(newMemberId + Session.get('stringifiedAsymPrivateKey'))
                }
                //on prepare l'encryption param
                let encryptionParams = {
                    symKey: projectBrunchOfKeys.projectKey
                }
                //on chiffre le tout avec notre super fonction
                cryptoTools.encryptObject(uncryptedNewMember, encryptionParams, (encryptedNewMember) => {
                    //on crée le projet en base
                    Meteor.call('createProject', projectName, brunchOfKeyToSend, encryptedNewMember, (err, res) => {
                        if (err) {
                            console.log(err)
                            //si tout va bien
                        } else {
                            const createdProject = res.project
                            createdProject._id = res.projectId
                            //on crée le projet à ajouter du coté utilisateur
                            let unencryptedUserProjectToAdd = {
                                asymEnc_projectId: createdProject._id,
                                asymEnc_projectName: createdProject.name,
                                asymEnc_memberId: newMemberId,
                                asymEnc_projectSymKey: projectBrunchOfKeys.stringifiedSymKey,
                                asymEnc_role: "admin",
                                asymEnc_adminPassword: adminPassword,
                                //ce dernier champ sera utile pour editer le user project depuis d'
                                hashedAdminSignature: cryptoTools.hash(newMemberId + adminPassword)

                            }
                            //on le chiffre

                            cryptoTools.encryptObject(unencryptedUserProjectToAdd, {publicKey: Meteor.user().public.asymPublicKey}, (userProjectToAdd) => {
                                let currentUser = User.findOne(Meteor.userId())
                                //et on sauvegarde ce nouveau projet dans la liste des projets de l'utilisateur
                                currentUser.callMethod('addUserProject', userProjectToAdd, (err, res) => {
                                    if (err) {
                                        console.log(err)
                                        //si tout est bon
                                    } else {
                                        //on redirige
                                        FlowRouter.go('/project/' + createdProject._id + "/params")

                                        //on toast que tout s'est bien passé
                                        Materialize.toast(__('newProjectJs.theProject') + projectName + __('newProjectJs.created'), 6000, 'toastOk')
                                        //on referme le loader
                                        instance.newProjectComplete.set(null)
                                    }
                                })
                            })
                        }
                    })
                })
            })
        }
    }
});

Template.newProject.onCreated(function () {
    //add your statement here
    this.newProjectComplete = new ReactiveVar()
    this.errors = new ReactiveVar({projectName: []})
});

Template.newProject.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(() => {
        $('#projectName').focus()
    }, 200)
});

Template.newProject.onDestroyed(function () {
    //add your statement here
});

