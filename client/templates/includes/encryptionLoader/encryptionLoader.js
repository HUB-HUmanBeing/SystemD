Template.encryptionLoader.helpers({
    //add you helpers here
    tasks : function () {
        return Template.instance().tasks.get()
    }
});

Template.encryptionLoader.events({
    //add your events here
});

Template.encryptionLoader.onCreated(function () {
    //add your statement here
    let tasks = []

    Template.currentData().tasks.forEach((task)=>{
        tasks.push({name : task, status:undefined})
    })
    this.tasks = new ReactiveVar(tasks)
});

Template.encryptionLoader.onRendered(function () {
    //add your statement here

    this.step= -1
   nextStep = ()=>{
       let tasks = this.tasks.get()
        if (this.step>=0 && this.step<tasks.length-1){
            tasks[this.step].status='done'
        }
        if (this.step<tasks.length-1 ){
            tasks[this.step+1].status ="loading";
            this.step ++

                Meteor.setTimeout(()=>{
                    nextStep()
                },1000)


        }
        this.tasks.set(tasks)
    }
    nextStep()

});

Template.encryptionLoader.onDestroyed(function () {
    //add your statement here
});

