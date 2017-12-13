cryptoTools = {
    //permet de recuperer l'object crypto suivant le navigateur
    crypto() {
        let crypto = window.crypto || window.msCrypto || window.webkitCrypto;
        if (crypto.subtle) {
            return crypto
        } else {
            console.log("API crypto Not Supported")
        }

    },
    //vecteur d'initialisation utilisé pour les chiffrements symetriques
    vectorFromString(str) {
        vectorPhrase = str + "Le pari d’une humanité de la collaboration et du partage";
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
    //transforme un arrayBuffer en string
    convertArrayBufferViewtoStringifiedArray(buffer) {
        let array = [];
        for (let iii = 0; iii < buffer.byteLength; iii++) {
            array.push(buffer[iii]);
        }
        return JSON.stringify(array);
    },
    //transforme une string en arrayBuffer
    convertStringifiedArrayToArrayBufferView(stringifiedArray) {
        let array = JSON.parse(stringifiedArray)
        let bytes = new Uint8Array(array.length);
        for (let iii = 0; iii < array.length; iii++) {
            bytes[iii] = array[iii];
        }
        return bytes;
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
    asym_encrypt_data(data, public_key_object, callback) {

        crypto = this.crypto()
        let encrypt_promise = this.crypto().subtle.encrypt({"name": "RSA-OAEP"}, public_key_object, this.convertStringToArrayBufferView(data));

        encrypt_promise.then(
            function (result) {

                callback(new Uint8Array(result))
            },
            function (e) {
                console.log(e.message);
            }
        );
    },
    asym_decrypt_data(encrypted_data, private_key_object, callback) {
        let decrypt_promise = this.crypto().subtle.decrypt({name: "RSA-OAEP"}, private_key_object, encrypted_data);

        decrypt_promise.then(
            (result) => {
                callback(this.convertArrayBufferViewtoString(new Uint8Array(result)));
            },
            function (e) {
                console.log(e.message);
            }
        );
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
    importSymKey(string_key,vector, callback) {
        this.crypto().subtle.importKey(
            "jwk",
            JSON.parse(string_key),
            {name: "AES-CBC", iv: vector},
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
            this.crypto().subtle.importKey("raw", result, {name: "AES-CBC"}, false, ["encrypt", "decrypt"]).then(function (e) {
                callback(e)
            }, function (e) {
                console.log(e);
            });

        });
    },
    //fonction de chiffrement symétrique en AES
    sim_encrypt_data(data, simKey, vector, callback) {
        crypto.subtle.encrypt({
            name: "AES-CBC",
            iv: this.vectorFromString(vector)
        }, simKey, this.convertStringToArrayBufferView(data)).then(
            function (result) {
                callback(new Uint8Array(result));
            },
            function (e) {
                console.log(e.message);
            }
        );
    },
    //fonction de dechiffrement de données
    sim_decrypt_data(encryptedData, simKey, vector, callback) {
        this.crypto().subtle.decrypt({name: "AES-CBC", iv: this.vectorFromString(vector)}, simKey, encryptedData).then(
            (result) => {
                callback(this.convertArrayBufferViewtoString(new Uint8Array(result)));
            },
            function (e) {

            }
        );
    }

}