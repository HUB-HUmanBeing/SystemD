import Fixtures from "/imports/Fixtures/Fixtures"
import Project from "../../imports/classes/Project";

/***************************************
 * Objet permettant les manipulations courantes de chiffrements et de déchiffrement sur le site
 * @type {{generateUserAsymKeys(*=, *=, *=): void, decryptAndStorePrivateKeyInSession(*=, *=, *=): void}}
 */
hubCrypto = {
    //cation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
    //on prends l'username comme vecteur d'initialisation
    generateUserAsymKeys(password, username, callback) {
        //on prepare l'objet qui sera retourné en argument du callback final
        let UserAsymKeys = {
            asymPublicKey: null,
            encryptedAsymPrivateKey: null
        }
        //on commence par générer notre clef asymetrique
        cryptoTools.generateAsymKey((keyObject) => {
            //puis on rends exportable la clef publique que l'on donne a notre objet de réponse
            cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey) => {
                UserAsymKeys.asymPublicKey = exportablePublicKey
                //on genere ensuite une clef symetrique a partir du mot de passe de l'utilisateur
                cryptoTools.generateSimKeyFromPassphrase(password, (simKey) => {
                    //on exporte notre clef privée
                    cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey) => {
                        //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                        cryptoTools.sim_encrypt_data(exportablePrivateKey, simKey, username, (unit8encryptedPrivateKey) => {
                            //puis on finit en mettant sous forme de string la clef privée ainsi chiffrée
                            UserAsymKeys.encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoString(unit8encryptedPrivateKey)
                            //et on la retourne en argument du callback
                            callback(UserAsymKeys)
                        })
                    })
                })

            })

        })
    },
    //methode permettant de dechiffrer la clef privée de l'utilisateur a partir de son mot de passe
    decryptAndStorePrivateKeyInSession(password, username, callback) {
        //si le nom d'utilisateur fait partie des utilisateurs de test, on laisse un vecteur d'initialisation vide,
        // ce qui conduira a l'utilisation du vecteur par défaut
        if (Fixtures.usernames.includes(username)) {
            username = ""
        }
        //on commence par recuperer la clef symetrique associée au password utilisateur
        cryptoTools.generateSimKeyFromPassphrase(password, (simKey) => {
            //on recupere la clef stockée en base
            let StringifiedEncryptedAsymPrivateKey = Meteor.user().profile.encryptedAsymPrivateKey

            //on converti la string en arrayBuffer
            let encryptedAsymPrivateKey = cryptoTools.convertStringToArrayBufferView(StringifiedEncryptedAsymPrivateKey)
            //puis on la déchiffre avec notre clef recuperée a partir du mot de passe et en utilisant le username
            // comme vecteur d'initialisation
            cryptoTools.sim_decrypt_data(encryptedAsymPrivateKey, simKey, username, (stringifiedAsymPrivateKey) => {
                //on met ensuite en session la clef privée en session, il faudra penser a la réimporter a chaque nouvelle utilisation
                Session.set("stringifiedAsymPrivateKey", stringifiedAsymPrivateKey)
                callback()

            })
        })
    },
    //cation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
    //on prends l'username comme vecteur d'initialisation
    generateProjectSymKey(callback) {
        cryptoTools.generateSimKey((key) => {
            callback(key)
        })
    },
    //cation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
    //on prends l'username comme vecteur d'initialisation
    generateProjectAsymKeys(projectKey, projectName, callback) {
        //on prepare l'objet qui sera retourné en argument du callback final
        let projectAsymKeys = {
            asymPublicKey: null,
            encryptedAsymPrivateKey: null
        }
        if (Fixtures.usernames.includes(projectName.substring(10))) {
            projectName = ""
        }
        //on commence par générer notre clef asymetrique
        cryptoTools.generateAsymKey((keyObject) => {
            //puis on rends exportable la clef publique que l'on donne a notre objet de réponse
            cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey) => {
                projectAsymKeys.asymPublicKey = exportablePublicKey
                //on exporte notre clef privée
                cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey) => {
                    //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                    cryptoTools.sim_encrypt_data(exportablePrivateKey, projectKey, projectName, (unit8encryptedPrivateKey) => {
                        //puis on finit en mettant sous forme de string la clef privée ainsi chiffrée
                        projectAsymKeys.encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoString(unit8encryptedPrivateKey)
                        //et on la retourne en argument du callback
                        callback(projectAsymKeys)
                    })
                })


            })

        })
    },
    /**************************
     *  chiffre une clef symétrique de projet avec la clef publique de l'utilisateur avant de la renvoyer sous forme d'une chaine de caracteres
     * @param projectKey //la clef symétrique du projet
     * @param stringifiedUserPublicKey //la clef publique de l'utilisateur
     * @param callback //la fonction de retour avec comme argument la chaine de caractères chiffrés
     */
    generateEncryptedProjectKeyForUser(projectKey, stringifiedUserPublicKey, callback) {
        //on importe la clef publique de l'utilisateur
        cryptoTools.importPublicKey(stringifiedUserPublicKey, (userPublicKey) => {
            //on rends exportable la clef projet
            cryptoTools.getExportableKey(projectKey, (exportableProjectKey) => {
                //on la chiffre avec la clef publique de l'utilisateur
                cryptoTools.asym_encrypt_data(exportableProjectKey, userPublicKey, (encryptedProjectKeyUnit8array) => {
                    //on renvoie en callback la clef chiffrée
                    callback(cryptoTools.convertArrayBufferViewtoString(encryptedProjectKeyUnit8array))
                })
            })

        })

    },
    /***********************************
     * gérération du trousseau de clef nécessaire a la création d'un nouveau projet
     * @param projectName //on s'en sert comme vecteur d'initialisation
     * @param stringifiedCreatorPublicKey //clef publique du créateur du projet
     * @param callback //fonction de retour dont on passera en argument le trousseau de clef
     */
    generateNewProjectBrunchOfKeys(projectName, stringifiedCreatorPublicKey, callback) {
        //on commence par générer la clef symétrique
        this.generateProjectSymKey((projectKey) => {
            //on genere la paire de clef asymetriques rsa
            this.generateProjectAsymKeys(projectKey, projectName, (projectAsymKeys) => {
                //on chiffre la clef symetrique avec la clef publique de l'utilisateur
                this.generateEncryptedProjectKeyForUser(projectKey,
                    stringifiedCreatorPublicKey,
                    (strigifiedEncryptedProjectKey) => {
                        //on prepare le trousseau de clef
                        let brunchOfKeys = {
                            //clef publique du projet
                            projectAsymPublicKey: projectAsymKeys.asymPublicKey,
                            //clef privée du projet chiffrée avec la clef symetrique du projet
                            encryptedAsymPrivateKey: projectAsymKeys.encryptedAsymPrivateKey,
                            //clef symetrique du projet chiffrée pour l'utilisateur qui en est le créateur
                            encryptedProjectKey: strigifiedEncryptedProjectKey
                        }
                        //on renvoie le trousseau dans le callback
                        callback(brunchOfKeys)
                    })
            })
        })
    },
    decryptAndStoreInSesstionBrunchOfProjectKeys(callback) {
        cryptoTools.importPrivateKey(Session.get("stringifiedAsymPrivateKey"), (userAsymPrivateKey) => {
            let currentUser = Meteor.user()
            let brunchOfProjectKeys = []
            currentUser.profile.projects.forEach((userProject, i) => {
                cryptoTools.asym_decrypt_data(
                    cryptoTools.convertStringToArrayBufferView(userProject.encryptedProjectKey),
                    userAsymPrivateKey,
                    (stringifiedProjectKey) => {
                        brunchOfProjectKeys.push({
                            project_id: userProject.project_id,
                            projectKey: stringifiedProjectKey,
                            vector: Fixtures.usernames.includes(userProject.name.substring(10)) ? "" : userProject.name
                    }
                    )
                        if (i === currentUser.profile.projects.length - 1) {
                            Session.set("brunchOfProjectKeys", brunchOfProjectKeys)
                            callback()
                        }
                    })
            })

        })

    },
    getProjectKey(projectId) {
        let projectKey
        Session.get("brunchOfProjectKeys").forEach((item) => {
            if (item.project_id === projectId) {
                projectKey = item.projectKey
            }
        })
        return projectKey
    },
    initCryptoSession(password, username, callback) {
        this.decryptAndStorePrivateKeyInSession(password, username, () => {
            this.decryptAndStoreInSesstionBrunchOfProjectKeys(() => {
                callback()
            })
        })
    }

}
export default hubCrypto