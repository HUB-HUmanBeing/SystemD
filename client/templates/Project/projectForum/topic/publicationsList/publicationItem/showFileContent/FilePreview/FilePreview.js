import filesTypes from "../../../../../../../../lib/filesTypes";
import projectFilesController from "../../../../../../../../lib/projectFilesController";

Template.filePreview.helpers({
    //add you helpers here
});

Template.filePreview.events({
    //add your events here
});

Template.filePreview.onCreated(function () {
    //add your statement here
});

Template.filePreview.onRendered(function () {
    //add your statement here
    let file =  Template.currentData().file

   filesTypes.forEach(fileType=>{
       if(fileType.mimes.indexOf(file.symEnc_mimeType)>-1){
           switch (fileType.label) {
               case "image":
                   projectFilesController.getFile(file, (res)=>{
                       console.log(res)
                   })
                   break;
               default:
                   break;

           }
       }
   })

});

Template.filePreview.onDestroyed(function () {
    //add your statement here
});

