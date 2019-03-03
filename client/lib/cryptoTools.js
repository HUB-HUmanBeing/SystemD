import * as Materialize from "meteor/materialize:materialize";
import Hashes from "jshashes"
import zxcvbn from 'zxcvbn'

const cryptoTools = {
    //permet de recuperer l'object crypto suivant le navigateur
    crypto() {
        let crypto = window.crypto || window.msCrypto || window.webkitCrypto;
        if (crypto.subtle) {
            return crypto
        } else {
            console.log("API crypto Not Supported")
            Materialize.toast('Votre navigateur ne permet pas une connexion sécurisée', 6000, 'red darken-2')
        }

    },
    //vecteur d'initialisation utilisé pour les chiffrements symetriques
    vectorFromString(str) {
        let vectorPhrase = str + "Le pari d’une humanité de la collaboration et du partage";
        let vector = new Uint8Array(16);
        for (let iii = 0; iii < vector.length; iii++) {
            vector[iii] = vectorPhrase.charCodeAt(iii);
        }
        return vector;
    },
    //transforme une string en arrayBuffer
    convertStringToArrayBufferView(str) {
        let bytes = new Uint8Array(str.length);
        for (let iii = 0; iii < str.length; iii++) {
            bytes[iii] = str.charCodeAt(iii);
        }
        return bytes;
    },
    //transforme un arrayBuffer en string
    convertArrayBufferViewtoString(buffer) {
        let str = "";
        for (let iii = 0; iii < buffer.byteLength; iii++) {
            str += String.fromCharCode(buffer[iii]);
        }
        return str;
    },
    getRandomStringVector() {
        var array = new Uint8Array(16);
        return this.convertArrayBufferViewtoString(this.crypto().getRandomValues(array));
    },
    /**************************************************
     * génération d'un couple clef publique-clef privé contenu dans l'argument de la callback
     * @param callback avec objet key
     */
    generateAsymKey(callback) {

        let crypto = this.crypto()

        //Parameters:
        //1. Asymmetric Encryption algorithm name and its requirements
        //2. Boolean indicating extractable. which indicates whether or not the raw keying material may be exported by the application (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
        //3. Usage of the keys. (http://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
        let promise_key = crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"}
        }, true, ["encrypt", "decrypt"]);

        promise_key.then((key) => {
            callback(key)
        });
        promise_key.catch = function (e) {
            console.log(e.message);
        }


    },
    asym_encrypt_data(data, stringifiedPublicKey, callback) {

        this.importPublicKey(stringifiedPublicKey, (public_key_object) => {
            this.crypto().subtle.encrypt({"name": "RSA-OAEP"}, public_key_object, this.convertStringToArrayBufferView(data)).then(
                function (result) {

                    callback(new Uint8Array(result))
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })

    },
    asym_decrypt_data(encrypted_data, stringifiedPublicKey, callback) {
        this.importPublicKey(stringifiedPublicKey, (public_key_object) => {
            this.crypto().subtle.decrypt({name: "RSA-OAEP"}, public_key_object, encrypted_data).then(
                (result) => {
                    callback(this.convertArrayBufferViewtoString(new Uint8Array(result)));
                },
                function (e) {
                    console.log("asym decrypt faillure", e)
                }
            );
        })
    },
    //permet de stocker en base une clef
    getExportableKey(keyObject, callback) {
        this.crypto().subtle.exportKey("jwk", keyObject).then(function (result) {
            callback(JSON.stringify(result))
        }, function (e) {
            console.log(e.message);
        });
    },
    importPrivateKey(string_private_key, callback) {
        this.crypto().subtle.importKey("jwk", JSON.parse(string_private_key), {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"}
        }, true, ["decrypt"]).then(
            function (result) {
                callback(result)
            }, function (e) {
                console.log(e);
            });
    },
    //permet de rendre utilisable la clef publique d'un utilisateur
    importPublicKey(string_private_key, callback) {
        this.crypto().subtle.importKey(
            "jwk",
            JSON.parse(string_private_key),
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {name: "SHA-256"}
            },
            false, ["encrypt"]).then(
            function (result) {
                callback(result)
            }, function (e) {
                console.log(e);
            });
    },
    //permet de rendre utilisable la clef publique d'un utilisateur
    async importSymKey(string_key, callback) {
        return this.crypto().subtle.importKey(
            "jwk",
            JSON.parse(string_key),
            {name: "AES-CBC"},
            true, ["encrypt", "decrypt"]).then(
            function (result) {
                callback(result)
            }, function (e) {
                console.log(e);
            });
    },
    //fonction permettant de generer une clef symétrique de 128 bits pour un chifrement en AES-CBC
    generateSimKey(callback) {
        let promise_key = crypto.subtle.generateKey({name: "AES-CBC", length: 128}, true, ["encrypt", "decrypt"]);
        promise_key.then(function (key) {
            callback(key);
        });
        promise_key.catch = function (e) {
            console.log(e.message);
        }
    },
    //fonction permettant de generer une clef symétrique a partir d'un mot de passe
    generateSimKeyFromPassphrase(passphrase, callback) {
        this.crypto().subtle.digest({name: "SHA-256"}, this.convertStringToArrayBufferView(passphrase)).then((result) => {
            this.crypto().subtle.importKey("raw", result, {name: "AES-CBC"}, true, ["encrypt", "decrypt"]).then((e)=> {
                this.getExportableKey(e,(stringifiedKey)=>{
                    callback(stringifiedKey)
                })

            }, function (e) {
                console.log(e);
            });

        });
    },
    //fonction de chiffrement symétrique en AES
    async sim_encrypt_data(data, stringifiedSymKey, callback) {

        return this.importSymKey(stringifiedSymKey,  async (symKey) => {
            let iv = this.crypto().getRandomValues(new Uint8Array(16))
            await crypto.subtle.encrypt({
                name: "AES-CBC",
                iv: iv
            }, symKey, this.convertStringToArrayBufferView(data)).then(
                (result) => {
                    callback(this.convertArrayBufferViewtoString(iv) + this.convertArrayBufferViewtoString(new Uint8Array(result)));
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })

    },
    //fonction de dechiffrement de données
    async sim_decrypt_data(encryptedData, stringifiedSymKey, callback) {
        return this.importSymKey(stringifiedSymKey, async(symKey) => {
            let iv = this.convertStringToArrayBufferView(encryptedData.substring(0, 16))
            let cypherText = this.convertStringToArrayBufferView(encryptedData.substring(16))
             return this.crypto().subtle.decrypt({name: "AES-CBC", iv: iv}, symKey, cypherText).then(
                (result) => {
                    callback(this.convertArrayBufferViewtoString(new Uint8Array(result)));
                },
                function (e) {
                    console.log("sym decrypt faillure", e)
                }
            );
        })
    }
    ,
    //fonction permettant d'obtenir le hash d'une string donnée
    hash(string, callback) {
        const simpleHash = function (stringToHash, salt) {
            return (new Hashes.SHA512().b64(stringToHash + salt))
        }
        let saltArray = Meteor.settings.public.frontSalt.split(' ')
        let hash = string
        saltArray.forEach(saltPiece => {
            hash = simpleHash(hash, saltPiece)
        })
        if (callback) {
            callback(hash)
        }
        return hash
    },
    heavyHash(string){

        return this.hash(string)
    },
    //fonction permettant de générer un mot de passe aléatoire
    generateRandomPassword(length) {
        let randomLength = 30 + Math.floor(Math.random() * 10)
        length = length || randomLength
        let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let lowercase = 'abcdefghijklmnopqrstuvwxyz';
        let numbers = '0123456789';

        let all = uppercase + lowercase + numbers;
        let password = '';
        for (let index = 0; index < length; index++) {
            let character = Math.floor(Math.random() * all.length);
            password += all.substring(character, character + 1);
        }
        return password;
    }
    ,
    //fonction générant un ID "unique"
    generateId() {
        return Math.random().toString(36).substr(2, 16)
    }
    ,
    /**************
     * fonction de foreach asynchrone
     * @param array
     * @param callback
     * @returns {Promise<void>}
     */
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
    ,
    /***********************
     * chiffre unelement a partir de l'encryption params si les conventions de nommage sont bonnes
     * @param element   --- le contenu à chiffrer
     * @param elementName --- le nom de l'element pour récuperer le préfixe
     * @param encryptionParams  --- un objet comprenant {simkey, publicKey, vector} (pas obligé de toutes les avoir)
     * @param callback
     * @returns {Promise<void>}
     */
    async encryptElement(element, elementName, encryptionParams, callback) {
        let elementType = typeof element
        if (elementType == "string" || elementType == "number") {
            let prefix = elementName.split('_')[0]
            if (prefix == 'symEnc') {
                await this.sim_encrypt_data(element, encryptionParams.symKey, callback)
            } else if (prefix == 'asymEnc') {
                await this.asym_encrypt_data(element, encryptionParams.publicKey, callback)
            }else{
                callback(element)
            }
        } else {
            console.warn("'on s'occupe que des champs simples pour l'instant'")
        }
    }
    ,
    /************************
     * fonction permettant de chiffrer tout les couples clef valeur d'un objet suivant les prefixes des clefs
     * @param object ---l'objet a chiffrer
     * @param encryptionParams -------les clefs
     * @param callback ------renvoie l'objet chiffré
     */
    encryptObject(object, encryptionParams, callback) {
        let encryptedObject = object
        const encrypter = async (object, encryptionParams, callback) => {
            await this.asyncForEach(Object.keys(object), async (key,i) => {

                await this.encryptElement(object[key], key, encryptionParams, (encryptedData) => {
                    console.log("in")
                    encryptedObject[key] = encryptedData
                    if(i===Object.keys.length-1){
                        console.log("go")
                         console.log(encryptedObject)
                        callback(encryptedObject);
                    }
                })

            });

        }
        encrypter(object, encryptionParams, callback)
    }
    ,
    /********************
     * dechiffre un element a partir du decryption params si les conventions de nommage sont bonnes
     * @param element   --- le contenu à dechiffrer
     * @param elementName --- le nom de l'element pour récuperer le préfixe
     * @param encryptionParams  --- un objet comprenant {simkey, privateKey, vector} (pas obligé de toutes les avoir)
     * @param callback
     * @returns {Promise<void>}
     */
    async decryptElement(element, elementName, encryptionParams, callback) {
        let elementType = typeof element
        if (element) {
            if (elementType == "string" || elementType == "number") {
                let prefix = elementName.split('_')[0]
                if (prefix == 'symEnc') {
                    await this.sim_decrypt_data(element, encryptionParams.symKey,  callback)
                } else if (prefix == 'asymEnc') {
                    await this.asym_decrypt_data(element, encryptionParams.privateKey, callback)
                }
            } else {
                console.warn("'on s'occupe que des champs simples pour l'instant'")
            }
        }
    }
    ,
    /***************
     * fonction permettant de dechiffrer tout les couples clef valeur d'un objet suivant les prefixes des clefs
     * @param object ---l'objet a deciffrer
     * @param decryptionParams -------les clefs
     * @param callback ------renvoie l'objet dechiffré
     */
    async decryptObject(object, decryptionParams, callback) {
        let decryptedObject = object

        const decrypter = async (object, decryptionParams, callback) => {
            await this.asyncForEach(Object.keys(object), async (key, i) => {
                await this.decryptElement(object[key], key, decryptionParams, (decryptedData) => {
                    decryptedObject[key] = decryptedData
                })
            });
            callback(decryptedObject);
        }
        await decrypter(object, decryptionParams, callback)
    }
    ,
    async decryptArryOfObject(arrayOfObject, decryptionParams, callback) {
        let decryptedArrayOfObject = []
        await this.asyncForEach(arrayOfObject, async (object, i) => {
            await this.decryptObject(object, decryptionParams, (decryptedObject) => {
                decryptedArrayOfObject.push(decryptedObject)
                if (i === arrayOfObject.length - 1) {
                    callback(decryptedArrayOfObject)
                }
            })
        })
    }
    ,
    /******************
     * on stocke ici notre objet zxcvbn qui gere la difficulté des password
     */
    zxcvbn: zxcvbn,
    /***************************
     * pas très fier de celle là, elle nous permet de savoir a peu près les perf d'une machie
     * utilisateur et de pouvoir setter les setTimeOut des fonctions de déchiffrement qui font chier puisque
     * le Session.Set fait nimporte quoi
     * @returns {*}
     */
    cryptoBenchmark() {
        let cryptoBenchmark = window.localStorage.getItem("cryptoBenchmark")
        if (cryptoBenchmark) {
            return cryptoBenchmark
        } else {
            let start = Date.now()
            for (let i = 0; i < 150; i++) {
                new Hashes.SHA512().b64("test")
            }
            let result = Date.now() - start
            window.localStorage.setItem("cryptoBenchmark", result)
            return result
        }
    }
}

export default cryptoTools
