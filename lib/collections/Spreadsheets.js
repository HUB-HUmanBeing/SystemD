const Spreadsheets = new Mongo.Collection('spreadsheets');
Spreadsheets.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Spreadsheets
