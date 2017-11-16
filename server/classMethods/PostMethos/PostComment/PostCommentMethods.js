import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Post from '/imports/classes/Post';
import PostComment from  '/imports/classes/PostComment';
PostComment.extend({
    meteorMethods: {
        newComment(post_id, content, author_id,isProject){
            check(post_id , String)
            this.post_id = post_id
            let commentedPost = Post.findOne({_id : post_id})
            check(content, String)
            this.content = content
            check(author_id, String)
            check(isProject, Boolean)
            let user_id = Meteor.userId()
            check(user_id, String)
            this.user_id = user_id
            let user = User.findOne({_id : userId})
            this.username = user.username

        }
    }
})