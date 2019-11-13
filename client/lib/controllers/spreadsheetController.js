import jexcel from "jexcel";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import cryptoTools from "../cryptoTools";

let spreadsheetController = {
    table: null,
    id:null,
    columns:[],
    rows:1,
    datas:[],
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
                if(spreadsheetContent.symEnc_datas && JSON.parse(spreadsheetContent.symEnc_datas).length){
                    let newDatas = JSON.parse(spreadsheetContent.symEnc_datas)
                    if(this.rows!=newDatas){
                        this.datas=newDatas
                        console.log('todo: updateRows')
                    }
                }else{
                    this.datas=this.defaultDatas()
                    this.saveDatas()
                }

                this.createTable(el)

                console.log(this.table.getConfig())
            })
        })



    },
    createTable(el){
        console.log(this.rows)
        let table
        this.table= table = jexcel(el, {
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
                        table.undo();
                    }
                },
                {
                    type: 'i',
                    content: 'redo',
                    onclick: function() {
                        table.redo();
                    }
                },
                {
                    type: 'i',
                    content: 'save',
                    onclick: function () {
                        console.log(table.getJson())
                        //this.table.download();
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
    defaultDatas(){
        let res =[]
        for (let i = 0; i < 60; i++) {
            res.push([""])
        }
        return res
    },
    saveColumns(){
        console.log('todo: saveColumns')
    },
    saveDatas(){
        console.log('todo: saveRows')
    }


}



export default spreadsheetController
