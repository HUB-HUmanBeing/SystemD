import jexcel from "jexcel";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import cryptoTools from "../cryptoTools";

let spreadsheetController = {
    table: null,
    id:null,
    columns:[],
    rows:1,
    datas:[[],[],[],[],[],[],[],[],[],[]],
    initialize(spreadsheetId,el, instance){
        this.id = spreadsheetId
        instance.autorun(() => {
            let encryptedSpreadsheetContent = Spreadsheet.findOne({_id: spreadsheetId}).content
            cryptoTools.decryptObject(encryptedSpreadsheetContent, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
                let newColumns = JSON.parse(spreadsheetContent.columns)
                if(newColumns.length){
                    if(this.columns!=newColumns){
                        this.columns=newColumns
                        console.log('todo: updateColumns')
                    }
                }else{
                    this.columns=this.defaultColumns()
                    this.saveColumns()
                }
                let newRows = JSON.parse(spreadsheetContent.rows)
                if(newRows.length){
                    if(this.rows!=newRows){
                        this.rows=newRows
                        console.log('todo: updateRows')
                    }
                }else{
                    this.rows=this.defaultRows()
                    this.saveRows()
                }

                    this.createTable(el)

                console.log(this.table.getConfig())
            })
        })



    },
    createTable(el){
        console.log(this.rows)
        this.table = jexcel(el, {
            data:this.datas,
            columns:this.columns,
            rows:this.rows,
            copyCompatibility:true,
            allowExport:true,
            editable:true,
            //search:true,
            toolbar:[
                {
                    type: 'i',
                    content: 'undo',
                    onclick: function() {
                        this.table.undo();
                    }
                },
                {
                    type: 'i',
                    content: 'redo',
                    onclick: function() {
                        this.table.redo();
                    }
                },
                {
                    type: 'i',
                    content: 'save',
                    onclick: function () {
                        this.table.download();
                    }
                },
                {
                    type: 'select',
                    k: 'font-size',
                    v: ['9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px']
                },
                {
                    type: 'i',
                    content: 'format_align_left',
                    k: 'text-align',
                    v: 'left'
                },
                {
                    type:'i',
                    content:'format_align_center',
                    k:'text-align',
                    v:'center'
                },
                {
                    type: 'i',
                    content: 'format_align_right',
                    k: 'text-align',
                    v: 'right'
                },
                {
                    type: 'i',
                    content: 'format_bold',
                    k: 'font-weight',
                    v: 'bold'
                },
                {
                    type: 'color',
                    content: 'format_color_text',
                    k: 'color'
                },
                {
                    type: 'color',
                    content: 'format_color_fill',
                    k: 'background-color'
                },
            ],
        });
    },
    destroy(el){
        jexcel.destroy(el, false);
    },
    defaultColumns(){
        let res =[]
        for (let i = 0; i < 10; i++) {
            res.push({width:120})
        }
        return res
    },
    defaultRows(){
        let res =[]
        for (let i = 0; i < 100; i++) {
            res.push({height:30})
        }
        return res
    },
    saveColumns(){
        console.log('todo: saveColumns')
    },
    saveRows(){
        console.log('todo: saveRows')
    }


}



export default spreadsheetController
