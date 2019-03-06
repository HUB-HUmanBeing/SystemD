/************************
 * Objet permettant de gérer l'upload des liens d'avatars projets de manière optimale afin de ne pas faire de requetes exessives
*/
const projectAvatarStore = {
    //Permet de stocher les requetes en cours afin de ne pas faire de doublons
    inProgress: {},
    /**********
     * Methode d'interface permettant de récuperer l'url signée de l'avatar,
     * en la puiochant dans la Session ou via une requete au serveur si c'est nécessaire
     * @param projectId
     * @returns {*}
     */
    getProjectAvatar(projectId) {

        let avatars = Session.get('projectAvatars')||{}

        if (avatars && avatars[projectId] ) {
            return avatars[projectId]
        } else {
            if (!this.inProgress[projectId]) {
                this.inProgress[projectId] = true

                this.findAvatarInServer(projectId, (avatarUrl) => {
                    avatars[projectId] = avatarUrl
                    Session.set('projectAvatars', avatars)
                    this.inProgress[projectId] = false
                })
            }
        }
    },
    /*******
     * Metode appelant une requete vers le serveur pour l'avatar du projet souhaité
     * @param projectId
     * @param cb
     */
    findAvatarInServer(projectId, cb) {
        Meteor.call('getMinioProjectAvatarUrl', projectId, (err, res) => {
            if (!err) {
                cb(res)
            } else {
                console.log(err)
            }

        })
    },
    /*******************
     * methode utilisée pour actualiser l'avatar d'un project apres un edit
     * @param projectId
     */
    updateProjectAvatar(projectId) {
        let avatars = Session.get('projectAvatars')
        this.findAvatarInServer(projectId, (avatarUrl) => {
            avatars[projectId] = avatarUrl
            Session.set('projectAvatars', avatars)
        })
    },
    /*******************
     * methode utilisée pour actualiser l'avatar d'un project apres un delete
     * @param projectId
     */
    deleteProjectAvatar(projectId) {
        let avatars = Session.get('projectAvatars')
        avatars[projectId] = false
        Session.set('projectAvatars', avatars)

    }
}

export default projectAvatarStore
