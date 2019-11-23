import jexcel from "jexcel";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import cryptoTools from "../cryptoTools";
import projectController from "./projectController";

let spreadsheetController = {
    table: null,
    reactiveTable: null,
    id: null,
    columns: [],
    rows: 1,
    datas: [],

    initialize(spreadsheetId, el, instance, isEditable) {
        this.id = spreadsheetId

        let encryptedSpreadsheetContent = Spreadsheet.findOne({_id: spreadsheetId}).content
        cryptoTools.decryptObject(encryptedSpreadsheetContent, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
            let newColumns = JSON.parse(spreadsheetContent.columns)

            if (spreadsheetContent.symEnc_datas && JSON.parse(spreadsheetContent.symEnc_datas).length) {
                let newDatas = JSON.parse(spreadsheetContent.symEnc_datas)
                if (this.rows != newDatas) {
                    this.datas = newDatas
                    console.log('todo: updateRows')
                }
            } else {
                this.datas = this.defaultDatas()
                this.saveDatas(this.datas)
            }
            if (newColumns.length) {
                if (this.columns != newColumns) {
                    this.columns = newColumns
                    console.log('todo: updateColumns')
                }
            } else {
                this.columns = this.defaultColumns()
                this.saveColumns(this.datas, this.columns)
            }
            if(spreadsheetContent.style){
                this.style = JSON.parse(spreadsheetContent.style)

            }

            this.createTable(el, isEditable, instance)
        })


    },
    createTable(el, isEditable, instance) {
        console.log(this.table)
        if (this.table) {
            this.destroy(el)
        }

        let tableOptions = {
            data: this.datas,
            columns: this.columns,
            rows: this.rows,
            copyCompatibility: true,
            allowExport: true,
            editable: isEditable,
            //search:true,
            toolbar: this.toolbar(isEditable),

        }
        if (!isEditable) {
            tableOptions.contextMenu = function (obj, x, y, e) {
                return []
            }

        } else {
            tableOptions = {...tableOptions, ...this.events}
        }
        console.log(this.style)

        table = jexcel(el, tableOptions);

        this.table = table
        if(this.style){
            table.setStyle( this.style)
        }
        if (!isEditable) {
            this.checkForUpdates(instance)
        }
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

    toolbar(isEditable) {
        let commonItems = [
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
                onclick() {
                    table.redo();
                }
            },
            {
                type: 'i',
                content: 'file_upload',
                onclick() {
                    console.log(table.getJson())
                    table.download();
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
        if (isEditable) {
            return commonItems
        } else {
            let items = [2, 11]
            let res = []
            items.forEach((number, i) => {
                res.push(commonItems[number])
            })
            return res
        }
    },
    events: {
        onchange: () => {

            spreadsheetController.saveDatas(this.table.getJson())
        },
        ondeleterow: () => {
            spreadsheetController.saveRows(this.table.getJson())
        },
        oninsertrow: () => {
            spreadsheetController.saveRows(this.table.getJson())
        },
        ondeletecolumn: () => {
            spreadsheetController.saveColumns(this.table.getJson())
        },
        oninsertcolumn: () => {
            spreadsheetController.saveColumns(this.table.getJson())
        },
        onmoverow: () => {
            spreadsheetController.saveRows(this.table.getJson())
        },
        onmovecolumn: () => {
            spreadsheetController.saveColumns(this.table.getJson())
        },
        onresizerow: () => {
            spreadsheetController.saveRows(this.table.getJson())
        },
        onresizecolumn: () => {
            spreadsheetController.saveColumns(this.table.getJson())
        },
        onchangestyle: () => {
            spreadsheetController.saveStyles(this.table.getStyle())
        },

    },
    saveDatas(datas) {
        let currentSpreadsheet = Spreadsheet.findOne(this.id)
        cryptoTools.sim_encrypt_data(JSON.stringify(datas), Session.get("currentProjectSimKey"), (symEnc_datas) => {
            currentSpreadsheet.callMethod("saveDatas", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas, (err, res) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    },
    saveRows(datas, rows) {
        let currentSpreadsheet = Spreadsheet.findOne(this.id)
        cryptoTools.sim_encrypt_data(JSON.stringify(datas), Session.get("currentProjectSimKey"), (symEnc_datas) => {
            currentSpreadsheet.callMethod("saveRows", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas, JSON.stringify(rows), (err, res) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    },
    saveColumns(datas, columns) {
        let currentSpreadsheet = Spreadsheet.findOne(this.id)
        cryptoTools.sim_encrypt_data(JSON.stringify(datas), Session.get("currentProjectSimKey"), (symEnc_datas) => {
            currentSpreadsheet.callMethod("saveColumns", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas, JSON.stringify(columns), (err, res) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    },
    saveStyles(styles) {
        let currentSpreadsheet = Spreadsheet.findOne(this.id)
        currentSpreadsheet.callMethod("saveStyles", projectController.getAuthInfo(FlowRouter.current().params.projectId), JSON.stringify(styles), (err, res) => {
            if (err) {
                console.log(err)
            }
        })

    },

    checkForUpdates(instance) {
        instance.autorun(() => {
            let currentSpreadsheet = Spreadsheet.findOne(this.id)
            if (currentSpreadsheet && this.table) {
                cryptoTools.decryptObject(currentSpreadsheet.content, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
                    this.table.setData(spreadsheetContent.symEnc_datas)
                    this.table.setStyle(JSON.parse(spreadsheetContent.style))
                })
            }
        })
    }
}


export default spreadsheetController
