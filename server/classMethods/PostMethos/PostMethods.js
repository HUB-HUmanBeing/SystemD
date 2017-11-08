import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Post from '/imports/classes/Post';

Post.extend({
    meteorMethods: {
        createPost(isProject,author_id, title, content,isImageWide,imageUrl){
            let currentUser = Meteor.user();
            check(isProject, Boolean);
            this.isProject= isProject;
            check(author_id, String);
            if(isProject){
                let project = Project.findOne({_id : author_id});
                check(project.isAdmin(currentUser._id), true);
                this.author_id =  author_id;
                this.lonLat= project.publicInfo.location.lonLat;
            }else{
                check(currentUser._id, author_id )
                this.author_id = author_id;
                this.author_id =  author_id;
                this.lonLat= currentUser.profile.location.lonLat;
            }
            check(title, String);
            this.title= title;
            check(content, String);
            this.content=content;
            check(isImageWide, Boolean);
            this.isImageWide = isImageWide;
            check(imageUrl, String);
            this.imageUrl = imageUrl;
            return this.save()
        }
    }
});
