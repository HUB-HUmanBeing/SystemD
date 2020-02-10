const ItemComments = new Mongo.Collection('itemComments');
ItemComments.deny({
    insert() {return true;},
    update() {return true;},
    remove() {return true;}
});
export default ItemComments