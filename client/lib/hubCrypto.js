import Fixtures from "/imports/Fixtures/Fixtures"
import cryptoTools from "./cryptoTools"

/***************************************
 * Objet permettant les manipulations courantes de chiffrements et de déchiffrement sur le site
 * @type {{generateUserAsymKeys(*=, *=, *=): void, decryptAndStorePrivateKeyInSession(*=, *=, *=): void}}
 */
const hubCrypto = {
    //
    /************************
     * Aation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
     * on prends l'username comme vecteur d'initialisation
     * @param password
     * @param username
     * @param callback
     */
    generateUserAsymKeys(password, username, callback) {


        //on commence par générer notre clef asymetrique
        cryptoTools.generateAsymKey((keyObject) => {
            //on stringifie la clef privée
            cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey) => {
                //on la chiffre avec le password
                this.encryptAsymKeyWithPassword(password, exportablePrivateKey, username, (encryptedAsymPrivateKey) => {
                    //on stringifie aussi la clef publique
                    cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey) => {
                        //on construit l'objet réponse
                        let UserAsymKeys = {
                            asymPublicKey: exportablePublicKey,
                            encryptedAsymPrivateKey: encryptedAsymPrivateKey
                        }
                        //et on les retourne en argument du callback
                        callback(UserAsymKeys)

                    })
                })
            })
        })
    },
    /*****************************
     * Methode permettant de chiffrée une clef privée à partir du password (qui sera lui aussi hashé afin d'etre stocké dans le
     * localstorage sans trop de risques, mais en evitant a l'utilisateur de se re-loguer a chaque nouvelle session
     * @param password
     * @param stringifiedAsymPrivateKey
     * @param username
     * @param callback
     */
    encryptAsymKeyWithPassword(password, stringifiedAsymPrivateKey, username, callback) {
        cryptoTools.hash(password, (hashedPassword) => {
            cryptoTools.generateSimKeyFromPassphrase(hashedPassword, (simKey) => {
                //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                cryptoTools.sim_encrypt_data(
                    stringifiedAsymPrivateKey,
                    simKey,
                    username,
                    (unit8encryptedPrivateKey) => {
                        //puis on finit en mettant sous forme de string la clef privée ainsi chiffrée
                        const encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoString(unit8encryptedPrivateKey)
                        //et on la retourne en argument du callback
                        callback(encryptedAsymPrivateKey)
                    }
                )
            })
        })
    },
    /******************
     * methode permettant de dechiffrer la clef privée de l'utilisateur a partir du hash de son mot de passe
     * @param hashedPassword
     * @param username
     * @param callback
     */
    decryptAndStorePrivateKeyInSession(hashedPassword, username, callback) {
        let currentUser = Meteor.user()
        if (currentUser && currentUser.private && currentUser.private.encryptedAsymPrivateKey) {
            //on commence par recuperer la clef symetrique associée au password utilisateur
            cryptoTools.generateSimKeyFromPassphrase(hashedPassword, (simKey) => {
                //on recupere la clef stockée en base
                let stringifiedEncryptedAsymPrivateKey = Meteor.user().private.encryptedAsymPrivateKey
                //on converti la string en arrayBuffer
                let encryptedAsymPrivateKey = cryptoTools.convertStringToArrayBufferView(stringifiedEncryptedAsymPrivateKey)
                //puis on la déchiffre avec notre clef recuperée a partir du mot de passe et en utilisant le username
                // comme vecteur d'initialisation
                cryptoTools.sim_decrypt_data(encryptedAsymPrivateKey, simKey, username, (stringifiedAsymPrivateKey) => {
                    //on met ensuite en session la clef privée en session, il faudra penser a la réimporter a chaque nouvelle utilisation
                    Session.set("stringifiedAsymPrivateKey", stringifiedAsymPrivateKey)
                    callback()

                })
            })
        } else {
            console.warn('unable to get currentUser.private.encryptedAsymPrivateKey')
        }

    },
    /*************
     * Fonction permettant de déchiffrer la liste des projets d'un utilisateur et de stocker ces infos dans la sesssion
     * @param callback
     */
    decryptAndStoreProjectListInSession(callback) {
        if (Meteor.user().private && Meteor.user().private.projects.length) {
            let encryptedProjects = Meteor.user().private.projects
            let decryptedProjects = []
            //on importe la clef privée de l'utilisateur
            cryptoTools.importPrivateKey(Session.get('stringifiedAsymPrivateKey'), privateKey => {
                //pour chaque projet de l'utilisateur
                cryptoTools.decryptArryOfObject(encryptedProjects, {privateKey: privateKey}, (decryptedProjects)=>{
                    Meteor.setTimeout(()=>{
                        Session.set('projects', decryptedProjects)
                    },decryptedProjects.length*cryptoTools.cryptoBenchmark())
                      callback(decryptedProjects)
                })
            })
        } else {
            callback()
            Session.set('projects', [])
        }


    },
    /*******************************
     * Action d'initialisation du trousseau de clef a la connexion
     * @param hashedPassword
     * @param username
     * @param callback
     */
    initCryptoSession(hashedPassword, username, callback) {
        //on commence par déchiffrer la clef privée de notre utilisateur

        window.localStorage.setItem("hashedPassword", hashedPassword)
        this.decryptAndStorePrivateKeyInSession(hashedPassword, username, () => {
            this.decryptAndStoreProjectListInSession((decryptedProjects) => {



                callback()
            })
        })
    },
    /*****************
     * action de destruction d'une session chiffrée
     * @param callback
     */
    destroyCryptoSession(callback) {
        window.localStorage.setItem('hashedPassword', "")
        Object.keys(Session.keys).forEach(function (key) {
            Session.set(key, undefined);
        })
        Session.keys = {}
        callback()
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
        //on commence par générer notre clef asymetrique
        cryptoTools.generateAsymKey((keyObject) => {
            //puis on rends exportable la clef publique que l'on donne a notre objet de réponse
            cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey) => {
                projectAsymKeys.asymPublicKey = exportablePublicKey
                //on exporte notre clef privée
                cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey) => {
                    //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                    cryptoTools.sim_encrypt_data(
                        exportablePrivateKey,
                        projectKey,
                        // pour simplifier les fixtures elles auront un vecteur d'initialisation constant
                        //on leur passe donc une chaine de caractère vide dans le vecteurs d'initialisation
                        //si le nom est un nom de projet <=> la fin du nom de projet est dans le tableau nom des fixture
                        Fixtures.usernames.includes(projectName.substring(10)) ? "" : projectName,
                        (unit8encryptedPrivateKey) => {
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
                        cryptoTools.getExportableKey(projectKey, (stringifiedProjectKey) => {


                            //on prepare le trousseau de clef
                            let brunchOfKeys = {
                                //clef publique du projet
                                projectAsymPublicKey: projectAsymKeys.asymPublicKey,
                                //clef privée du projet chiffrée avec la clef symetrique du projet
                                encryptedAsymPrivateKey: projectAsymKeys.encryptedAsymPrivateKey,
                                //clef symetrique du projet chiffrée pour l'utilisateur qui en est le créateur
                                encryptedProjectKey: strigifiedEncryptedProjectKey,
                                //Clef symétrique du projet
                                projectKey: projectKey,
                                stringifiedSymKey: stringifiedProjectKey
                            }
                            //on renvoie le trousseau dans le callback
                            callback(brunchOfKeys)
                        })
                    })
            })
        })
    },
    //chiffrement de données avec une clef symétrique et un vecteur determiné
    symEncryptData(string, symKey, vector, callback) {
        cryptoTools.sim_encrypt_data(string, symKey, vector, (encryptedUnit8) => {
            callback(cryptoTools.convertArrayBufferViewtoString(encryptedUnit8))
        })
    },
    //dechiffrement de données avec la clef symetrique et le vecteur d'encryption
    symDecryptData(encryptedString, symKey, vector, callback) {
        cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(encryptedString), symKey, vector, (string) => {
            callback(string)
        })
    },
    //crée l'objet authinfo nécessaire à l'authentification pour editer sur un projet
    getAuthInfo(projectId) {
        let authInfo = {
            memberId: null,
            userSignature: null
        }
        //on boucle sur la liste des userProjects
        Session.get("projects").forEach(userProject => {
            if (userProject.asymEnc_projectId === projectId) {
                authInfo.memberId = userProject.asymEnc_memberId
                //le hash de l'id de membre et de la clef privé utilisateur
                authInfo.userSignature = cryptoTools.hash(userProject.asymEnc_memberId + Session.get("stringifiedAsymPrivateKey"))
            }
        })
        return authInfo
    },


}
export default hubCrypto
