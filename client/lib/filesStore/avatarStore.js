/************************
 * Objet permettant de gérer l'upload des liens d'avatars utilisateurs de manière optimale afin de ne pas faire de requetes exessives
 * @type {{updateUserAvatar(*=): void, deleteUserAvatar(*): void, inProgress: {}, findAvatarInServer(*=, *): void, getUserAvatar(*=): (*|undefined)}}
 */
const avatarStore = {
    //Permet de stocher les requetes en cours afin de ne pas faire de doublons
    inProgress: {},
    /**********
     * Methode d'interface permettant de récuperer l'url signée de l'avatar,
     * en la puiochant dans la Session ou via une requete au serveur si c'est nécessaire
     * @param userId
     * @returns {*}
     */
    getUserAvatar(userId) {
        let avatars = Session.get('userAvatars')||{}

        if (avatars && avatars[userId]) {
            return avatars[userId]
        } else {
            if (!this.inProgress[userId]) {
                this.inProgress[userId] = true

                this.findAvatarInServer(userId, (avatarUrl) => {
                    avatars[userId] = avatarUrl
                    Session.set('userAvatars', avatars)
                    this.inProgress[userId] = false
                })
            }
        }
    },
    /*******
     * Metode appelant une requete vers le serveur pour l'avatar de l'utilisateur souhaité
     * @param userId
     * @param cb
     */
    findAvatarInServer(userId, cb) {
        Meteor.call('getMinioUserAvatarUrl', userId, (err, res) => {
            if (!err) {
                cb(res)
            } else {
                console.log(err)
            }

        })
    },
    /*******************
     * methode utilisée pour actualiser l'avatar d'un user apres un edit
     * @param userId
     */
    updateUserAvatar(userId) {
        let avatars = Session.get('userAvatars')
        this.findAvatarInServer(userId, (avatarUrl) => {
            avatars[userId] = avatarUrl
            Session.set('userAvatars', avatars)
        })
    },
    /*******************
     * methode utilisée pour actualiser l'avatar d'un user apres un delete
     * @param userId
     */
    deleteUserAvatar(userId) {
        let avatars = Session.get('userAvatars')
        avatars[userId] = false
        Session.set('userAvatars', avatars)

    }
}

export default avatarStore
