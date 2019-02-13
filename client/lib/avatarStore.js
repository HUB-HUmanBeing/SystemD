
const avatarStore= {
    getUserAvatar(userId){
        let avatars = Session.get('userAvatars')

        if(avatars[userId]){
            return avatars[userId]
        }else{
           this.findAvatarInServer(userId, (avatarUrl)=>{
               avatars[userId] = avatarUrl
               Session.set('userAvatars', avatars)
           })
        }
    },
    findAvatarInServer(userId, cb){
        Meteor.call('getMinioUserAvatarUrl', userId, (err, res)=>{
            if(!err){
                console.log(res)
                cb(res)

            }else{
                console.log(err)
            }

        })
    },
    updateUserAvatar(userId){
        let avatars = Session.get('userAvatars')
        this.findAvatarInServer(userId, (avatarUrl)=>{
            avatars[userId] = avatarUrl
            Session.set('userAvatars', avatars)
        })
    }
}
export default avatarStore
