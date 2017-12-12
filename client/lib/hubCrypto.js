import Fixtures from "/imports/Fixtures/Fixtures"

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
                            UserAsymKeys.encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoStringifiedArray(unit8encryptedPrivateKey)
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
            let StringifiedEncryptedAsymPrivateKey =Meteor.user().profile.encryptedAsymPrivateKey
            //on converti la string en arrayBuffer
            let encryptedAsymPrivateKey = cryptoTools.convertStringifiedArrayToArrayBufferView(StringifiedEncryptedAsymPrivateKey)
            //puis on la déchiffre avec notre clef recuperée a partir du mot de passe et en utilisant le username
            // comme vecteur d'initialisation
            cryptoTools.sim_decrypt_data(encryptedAsymPrivateKey, simKey, username, (stringifiedAsymPrivateKey) => {
                //on met ensuite en session la clef privée en version objet json
                Session.set("AsymPrivateKey", JSON.parse(stringifiedAsymPrivateKey))
                //on renvoie le callback
                callback()
            })
        })
    },
    //cation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
    //on prends l'username comme vecteur d'initialisation
    generateProjectSymKey(callback) {
        cryptoTools.generateSimKey((key)=>{
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
                        cryptoTools.sim_encrypt_data(exportablePrivateKey, projectKey, projectName, (unit8encryptedPrivateKey) => {
                            //puis on finit en mettant sous forme de string la clef privée ainsi chiffrée
                            projectAsymKeys.encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoStringifiedArray(unit8encryptedPrivateKey)
                            //et on la retourne en argument du callback
                            callback(projectAsymKeys)
                        })
                    })


            })

        })
    },
    generateEncryptedProjectKeyForUser(projectKey, stringifiedUserPublicKey, callback){

        cryptoTools.importPublicKey(stringifiedUserPublicKey, (userPublicKey)=>{
            cryptoTools.asym_encrypt_data(JSON.stringify(projectKey), userPublicKey, (encryptedProjectKeyUnit8array)=>{
                callback(cryptoTools.convertArrayBufferViewtoStringifiedArray(encryptedProjectKeyUnit8array))
            })
        })

    },
    generateNewProjectBrunchOfKeys(projectName, stringifiedCreatorPublicKey, callback){
        this.generateProjectSymKey((projectKey)=>{
            this.generateProjectAsymKeys(projectKey, projectName, (projectAsymKeys)=>{
                this.generateEncryptedProjectKeyForUser(projectKey, stringifiedCreatorPublicKey, (strigifiedencryptedProjectKeyUnit8array)=>{
                    let brunchOfKeys = {
                        projectAsymPublicKey : projectAsymKeys.asymPublicKey,
                        encryptedAsymPrivateKey : projectAsymKeys.encryptedAsymPrivateKey,
                        encryptedProjectKey : strigifiedencryptedProjectKeyUnit8array
                    }
                    callback(brunchOfKeys)
                })
            })
        })
    }
}
export default hubCrypto