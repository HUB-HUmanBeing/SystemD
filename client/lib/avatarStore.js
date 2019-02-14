const avatarStore = {
    inProgress: {},
    getUserAvatar(userId) {


        let avatars = Session.get('userAvatars')

        if (avatars[userId]) {
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
        // }

    },
    findAvatarInServer(userId, cb) {
        Meteor.call('getMinioUserAvatarUrl', userId, (err, res) => {
            if (!err) {
                console.log(res)
                cb(res)

            } else {
                console.log(err)
            }

        })
    },
    updateUserAvatar(userId) {
        let avatars = Session.get('userAvatars')
        this.findAvatarInServer(userId, (avatarUrl) => {
            avatars[userId] = avatarUrl
            Session.set('userAvatars', avatars)
        })
    },
    deleteUserAvatar(userId) {
        let avatars = Session.get('userAvatars')
        avatars[userId] = undefined
        Session.set('userAvatars', avatars)

    }
}
export default avatarStore
