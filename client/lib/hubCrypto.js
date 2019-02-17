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
        } else {
            console.warn('unable to get currentUser.private.encryptedAsymPrivateKey')
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
            callback()

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
