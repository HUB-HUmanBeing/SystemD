hubCrypto = {
    generateUserAsymKeys(password, callback) {
        let UserAsymKeys = {
            asymPublicKey: null,
            encryptedAsymPrivateKey: null
        }
        cryptoTools.generateAsymKey((keyObject) => {
            cryptoTools.getExportableKey(keyObject.publicKey, (exportablePublicKey)=>{
                UserAsymKeys.asymPublicKey = exportablePublicKey
                cryptoTools.generateSimKeyFromPassphrase(password, (simKey)=>{
                    cryptoTools.getExportableKey(keyObject.privateKey, (exportablePrivateKey)=> {
                        cryptoTools.sim_encrypt_data(exportablePrivateKey, simKey, (unit8encryptedPrivateKey)=>{
                            encryptedAsymPrivateKey = cryptoTools.convertArrayBufferViewtoStringifiedArray(unit8encryptedPrivateKey)
                            UserAsymKeys.encryptedAsymPrivateKey = encryptedAsymPrivateKey
                            callback(UserAsymKeys)
                        })
                    })
                })

            })

        })
    },
    storePrivateKeyInSession(password, callback){
        cryptoTools.generateSimKeyFromPassphrase(password, (simKey)=>{
            let encryptedAsymPrivateKey = cryptoTools.convertStringifiedArrayToArrayBufferView(Meteor.user().profile.encryptedAsymPrivateKey)
            cryptoTools.sim_decrypt_data(encryptedAsymPrivateKey, simKey, (stringifiedAsymPrivateKey)=>{
                Session.set("AsymPrivateKey", JSON.parse(stringifiedAsymPrivateKey))
                callback()
            })
        })
    }
}