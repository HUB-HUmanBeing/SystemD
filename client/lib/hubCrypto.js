hubCrypto = {
    crypto() {
        let crypto = window.crypto || window.msCrypto;
        return crypto
    },
    vector: null,
    encrypt_promise: null,
    encrypted_data: null,
    convertStringToArrayBufferView(str) {
        let bytes = new Uint8Array(str.length);
        for (let iii = 0; iii < str.length; iii++) {
            bytes[iii] = str.charCodeAt(iii);
        }
        return bytes;
    },
    convertArrayBufferViewtoString(buffer) {
        let str = "";
        for (let iii = 0; iii < buffer.byteLength; iii++) {
            str += String.fromCharCode(buffer[iii]);
        }

        return str;
    },
    /**************************************************
     * génération d'un couple clef publique-clef privé contenu dans l'argument de la callback
     *
     * @param callback callback avec objet key
     */
    generatePublicAndPrivateKey(callback) {

        let promise_key = null;
        let crypto = this.crypto()
        if (crypto.subtle) {
            console.log("Cryptography API Supported");
            //Parameters:
            //1. Asymmetric Encryption algorithm name and its requirements
            //2. Boolean indicating extractable. which indicates whether or not the raw keying material may be exported by the application (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
            //3. Usage of the keys. (http://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
            promise_key = crypto.subtle.generateKey({
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

        }
        else {
            console.log("Cryptography API not Supported");
        }
    },
    encrypt_data(data, public_key_object, callback) {
        //iv: Is initialization vector. It must be 16 bytes
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
    decrypt_data(encrypted_data, private_key_object, callback) {
        let decrypt_promise = this.crypto().subtle.decrypt({name: "RSA-OAEP"}, private_key_object, encrypted_data);

        decrypt_promise.then(
            (result)=> {
                decrypted_data = new Uint8Array(result);
                callback(this.convertArrayBufferViewtoString(new Uint8Array(result)));
            },
            function (e) {
                console.log(e.message);
            }
        );
    },
    getExportableKey(keyObject, callback){
        this.crypto().subtle.exportKey("jwk", keyObject).then(function(result){
            callback(JSON.stringify(result))
        }, function(e){
            console.log(e.message);
        });
    },
    importKey(string_private_key, callback){
        this.crypto().subtle.importKey("jwk", JSON.parse(string_private_key), {name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([0x01, 0x00, 0x01]), hash: {name: "SHA-256"}}, true, ["decrypt"]).then(
            function(result){
            callback(result)
        }, function(e){
            console.log(e);
        });
    }
}