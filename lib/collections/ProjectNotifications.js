const ProjectNotifications = new Mongo.Collection('projectNotifications');
ProjectNotifications.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default ProjectNotifications
