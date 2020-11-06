import * as Materialize from "meteor/materialize:materialize";
import Hashes from "jshashes"
import zxcvbn from 'zxcvbn'
import bcrypt from 'bcryptjs'
import * as randomPassword from "secure-random-password";


const cryptoTools = {
    //permet de recuperer l'object crypto suivant le navigateur
    crypto() {
        let crypto = window.crypto || window.msCrypto || window.webkitCrypto;
        if (crypto.subtle) {
            return crypto
        } else {
            console.log("API crypto Not Supported")
            Materialize.toast('Votre navigateur ne permet pas une connexion sécurisée', 6000, 'toasError')
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

        let saltedPrefix = this.generateRandomPassword(10)
        this.importPublicKey(stringifiedPublicKey, (public_key_object) => {
            this.crypto().subtle.encrypt({"name": "RSA-OAEP", hash: {name: 'SHA-256'}}, public_key_object, this.convertStringToArrayBufferView(saltedPrefix + data)).then(
                function (result) {

                    callback(new Uint8Array(result))
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })

    },
    asym_decrypt_data(encrypted_data, stringifiedPrivateKey, callback) {
        this.importPrivateKey(stringifiedPrivateKey, (private_key_object) => {
            this.crypto().subtle.decrypt({name: "RSA-OAEP", hash: {name: 'SHA-256'}}, private_key_object, encrypted_data).then(
                (result) => {
                    callback(this.convertArrayBufferViewtoString(new Uint8Array(result)).substring(10));
                },
                function (e) {
                    console.error("asym decrypt faillure", e)
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
        return this.crypto().subtle.importKey("jwk", JSON.parse(string_private_key), {
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
        return this.crypto().subtle.importKey(
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
                if (callback) {
                    callback(result)
                }
            }, function (e) {
                console.log(e);
            });
    },
    //permet de rendre utilisable la clef publique d'un utilisateur
    importSymKey(string_key, callback) {
        return this.crypto().subtle.importKey(
            "jwk",
            JSON.parse(string_key),
            {name: "AES-CBC"},
            true, ["encrypt", "decrypt"]).then(
            function (result) {
                if (callback) {
                    callback(result)
                }
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
            this.crypto().subtle.importKey("raw", result, {name: "AES-CBC"}, true, ["encrypt", "decrypt"]).then((e) => {
                this.getExportableKey(e, (stringifiedKey) => {
                    callback(stringifiedKey)
                })

            }, function (e) {
                console.log(e);
            });

        });
    },
    //fonction de chiffrement symétrique en AES
    async sim_encrypt_data(data, stringifiedSymKey, callback) {

        return this.importSymKey(stringifiedSymKey, async (symKey) => {
            let iv = this.crypto().getRandomValues(new Uint8Array(16))
            await crypto.subtle.encrypt({
                name: "AES-CBC",
                iv: iv
            }, symKey, this.convertStringToArrayBufferView(data)).then(
                (result) => {
                    if (callback)
                        callback(this.convertArrayBufferViewtoString(iv) + this.convertArrayBufferViewtoString(new Uint8Array(result)));
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })

    },
    async sim_encrypt_file(data, stringifiedSymKey, callback) {

        return this.importSymKey(stringifiedSymKey, async (symKey) => {
            let iv = this.crypto().getRandomValues(new Uint8Array(16))
            await crypto.subtle.encrypt({
                name: "AES-CBC",
                iv: iv
            }, symKey, this.convertStringToArrayBufferView(data)).then(
                (result) => {
                    if (callback)
                        callback(iv,new Uint8Array(result));
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })
    },
    async sim_decrypt_file(data, stringifiedSymKey, callback) {
let dataB64 = this.convertStringToArrayBufferView(data)
        return this.importSymKey(stringifiedSymKey, async (symKey) => {
            let iv = new Uint8Array(dataB64.slice(0, 16))

            await crypto.subtle.decrypt({
                name: "AES-CBC",
                iv: iv
            }, symKey, new Uint8Array(dataB64.slice(16))).then(
                (result) => {
                    if (callback)
                        callback(new Uint8Array(result));
                },
                function (e) {
                    console.log(e.message);
                }
            );
        })
    },
//fonction de dechiffrement de données
    async sim_decrypt_data(encryptedData, stringifiedSymKey, callback) {
        return this.importSymKey(stringifiedSymKey, async (symKey) => {
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
    },
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
    heavyHash(string, customSalt) {
        let frontEndDifficulty = "13"
        return bcrypt.hashSync(string, "$2a$" + frontEndDifficulty + "$" + new Hashes.SHA512().hex(customSalt).substring(0, 22));
    },
    fastBcryptHash(string){
        let salt = bcrypt.genSaltSync(Meteor.settings.public.fastHashDifficulty);
        return bcrypt.hashSync(string, salt);
    },
//fonction permettant de générer un mot de passe aléatoire
    generateRandomPassword(length) {
        let randomLength = 30 + Math.floor(Math.random() * 10)
        length = length || randomLength
        let password = randomPassword.randomPassword({length: length, characters: [randomPassword.lower, randomPassword.upper, randomPassword.digits] })
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
    },
    /***********************
     * chiffre unelement a partir de l'encryption params si les conventions de nommage sont bonnes
     * @param element   --- le contenu à chiffrer
     * @param elementName --- le nom de l'element pour récuperer le préfixe
     * @param encryptionParams  --- un objet comprenant {simkey, publicKey, vector} (pas obligé de toutes les avoir)
     * @param callback
     * @returns {Promise<void>}
     */
    async encryptElement(element, elementName, encryptionParams) {
        let elementType = typeof element
        let encryptedElement
        if (elementType == "string" || elementType == "number") {
            let prefix = elementName.split('_')[0]
            if (prefix == 'symEnc') {
                let iv = this.crypto().getRandomValues(new Uint8Array(16))
                encryptedElement = new Promise((resolve, reject) => {
                    crypto.subtle.encrypt({
                        name: "AES-CBC",
                        iv: iv
                    }, encryptionParams.symKey, this.convertStringToArrayBufferView(element)).then(
                        (result) => {
                            resolve(this.convertArrayBufferViewtoString(iv) + this.convertArrayBufferViewtoString(new Uint8Array(result)));
                        },
                        function (e) {
                            console.log(e.message);
                        }
                    );
                })
            } else if (prefix == 'asymEnc') {
                encryptedElement = new Promise((resolve, reject) => {
                    let saltedPrefix = this.generateRandomPassword(10)
                    this.crypto().subtle.encrypt({"name": "RSA-OAEP", hash: {name: 'SHA-256'}}, encryptionParams.publicKey, this.convertStringToArrayBufferView(saltedPrefix + element)).then(
                        (result) => {
                            resolve(this.convertArrayBufferViewtoString(new Uint8Array(result)))
                        },
                        function (e) {
                            console.log(e.message);
                        }
                    );
                })
            } else {
                encryptedElement = new Promise((resolve, reject) => {
                    resolve(element)
                })
            }
        } else {
            encryptedElement = new Promise((resolve, reject) => {
                resolve(element)
            })
            console.warn("'on s'occupe que des champs simples pour l'instant'")
        }
        return encryptedElement
    },
    /**************************
     * promise qui est utilisable comme callback et qui viens importer les clefs d'un objet encryption params
     * @param encryptionParams
     * @param callback
     */
    importEncryptionParams(encryptionParams, callback) {
        let workingEncryptionParams = {}
        let encryptionParamsKeys = []
        let importKeysPromises = []
        //on boucle sur les clefs et on renvoie la promise qui va bien pour l'importer suivant la clef et on met tout ca dans un array
        Object.keys(encryptionParams).forEach(key => {
            encryptionParamsKeys.push(key)
            if (key === "symKey") {
                importKeysPromises.push(this.importSymKey(encryptionParams[key], (res) => {
                    workingEncryptionParams[key] = res
                }))
            } else if (key === "publicKey") {
                importKeysPromises.push(this.importPublicKey(encryptionParams[key], (res) => {
                    workingEncryptionParams[key] = res
                }))
            } else if (key === "privateKey") {
                importKeysPromises.push(this.importPrivateKey(encryptionParams[key], (res) => {
                    workingEncryptionParams[key] = res
                }))
            } else {
                console.warn("the encryption params are not valid", encryptionParams)
            }
        })

        //on renvoie la promise et surtout on passe l'objet avec toutes les clefs en callback lorsque toutes les promises ont étés executées
        return Promise.all(importKeysPromises).then((arrOfKeys) => {
            callback(workingEncryptionParams)
        })

    },
    /************************
     * fonction permettant de chiffrer tout les couples clef valeur d'un objet suivant les prefixes des clefs
     * @param object ---l'objet a chiffrer
     * @param encryptionParams -------les clefs
     * @param callback ------renvoie l'objet chiffré
     */
    encryptObject(object, encryptionParams, callback) {
        this.importEncryptionParams(encryptionParams, workingEncryptionParams => {
            let promiseArray = []
            let objectKeys = []
            Object.keys(object).forEach(key => {
                objectKeys.push(key)
                promiseArray.push(this.encryptElement(object[key], key, workingEncryptionParams))
            })
            Promise.all(promiseArray).then(arrOfEncryptedElements => {
                let encryptedObject = {}
                arrOfEncryptedElements.forEach((encryptedElement, i) => {
                    encryptedObject[objectKeys[i]] = encryptedElement
                })
                callback(encryptedObject)
            })
        })
    },
    /********************
     * dechiffre un element a partir du decryption params si les conventions de nommage sont bonnes et renvoie une promise dont la résolution contient l'element déchiffré
     * @param element   --- le contenu à dechiffrer
     * @param elementName --- le nom de l'element pour récuperer le préfixe
     * @param encryptionParams  --- un objet comprenant {simkey, privateKey, vector} (pas obligé de toutes les avoir)
     * @param callback
     * @returns {Promise<void>}
     */
    async decryptElement(element, elementName, encryptionParams) {
        let elementType = typeof element
        let decryptedElement
        if (elementType === "string" || elementType === "number") {
            let prefix = elementName.split('_')[0]
            if (prefix === 'symEnc') {
                decryptedElement = new Promise((resolve, reject) => {
                    let iv = this.convertStringToArrayBufferView(element.substring(0, 16))
                    let cypherText = this.convertStringToArrayBufferView(element.substring(16))
                    return this.crypto().subtle.decrypt({
                        name: "AES-CBC",
                        iv: iv
                    }, encryptionParams.symKey, cypherText).then(
                        (result) => {
                            resolve(this.convertArrayBufferViewtoString(new Uint8Array(result)));
                        },
                        function (e) {
                            console.log("decryptObject : sym decrypt faillure", e,elementName)
                        }
                    );
                })
            } else if (prefix === 'asymEnc') {
                decryptedElement = new Promise((resolve, reject) => {
                    this.crypto().subtle.decrypt({name: "RSA-OAEP", hash: {name: 'SHA-256'}}, encryptionParams.privateKey, this.convertStringToArrayBufferView(element)).then(
                        (result) => {
                            resolve(this.convertArrayBufferViewtoString(new Uint8Array(result)).substring(10));
                        },
                        function (e) {
                            console.error("decryptObject : asym decrypt faillure", e)
                        }
                    );
                })
            } else {
                decryptedElement = new Promise((resolve, reject) => {
                    resolve(element)
                })
            }
        } else {
            decryptedElement = new Promise((resolve, reject) => {
                resolve(element)
            })
            if (element) {
                // console.log(typeof element)
                // console.warn("'on s'occupe que des champs simples pour l'instant'", elementName, element)
            }

        }
        return decryptedElement
    },
    /***************
     * fonction permettant de dechiffrer tout les couples clef valeur d'un objet suivant les prefixes des clefs
     * @param object ---l'objet a deciffrer
     * @param decryptionParams -------les clefs
     * @param callback ------renvoie l'objet dechiffré
     */
    async decryptObject(object, decryptionParams, callback) {
        this.importEncryptionParams(decryptionParams, workingDecryptionParams => {
            let promiseArray = []
            let objectKeys = []
            Object.keys(object).forEach(key => {
                objectKeys.push(key)
                promiseArray.push(this.decryptElement(object[key], key, workingDecryptionParams))
            })
            Promise.all(promiseArray).then(arrOfEncryptedElements => {
                let decryptedObject = {}
                arrOfEncryptedElements.forEach((decryptedElement, i) => {
                    decryptedObject[objectKeys[i]] = decryptedElement
                })
                callback(decryptedObject)
            })
        })
    },
    initResObject(array){
        let res = {}
        array.forEach((el,i)=>{
            res[i] = null
        })
        return res
    },
    returnRes(resObject,el,i, callback){
        resObject[i] = el
        let completed = true
        Object.keys(resObject).forEach((key)=>{
            if(resObject[key] == null){
                completed = false
            }
        })
        if(completed){
            let res = []
            Object.keys(resObject).forEach((key,val)=>{
                res.push(resObject[key])
            })
            callback(res)
        }
    },
    //dechiffre un tableau d'objet chiffrés et les renvoie en callback
    async decryptArrayOfObject(arrayOfObject, decryptionParams, callback) {
        let tempObject = this.initResObject(arrayOfObject)
        await this.asyncForEach(arrayOfObject, async (object, i) => {
            await this.decryptObject(object, decryptionParams, (decryptedObject) => {
                this.returnRes(tempObject,decryptedObject,i, callback)
            })
        })
    }
    ,
    async encryptArrayOfObject(arrayOfObject, encryptionParams, callback) {
        let tempObject = this.initResObject(arrayOfObject)
        await this.asyncForEach(arrayOfObject, async (object, i) => {
            await this.encryptObject(object, encryptionParams, (encryptedObject) => {
                this.returnRes(tempObject,encryptedObject,i, callback)
            })
        })
    },

    async encryptStringArray(StringArray, stringifiedSymKey, callback){
        let tempObject = this.initResObject(StringArray)
        await this.asyncForEach(StringArray, async (string, i) => {
            await this.sim_encrypt_data(string, stringifiedSymKey, (encryptedString) => {
                this.returnRes(tempObject,encryptedString,i, callback)
            })
        })
    },
    async decryptStringArray(StringArray, stringifiedSymKey, callback){
        let tempObject = this.initResObject(StringArray)
        await this.asyncForEach(StringArray, async (string, i) => {
            await this.sim_decrypt_data(string, stringifiedSymKey, (decryptedString) => {
                this.returnRes(tempObject,decryptedString,i, callback)
            })
        })
    },
    /******************
     * on stocke ici notre objet zxcvbn qui gere la difficulté des password
     */
    zxcvbn: zxcvbn,
    getNavigatorFingerPrint() {
        return cryptoTools.hash(
            navigator.vendor +
            navigator.platform +
            navigator.hardwareConcurrency +
            navigator.deviceMemory +
            navigator.appCodeName +
            navigator.appName +
            window.localStorage.getItem("hashedPassword")
        )
    },
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
