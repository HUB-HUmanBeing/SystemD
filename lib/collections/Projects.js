const Projects = new Mongo.Collection('projects');
Projects.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Projects
