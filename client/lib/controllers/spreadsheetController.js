import jexcel from "jexcel";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import cryptoTools from "../cryptoTools";

let spreadsheetController = {
    table: null,
    id: null,
    columns: [],
    rows: 1,
    datas: [],

    initialize(spreadsheetId, el, instance, isEditable) {
        this.id = spreadsheetId
        instance.autorun(() => {
            let encryptedSpreadsheetContent = Spreadsheet.findOne({_id: spreadsheetId}).content
            cryptoTools.decryptObject(encryptedSpreadsheetContent, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
                let newColumns = JSON.parse(spreadsheetContent.columns)
                if (newColumns.length) {
                    if (this.columns != newColumns) {
                        this.columns = newColumns
                        console.log('todo: updateColumns')
                    }
                } else {
                    this.columns = this.defaultColumns()
                    this.saveColumns()
                }
                if (spreadsheetContent.symEnc_datas && JSON.parse(spreadsheetContent.symEnc_datas).length) {
                    let newDatas = JSON.parse(spreadsheetContent.symEnc_datas)
                    if (this.rows != newDatas) {
                        this.datas = newDatas
                        console.log('todo: updateRows')
                    }
                } else {
                    this.datas = this.defaultDatas()
                    this.saveDatas()
                }

                this.createTable(el, isEditable)

                console.log(this.table.getConfig())
            })
        })


    },
    createTable(el, isEditable) {
       if(this.table){
           this.destroy(el)
       }
        let table
        this.table = table = jexcel(el, {
            data: this.datas,
            columns: this.columns,
            rows: this.rows,
            copyCompatibility: true,
            allowExport: true,
            editable: isEditable,
            //search:true,
            onselection: this.selectionActive,
            toolbar: this.toolbar(isEditable)
        });
    },
    destroy(el) {
        jexcel.destroy(el, false);
    },
    defaultColumns() {
        let res = []
        for (let i = 0; i < 20; i++) {
            res.push({width: 120})
        }
        return res
    },
    defaultDatas() {
        let res = []
        for (let i = 0; i < 60; i++) {
            res.push([""])
        }
        return res
    },
    saveColumns() {
        console.log('todo: saveColumns')
    },
    saveDatas() {
        console.log('todo: saveRows')
    },
    selectionActive: function (instance, x1, y1, x2, y2, origin) {

    },


    toolbar(isEditable) {
        let commonItems =  [
                {
                    type: 'i',
                    content: 'undo',
                    onclick: function () {
                        table.undo();
                    }
                },
                {
                    type: 'i',
                    content: 'redo',
                    onclick: function () {
                        table.redo();
                    }
                },
                {
                    type: 'i',
                    content: 'file_upload',
                    onclick: function () {
                        console.log(table.getJson())
                        //this.table.download();
                    }
                },
                {
                    type: 'select',
                    k: 'font-size',
                    v: ['9px', '10px', '11px', '12px', '13px', '14px', '16px', '18px', '21px', '26px', '36px']
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
                {
                    type: 'i',
                    content: 'format_align_left',
                    k: 'text-align',
                    v: 'left'
                },
                {
                    type: 'i',
                    content: 'format_align_center',
                    k: 'text-align',
                    v: 'center'
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
                    type: 'i',
                    content: 'format_italic',
                    k: 'font-style',
                    v: 'italic'
                },
                {
                    type: 'i',
                    content: 'zoom_out_map',
                    onclick: function () {
                        if (
                            document.fullscreenElement ||
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement ||
                            document.msFullscreenElement
                        ) {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            } else if (document.msExitFullscreen) {
                                document.msExitFullscreen();
                            }
                        } else {
                            let element = $('#spreadsheetContent').get(0);
                            if (element.requestFullscreen) {
                                element.requestFullscreen();
                            } else if (element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else if (element.webkitRequestFullscreen) {
                                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                            } else if (element.msRequestFullscreen) {
                                element.msRequestFullscreen();
                            }
                        }
                    }
                },

            ]
        if (isEditable){
            return commonItems
        }else{
            let items = [0,1,3,4,5,6,7,8,9]
            let res = []
            items.forEach((number,i)=>{
                res.push(commonItems[number])
            })
            return res
        }
    }
}


export default spreadsheetController
