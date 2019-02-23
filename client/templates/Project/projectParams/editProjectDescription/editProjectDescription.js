import MediumEditor from 'medium-editor';
import MediumEditorOptions from "../../../../lib/MediumEditorOptions";

Template.editProjectDescription.helpers({
    //add you helpers here
});

Template.editProjectDescription.events({
    //add your events here
});

Template.editProjectDescription.onCreated(function () {
    //add your statement here
});

Template.editProjectDescription.onRendered(function () {
    //add your statement here
    resetTooltips();
    this.editor = new MediumEditor('.editable', MediumEditorOptions)
    let currentProject =Template.currentData().currentProject
    this.initialText = currentProject.public.description
});

Template.editProjectDescription.onDestroyed(function () {
    //add your statement here
    this.editor.destroy();
    resetTooltips();
});

