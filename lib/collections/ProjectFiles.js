const ProjectFiles= new Mongo.Collection('projectFiles');
ProjectFiles.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default ProjectFiles
