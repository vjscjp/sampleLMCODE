define([ "dijit/registry", "dojo/on", "dojo/_base/lang",
    "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/JsonRest",  
    "dojox/grid/DataGrid", "controllers/widgets/functions.js", "dojox/grid/_CheckBoxSelector"],
        function (registry, on, lang, ObjectStore, Memory, JsonRest, DataGrid, Functions) {
        //"use strict";
        var Notice = this.app.NoticeHelper;
        var currentReleaseGroupId = null,
            currentReleaseGroupVersionId = null,
            currentStatus = null,
            functions = new Functions();

        return {
            addToCurrentReleaseGroup: function (docs, e) {
                var transOpts = {
                        target : "releaseGroup",
                        data : {"id": currentReleaseGroupId, "versionId": currentReleaseGroupVersionId, "currentStatus":currentStatus, "addedDocs": docs}
                    };
                this.app.transitionToView(e.target, transOpts);
            },

            init: function () {
 
                function formOrRecord(indicator) {
                    var indicatorString = "Record";
                    if ("1" === indicator) {
                        indicatorString = "Form";
                    }
                    return indicatorString;
                }
                
                 function formatDate(date) {
                     if(date.indexOf("T") > 0) {
                        date = date.slice(0, date.indexOf("T"));
                    }
                    return functions._isoDateFormatterShort(date);
                }

                var saveBtn = registry.byId("btnSave_unassignedDocuments"),
                    cancelBtn = registry.byId("btnCancel_unassignedDocuments"),
                    unassignedDocsGrid = new DataGrid({
                        structure : [ {type: "dojox.grid._CheckBoxSelector"},
                            [
                                { name : "ID", field : "id", width : "10%", hidden: true},
                                { name : "Original ID", field : "orgnlDocId", hidden: true},
                                { name : "Promotion Type", field : "formInd", width : "15%", formatter: formOrRecord},
                                { name : "Title", field : "docTitle", width : "25%" },
                                { name : "Created By", field : "createNNumber", width : "10%" },
                                { name : "Last", field : "createLastName", width : "15%" },
                                { name : "First", field : "createFirstName", width : "15%" },
                                { name : "Modified Date", field : "createDate", width : "15%", formatter: formatDate}
                            ]],
                        rowsPerPage: 500,
                        keepRows: 1000,
                        autoHeight: 30,
                        canSort: function () {return false; },
                        query: "",
                        sortInfo:-8,
                        selectionMode: "multiple"
                    }, "unassignedDocsGrid");

                unassignedDocsGrid.startup();

                on(saveBtn, "click", lang.hitch(this, function (e) {
                    if(unassignedDocsGrid.selection.getSelected().length > 0) {
                        this.addToCurrentReleaseGroup(unassignedDocsGrid.selection.getSelected(), e); 
                        unassignedDocsGrid.removeSelectedRows();
                    } else {
                        var confDialog = Notice.showDialog({text:"No documents selected.", type: "warning"});  
                        confDialog.on("execute", function (dialogEvent) {});
                    }
                }));
                
                on(cancelBtn, "click", lang.hitch(this, function (e) {this.app.transitionToView(e.target, {target: "releaseGroup",
                    data: {"id": currentReleaseGroupId}}); }));

            },

            beforeActivate: function (previousView, data) {
                currentReleaseGroupId = data.currentReleaseGroupId;
                currentReleaseGroupVersionId = data.currentReleaseGroupVersionId;
                currentStatus = data.currentStatus;
            },

            afterActivate: function (previousView, data) {
                var releaseGroupTxt = registry.byId("txtReleaseGrpName_unassignedDocuments"),
                    localApp = this.app;

                function initUnassignedDocsGrid() {
                    Notice.loading();
                    var unassignedDocsGrid = registry.byId("unassignedDocsGrid"),
                        unassignedDocsRest = localApp.loadedStores.releaseGroupsJsonRest,
                        dataStore;                    
                    
                     unassignedDocsRest.target = "/frmsadminservice/api/v1/releasegroups/unassigneditems/";
                     functions._setJsonRestEndpoint(unassignedDocsRest);
                    
                  unassignedDocsRest.query("").then(function (results) {
                    if(results) {
                        var objStore = new ObjectStore({
                            objectStore : new Memory({ data: results })
                        });
                        unassignedDocsGrid.setStore(objStore);
                    } else {
                        unassignedDocsGrid.setStore();
                    }
                      Notice.doneLoading();
                  }, function (error) {
                        Notice.doneLoading();                        
                        unassignedDocsGrid.setStore();
                    });                    
                    
                }
                
                releaseGroupTxt.set("value", data.currentReleaseGroupName);
                initUnassignedDocsGrid();
            }
        };
    });