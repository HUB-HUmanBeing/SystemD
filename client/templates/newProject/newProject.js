import Project from "../../../imports/classes/Project";
import hubCrypto from "../../lib/hubCrypto";
import cryptoTools from "../../lib/cryptoTools";
import User from "../../../imports/classes/User";

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
                Materialize.toast("Une erreur s'est produite", 6000, 'red darken-3')
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
                errors.projectName = ["votre nom de projet doit comporter au moins 4 caractères"]
                instance.errors.set(errors)
            } else if (projectName.length > 50) {
                errors.projectName = ["votre nom de projet ne doit pas faire plus de 50 caractères"]
                instance.errors.set(errors)
            } else if (regexMail.test(projectName)) {
                errors.projectName = ["votre nom de projet ne peut être une adresse e-mail"]
                instance.errors.set(errors)
            } else {
                this.checkUnicity(projectName, (isOk) => {
                    if (isOk) {
                        errors.projectName = 'valid'
                        instance.errors.set(errors)
                    } else {
                        errors.projectName = ["ce nom de projet est déjà pris"]
                        instance.errors.set(errors)
                    }
                })
            }
        } else {
            errors.projectName = ["veuillez donner un nom à votre projet"]
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
                    errorList.push("Le formulaire de création de projet n'est pas valide")
                }
                if (errors[key].length) {
                    errorList = [...errorList, ...errors[key]]
                } else {
                    missingFields = true
                }
            }
        })
        if (missingFields) {
            errorList.push("Il manque des informations")
        }
        if (errorList.length) {
            errorList.forEach((err, i) => {
                Meteor.setTimeout(() => {
                    Materialize.toast(err, 6000, 'red darken-3')
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
    'submit #newProjectForm ': function (event, instance) {
        event.preventDefault()
        if (validateNewProjectForm.isValid(instance)) {
            let projectName = $('#projectName').val();
            instance.newProjectComplete.set([
                'Génération des clefs de chiffrement du projet',
                'Anonymisation de la liste de participants',
                'Connexion chiffrée au projet'
            ])
            let adminPassword = cryptoTools.generateRandomPassword()
            hubCrypto.generateProjectSymKey(projectSymKey => {
                hubCrypto.generateNewProjectBrunchOfKeys(projectName, Meteor.user().public.asymPublicKey, (projectBrunchOfKeys) => {

                    let uncryptedNewMember = {
                        memberId: cryptoTools.generateId(),
                        role: 'admin',
                        symEnc_userId: Meteor.userId(),
                        symEnc_username: Meteor.user().username,
                        symEnc_joinAtTs: Date.now(),
                        userSignature: cryptoTools.hash(Session.get('stringifiedAsymPrivateKey') + projectName)
                    }


                    let encryptionParams = {
                        simKey: projectBrunchOfKeys.projectKey,
                        vector: projectName
                    }
                    cryptoTools.encryptObject(uncryptedNewMember, encryptionParams, (encryptedNewMember) => {
                        let brunchOfKeyToSend = {
                            asymPublicKey: projectBrunchOfKeys.projectAsymPublicKey,
                            symEnc_AsymPrivateKey: projectBrunchOfKeys.encryptedAsymPrivateKey,
                            hashedSymKey: cryptoTools.hash(projectBrunchOfKeys.stringifiedSymKey),
                            hashedAdminPassword: cryptoTools.hash(adminPassword)
                        }
                        console.log(projectName, brunchOfKeyToSend, encryptedNewMember)
                        Meteor.call('createProject', projectName, brunchOfKeyToSend, encryptedNewMember, (err, res) => {
                            if (err) {
                                console.log(err)
                            } else {
                                const createdProject = res.project
                                createdProject._id = res.projectId

                                let unencryptedUserProjectToAdd = {
                                    asymEnc_projectId : createdProject._id,
                                    asymEnc_projectName: createdProject.name,
                                    asymEnc_projectSymKey: projectBrunchOfKeys.stringifiedSymKey,
                                    asymEnc_role: "admin",
                                    hashedAdminSignature:  cryptoTools.hash(Meteor.user().username + adminPassword)

                                }
                                cryptoTools.importPublicKey( Meteor.user().public.asymPublicKey, (publicKey)=>{
                                    cryptoTools.encryptObject(unencryptedUserProjectToAdd, {publicKey: publicKey}, (userProjectToAdd)=>{
                                        let currentUser = User.findOne(Meteor.userId())
                                        currentUser.callMethod('addUserProject', userProjectToAdd, (err, res)=>{
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                console.log(res)
                                                FlowRouter.go('/project/'+createdProject._id)
                                                Materialize.toast("Le projet " + projectName + " a été créé.", 6000, 'lighter-bg')
                                                instance.newProjectComplete.set(null)
                                            }
                                        })
                                    })
                                })

                            }
                        })
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
});

Template.newProject.onDestroyed(function () {
    //add your statement here
});

