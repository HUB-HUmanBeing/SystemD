import jexcel from "jexcel";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import cryptoTools from "../cryptoTools";
import projectController from "./projectController";
import isSameObject from "../isSameObject";
import Spreadsheets from "../../../lib/collections/Spreadsheets";

let spreadsheetController = {
    table: null,
    reactiveTable: null,
    id: null,
    columns: [],
    rows: 1,
    datas: [],
isFirst:true,
    reset(el){
        if (this.table) {
            this.destroy(el)
        }
        this.table = null
        this.reactiveTable =  null
        this.id = null
        this.columns = []
        this.rows = 1
        this.datas = []
        this.isFirst =true
        this.instance=null
        this.style=null
    },
    initialize(spreadsheetId, el, instance, isEditable) {
        this.id = FlowRouter.current().queryParams.spreadsheetId

        let encryptedSpreadsheetContent = Spreadsheet.findOne({_id: spreadsheetId}).content
        if(encryptedSpreadsheetContent && Spreadsheets.findOne({_id: spreadsheetId}).createdBy &&spreadsheetId == FlowRouter.current().queryParams.spreadsheetId){
            cryptoTools.decryptObject(encryptedSpreadsheetContent, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
                if (spreadsheetContent.symEnc_datas && JSON.parse(spreadsheetContent.symEnc_datas).length) {
                    let newDatas = JSON.parse(spreadsheetContent.symEnc_datas)
                    if (this.datas != newDatas) {
                        this.datas = newDatas
                    }
                } else {
                    this.datas = this.defaultDatas()
                    this.saveDatas(this.datas)
                }
                let newColumns = JSON.parse(spreadsheetContent.columns)
                if (newColumns.length) {

                    this.columns = newColumns

                } else {
                    this.columns = this.defaultColumns()
                    this.saveColumns(this.datas, this.columns)
                }
                if (spreadsheetContent.style && spreadsheetContent.style != "") {
                    this.style = JSON.parse(spreadsheetContent.style)

                }
                this.el = el
                this.isEditable = isEditable
                this.instance = instance
                this.createTable(el, isEditable, instance)
            })
        }



    },
    createTable(el, isEditable, instance,checkForUpdatesNotNeeded) {
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
            columnDrag: true,
            allowRenameColumn:false,
            toolbar: this.toolbar(isEditable, instance),
            search:true,
            text:{
                noRecordsFound:__('spreadsheet.noRecordsFound'),
                showingPage:__('spreadsheet.showingPage'),
                show:__('spreadsheet.show'),
                entries:__('spreadsheet.entries'),
                insertANewColumnBefore:__('spreadsheet.insertANewColumnBefore'),
                insertANewColumnAfter:__('spreadsheet.insertANewColumnAfter'),
                deleteSelectedColumns:__('spreadsheet.deleteSelectedColumns'),
                renameThisColumn:__('spreadsheet.renameThisColumn'),
                orderAscending:__('spreadsheet.orderAscending'),
                orderDescending:__('spreadsheet.orderDescending'),
                insertANewRowBefore:__('spreadsheet.insertANewRowBefore'),
                insertANewRowAfter:__('spreadsheet.insertANewRowAfter'),
                deleteSelectedRows:__('spreadsheet.deleteSelectedRows'),
                editComments:__('spreadsheet.editComments'),
                addComments:__('spreadsheet.addComments'),
                comments:__('spreadsheet.comments'),
                clearComments:__('spreadsheet.clearComments'),
                copy:__('spreadsheet.copy'),
                paste:__('spreadsheet.paste'),
                saveAs:__('spreadsheet.saveAs'),
                about:__('spreadsheet.about'),
                areYouSureToDeleteTheSelectedRows:__('spreadsheet.areYouSureToDeleteTheSelectedRows'),
                areYouSureToDeleteTheSelectedColumns:__('spreadsheet.areYouSureToDeleteTheSelectedColumns'),
                thisActionWillDestroyAnyExistingMergedCellsAreYouSure:__('spreadsheet.thisActionWillDestroyAnyExistingMergedCellsAreYouSure'),
                thisActionWillClearYourSearchResultsAreYouSure:__('spreadsheet.thisActionWillClearYourSearchResultsAreYouSure'),
                thereIsAConflictWithAnotherMergedCell:__('spreadsheet.thereIsAConflictWithAnotherMergedCell'),
                invalidMergeProperties:__('spreadsheet.invalidMergeProperties'),
                cellAlreadyMerged:__('spreadsheet.cellAlreadyMerged'),
                noCellsSelected:__('spreadsheet.noCellsSelected')
            }
           // pagination:10,

        }
        if (!isEditable) {
            tableOptions.contextMenu = function (obj, x, y, e) {
                return []
            }

        } else {
            tableOptions = {...tableOptions, ...this.events}
        }
        table = jexcel(el, tableOptions);

        this.table = table
        if (this.style) {
            table.setStyle(this.style)
        }
        if (!isEditable && !checkForUpdatesNotNeeded) {

            this.checkForUpdates(el, isEditable, instance)

        }
        this.arrangeSearch()
    },
    arrangeSearch(){
Meteor.setTimeout(()=>{
    $(".jexcel_search").attr("placeholder", __('spreadsheetHeader.searchInTable')+ '...')
},400)
    },
    destroy(el) {
        if(el){
            jexcel.destroy(el, false);
        }

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

    toolbar(isEditable, instance) {
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
                content: 'file_download',
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
    arrToObj: function (arr) {
        let res = []
        arr.forEach((row, i) => {
            res.push({})
            row.forEach((el, j) => {
                res[i][j] = el
            })
        })
        return res
    },
    beautifyColumns(columns) {
        let res = []
        columns.forEach((col, i) => {
            col.name = i == 0 ? "0" : i
            if (col.width == 50) {
                col.width = 120
            }
            res.push(col)
        })
        return res
    },
    events: {
        onchange: () => {
            spreadsheetController.saveDatas(this.table.getJson(),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        ondeleterow: () => {
            spreadsheetController.saveDatas(this.table.getJson(),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        oninsertrow: () => {
            spreadsheetController.saveDatas(this.table.getJson(),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        ondeletecolumn: () => {

            spreadsheetController.saveColumns(spreadsheetController.arrToObj(this.table.getConfig().data), spreadsheetController.beautifyColumns(this.table.getConfig().columns),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        oninsertcolumn: () => {
console.log(this.table.getConfig().style)
            spreadsheetController.saveColumns(spreadsheetController.arrToObj(this.table.getConfig().data), spreadsheetController.beautifyColumns(this.table.getConfig().columns),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        onmoverow: () => {
            spreadsheetController.saveDatas(this.table.getJson(),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        onmovecolumn: () => {
            spreadsheetController.saveColumns(spreadsheetController.arrToObj(this.table.getConfig().data), spreadsheetController.beautifyColumns(this.table.getConfig().columns),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        onresizecolumn: () => {

            spreadsheetController.saveColumns(this.table.getJson(), this.table.getConfig().columns)
        },
        onchangestyle: () => {
            spreadsheetController.saveStyles(this.table.getConfig().style)
        },
        onsort: () => {
            spreadsheetController.saveDatas(this.table.getJson(),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })
        },
        onundo: () => {
            spreadsheetController.saveColumns(spreadsheetController.arrToObj(this.table.getConfig().data), spreadsheetController.beautifyColumns(this.table.getConfig().columns),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })

        },
        onredo: () => {
            spreadsheetController.saveColumns(spreadsheetController.arrToObj(this.table.getConfig().data), spreadsheetController.beautifyColumns(this.table.getConfig().columns),()=>{
                spreadsheetController.saveStyles(this.table.getConfig().style)
            })

        },

    },
    saveDatas(datas,cb) {
        let currentSpreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
        cryptoTools.sim_encrypt_data(JSON.stringify(datas), Session.get("currentProjectSimKey"), (symEnc_datas) => {
            currentSpreadsheet.callMethod("saveDatas", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas, (err, res) => {
                if (err) {
                    console.log(err)
                }else{
                    if(cb){cb()}
                }
            })
        })
    },
    saveColumns(datas, columns, cb) {
        let currentSpreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
        cryptoTools.sim_encrypt_data(JSON.stringify(datas), Session.get("currentProjectSimKey"), (symEnc_datas) => {
            currentSpreadsheet.callMethod("saveColumns", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas, JSON.stringify(columns), JSON.stringify(columns), (err, res) => {
                if (err) {
                    console.log(err)
                }else{
                    if(cb){cb()}
                }
            })
        })
    },
    saveStyles(styles) {
        if(this.isFirst){
            this.isFirst = false
        }else{

            Meteor.setTimeout(()=>{
                let currentSpreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
                currentSpreadsheet.callMethod("saveStyles", projectController.getAuthInfo(FlowRouter.current().params.projectId), JSON.stringify(styles), (err, res) => {
                    if (err) {
                        console.log(err)
                    }
                })
            },1500)
        }



    },

    checkForUpdates(el, isEditable, instance) {
        instance.autorun((computation) => {
            let currentSpreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
            if (currentSpreadsheet && this.table) {
                cryptoTools.decryptObject(currentSpreadsheet.content, {symKey: Session.get("currentProjectSimKey")}, (spreadsheetContent) => {
                    this.table.setData(spreadsheetContent.symEnc_datas)
                    this.table.setStyle(JSON.parse(spreadsheetContent.style))
                    if (!isSameObject(this.columns , JSON.parse(spreadsheetContent.columns))) {
                        this.columns = JSON.parse(spreadsheetContent.columns)
                        this.datas = JSON.parse(spreadsheetContent.symEnc_datas)
                        this.style = JSON.parse(spreadsheetContent.style)
                        this.createTable(el, isEditable, instance, true)
                    }
                })
                if(currentSpreadsheet.currentEditor && currentSpreadsheet.currentEditor.memberId == projectController.getCurrentMemberId(FlowRouter.current().params.projectId)){
                    computation.stop()
                }
            }

        })
    }
}


export default spreadsheetController
