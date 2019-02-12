import Fixtures from "/imports/Fixtures/Fixtures"
import cryptoTools from "./cryptoTools"

/***************************************
 * Objet permettant les manipulations courantes de chiffrements et de déchiffrement sur le site
 * @type {{generateUserAsymKeys(*=, *=, *=): void, decryptAndStorePrivateKeyInSession(*=, *=, *=): void}}
 */
const hubCrypto = {
    //cation génerant un couple de clef asymetrique et chiffrant la clef privée avec le mot de passe de l'utilisateur
    //on prends l'username comme vecteur d'initialisation
    generateUserAsymKeys(password, username, callback) {
        //on prepare l'objet qui sera retourné en argument du callback final
        let UserAsymKeys = {
            asymPublicKey: null,
            encryptedAsymPrivateKey: null
        }
        cryptoTools.hash(password,(hashedPassword)=>{
            //on commence par générer notre clef asymetrique
            cryptoTools.generateAsymKey((keyObject) => {
                //puis on rends exportable la clef publique que l'on donne a notre objet de réponse
                cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey) => {
                    UserAsymKeys.asymPublicKey = exportablePublicKey
                    //on genere ensuite une clef symetrique a partir du mot de passe de l'utilisateur
                    cryptoTools.generateSimKeyFromPassphrase(hashedPassword, (simKey) => {
                        //on exporte notre clef privée
                        cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey) => {
                            //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                            cryptoTools.sim_encrypt_data(
                                exportablePrivateKey,
                                simKey,
                                Fixtures.usernames.includes(username) ? "" : username,
                                (unit8encryptedPrivateKey) => {
                                    //puis on finit en mettant sous forme de string la clef privée ainsi chiffrée
                                    UserAsymKeys.encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoString(unit8encryptedPrivateKey)
                                    //et on la retourne en argument du callback
                                    callback(UserAsymKeys)
                                }
                            )
                        })
                    })

                })

            })
        })

    },
    encryptAsymKeyWithPassword(password, stringifiedAsymPrivateKey, username,callback){
        cryptoTools.hash(password,(hashedPassword)=> {
            cryptoTools.importPrivateKey(stringifiedAsymPrivateKey, (asymPrivateKey) => {
                cryptoTools.generateSimKeyFromPassphrase(hashedPassword, (simKey) => {
                    //on exporte notre clef privée
                    cryptoTools.getExportableKey(asymPrivateKey, (exportablePrivateKey) => {
                        //puis on la chiffre avec notre clef symétrique et en utilisant le nom d'utilisateur comme vecteur d'initialisation
                        cryptoTools.sim_encrypt_data(
                            exportablePrivateKey,
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
            })
        })

    },
    //methode permettant de dechiffrer la clef privée de l'utilisateur a partir de son mot de passe
    decryptAndStorePrivateKeyInSession(hashedPassword, username, callback) {
        //on commence par recuperer la clef symetrique associée au password utilisateur
        cryptoTools.generateSimKeyFromPassphrase(hashedPassword, (simKey) => {
            //on recupere la clef stockée en base
            let stringifiedEncryptedAsymPrivateKey = Meteor.user().private.encryptedAsymPrivateKey
            //on converti la string en arrayBuffer
            let encryptedAsymPrivateKey = cryptoTools.convertStringToArrayBufferView(stringifiedEncryptedAsymPrivateKey)
            //puis on la déchiffre avec notre clef recuperée a partir du mot de passe et en utilisant le username
            // comme vecteur d'initialisation
            cryptoTools.sim_decrypt_data(
                encryptedAsymPrivateKey,
                simKey,
                //si le nom d'utilisateur fait partie des utilisateurs de test, on laisse un vecteur d'initialisation vide,
                // ce qui conduira a l'utilisation du vecteur par défaut
                Fixtures.usernames.includes(username) ? "" : username,
                (stringifiedAsymPrivateKey) => {
                    //on met ensuite en session la clef privée en session, il faudra penser a la réimporter a chaque nouvelle utilisation
                    Session.set("stringifiedAsymPrivateKey", stringifiedAsymPrivateKey)
                    callback()

                })
        })
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
            callback()

        })
    },
    destroyCryptoSession(callback){
        window.localStorage.setItem('hashedPassword', undefined)
        Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
        Session.keys = {}
        callback()
    },
    //chiffrement de données avec une clef symétrique et un vecteur determiné
    symEncryptData(string, symKey, vector, callback) {
        cryptoTools.sim_encrypt_data(string, symKey, vector, (encryptedUnit8) => {
            callback(cryptoTools.convertArrayBufferViewtoString(encryptedUnit8))
        })
    }
    ,
    //dechiffrement de données avec la clef symetrique et le vecteur d'encryption
    symDecryptData(encryptedString, symKey, vector, callback) {
        cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(encryptedString), symKey, vector, (string) => {
            callback(string)
        })
    }
}
export default hubCrypto
