define([ "dijit/registry", "dojo/on", "dojo/_base/lang", "dojo/store/JsonRest", "dojo/data/ObjectStore",
    "dojox/grid/DataGrid", "dijit/form/Button", "models/promotion/releaseGroupsModel.js", "controllers/widgets/functions.js", "dijit/form/ValidationTextBox"],
        function (registry, on, lang, JsonRest, ObjectStore, DataGrid, Button, releaseGroupsModel, Functions) {
        //"use strict";
        var Function = new Functions();
        var Notice = this.app.NoticeHelper;
        var currentReleaseGroupId = null,
            currentReleaseGroupName = null,
            currentReleaseGroupVersionId = null,
            currentStatus = null,
            inProd = false,
            localApp, 
            nameChangeCnt = 0;
            

        return {
            init: function () {
                var versionSel = registry.byId("selectReleaseGroupVersion_releaseGroup"),
                    addButton = registry.byId("btnAdd_releaseGroup"),
                    saveButton = registry.byId("btnSave_releaseGroup"),
                    promoteButton = registry.byId("btnPromote_releaseGroup"),
                    cancelButton = registry.byId("btnCancel_releaseGroup"),
                    documentsGrid = null,
                    nameTxt = registry.byId("txtReleaseGrpName_releaseGroup");

                localApp = this.app; 
                
                function formOrRecord(indicator) {
                    var indicatorString = "Record";
                    if ("1" === indicator) {
                        indicatorString = "Form";
                    }
                    return indicatorString;
                }

                function editViewButton(id, rowIndex, cell) {
                    if ("Pending" !== currentStatus) {
                        var btn = new Button({label: "Edit"});
                        btn.set("disabled", true);
                        return btn;
                    } else {
                        var orgnlDocId = cell.grid._by_idx[rowIndex].item.orgnlDocId;
                        var btn = new Button({label: "Edit",
                            onClick: function (e) {
                                var formRecTarget = "formsCreate";
                                if(cell.grid._by_idx[rowIndex].item.formInd == 0) {
                                    formRecTarget = "recordsCreate";
                                }
                                var transOpts = {
                                         target : formRecTarget,
                                         params : {
                                            "id": id,
                                             "orgnlDocId" : orgnlDocId,
                                             "promotion": true                                                                                        
                                         }
                                 };  
                                localApp.transitionToView(e.target, transOpts);    
                                var tabs = registry.byId("appTabs");
                                if(cell.grid._by_idx[rowIndex].item.formInd == 0) {
                                    tabs.selectChild("RecordsTab"); 
                                } else {
                                    tabs.selectChild("FormsTab"); 
                                } 
                            } 
                       });
                     return btn;
                    }
                }

                function removeDocumentButton(id, rowIndex, cell) {
                    var orgnlDocId = cell.grid._by_idx[rowIndex].item.orgnlDocId,
                        saveButton =  registry.byId("btnSave_releaseGroup"),
                        addButton =   registry.byId("btnAdd_releaseGroup"),
                        btn = new Button({
                            label: "Remove",
                            onClick: function () { 
                                
                            	var selected = versionSel.attr("value"),
                            		arrayToSave = releaseGroupsModel.getArrayToSave(),
                            		index = -1;
                            	for (var i = 0; i < arrayToSave.length; i++) {
                                	if(arrayToSave[i].id === id && 
                                		arrayToSave[i].orgnlDocId === orgnlDocId) {
                                		index = i;
                                        if(arrayToSave.length == 1) {
                                            saveButton.set("disabled", true); 
                                        }
                                		break;
                                	}
                                }
                                releaseGroupsModel.removeVersionDocs(id, orgnlDocId, selected); 
                            	if (index > -1) {
                            		releaseGroupsModel.getArrayToSave().splice(index, 1); 
                                    var objStore = new ObjectStore({objectStore: releaseGroupsModel.getVersionDocs(currentReleaseGroupId, selected)});
                                    documentsGrid.setStore(objStore); 
                                    documentsGrid.update();
                            	} else {
                                     var removeDoc = localApp.loadedStores.releaseGroupsJsonRest;
                                     removeDoc.target = "/frmsadminservice/api/v1/releasegroups/";
                                     Function._setJsonRestEndpoint(removeDoc);
                                    
	                                 removeDoc.put([{"id": id, "orgnlDocId": orgnlDocId}], {id: currentReleaseGroupId}).then(function () { 
	                                    // TODO work around to force reloading grid
	                                    versionSel.attr("value", null);
	                                    versionSel.attr("value", selected);
	                                }, function (error) {
                                         Function.handleError(error);
	                                });
                                    
                                    var versionToSave = releaseGroupsModel.getVersionDocs(currentReleaseGroupId, currentReleaseGroupVersionId);
                                
                                    if (versionToSave && versionToSave.data.length == 0) {
                                        saveButton.set("disabled", true); 
                                        promoteButton.set("disabled", true);
                                    }
                            	}
                            }
                        });

                    if ("Pending" !== currentStatus) {                       
                        btn.set("disabled", true);
                    }            
                    return btn;
                }

                function promotionValidation(id, rowIndex, cell) {
                    var invalidIds = releaseGroupsModel.getInvalidIds();
                    if(invalidIds.length > 0 && invalidIds.indexOf(id) > -1) {
                        return "Fail";
                    } else if(invalidIds.length > 0) {
                        return "Pass";
                    }  else {
                        return "";
                    }
                }

                documentsGrid = new DataGrid({
                    structure: [
                        { name: "Type", field: "formInd", width: "5%", formatter: formOrRecord},
                        { name: "Form/Record#", field: "formNum", width: "10%" },
                        { name: "Form Description", field: "docDesc", width: "10%" },
                        { name: "Created By", field: "createNNumber", width: "7%" },
                        { name: "Last", field: "createLastName", width: "10%" },
                        { name: "First", field: "createFirstName", width: "7%" },
                        { name: "Revision Date", field: "revDate", width: "7%" },
                        { name: "Details", field: "id", width: "5%", formatter: editViewButton},
                        { name: "Remove", field: "id", width: "7%", formatter: removeDocumentButton},
                        { name: "Validation", field: "id", width: "5%", formatter: promotionValidation},
                        { name: "Original Doc Id", field: "orgnlDocId", hidden: true}
                    ],
                    rowsPerPage: 500,
                    keepRows: 1000,
                    autoHeight: 30,
                    canSort: function () {return false; },
                    query: "",
                    sortInfo:-7,
                    selectionMode: "single"
                }, "documentsGrid_releaseGroup");

                documentsGrid.startup();
                
                on(nameTxt, "change", lang.hitch(this, function (e) { this.updateReleaseGroupName(e); }));                
                on(versionSel, "change", lang.hitch(this, function (e) {this.setCurrentVersion(e); }));
                on(addButton, "click", lang.hitch(this, function (e) {releaseGroupsModel.resetInvalidIds(); localApp.transitionToView(e.target, {target: "unassignedDocuments",
                    data: {"currentReleaseGroupId": currentReleaseGroupId,
                        "currentReleaseGroupName": currentReleaseGroupName, "currentStatus": currentStatus,
                        "currentReleaseGroupVersionId": currentReleaseGroupVersionId}}); }));
                on(saveButton, "click", lang.hitch(this, function (e) {this.saveVersion(e); }));
                on(promoteButton, "click", lang.hitch(this, function (e) {this.promoteVersion(e); }));
                on(cancelButton, "click", lang.hitch(this, function (e) {this.cancelChanges(e); }));                
            },

            beforeActivate: function () {
                var addButton = registry.byId("btnAdd_releaseGroup"),
                    saveButton = registry.byId("btnSave_releaseGroup"),
                    promoteButton = registry.byId("btnPromote_releaseGroup");  
                
                addButton.set("disabled", true);
                saveButton.set("disabled", true);
                promoteButton.set("disabled", true);
            },

            afterActivate: function (previousView, data) {
                localApp = this.app;
                
                var documentsGrid = registry.byId("documentsGrid_releaseGroup"),
                    versionSel = registry.byId("selectReleaseGroupVersion_releaseGroup"),
                    addButton = registry.byId("btnAdd_releaseGroup"),
                    saveButton =  registry.byId("btnSave_releaseGroup"),
                    promoteButton = registry.byId("btnPromote_releaseGroup"),
                    query = {"status": ["Pending", "Scheduled", "File Generated", "Installed", "Failed", "Canceled"]},
                    restVersions = localApp.loadedStores.releaseGroupsJsonRest,  
                    restGroups = localApp.loadedStores.releaseGroupsJsonRest;
                
                 if(data && data.newId) {
                    var versionToSave = releaseGroupsModel.getVersionDocs(currentReleaseGroupId, currentReleaseGroupVersionId);
                    releaseGroupsModel.replaceVersionDocs(data.id, data.orgnlDocId, data.newId, currentReleaseGroupId);
                      var removeDoc = localApp.loadedStores.releaseGroupsJsonRest;
                        removeDoc.target = "/frmsadminservice/api/v1/releasegroups/";
                        Function._setJsonRestEndpoint(removeDoc); 
	                    removeDoc.put([{"id": data.id, "orgnlDocId": data.orgnlDocId}], {id: currentReleaseGroupId}).then(function () { 
                            var saveArray = releaseGroupsModel.getArrayToSave();
                            if(saveArray.length > 0 ) {
                                    var saveVersion = localApp.loadedStores.releaseGroupsJsonRest;
                                    saveVersion.target = "/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId;
                                    Function._setJsonRestEndpoint(saveVersion);    
                                    saveVersion.put(saveArray).then(function () {                               
                                        saveButton.set("disabled", true);
                                        releaseGroupsModel.resetArrayToSave();                                        
                                        if ("Pending" === currentStatus || 
                                            "Failed" === currentStatus ) {   
                                            if(hasUserPromoteAccess) {
                                                promoteButton.set("disabled", false);
                                            }
                                        } 
                                    });
                                }
                        }); 
                  }
                
                //Add Unassigned documents to Model...
                releaseGroupsModel.setPassedData(data);               
                
                // set variable for the current release group 
                if (data && currentReleaseGroupId !== data.id && !data.newId || (data && "promotionInProgress" === previousView.name && 
                        data.versionId && currentReleaseGroupVersionId !== data.versionId && !data.newId) ) {
                    Notice.loading();
                    nameChangeCnt = 0;
                    currentReleaseGroupId = data.id;
                    restVersions.target = "/frmsadminservice/api/v1/releasegroups/" + data.id + "/versions";
                    Function._setJsonRestEndpoint(restVersions);
                    restVersions.query(query).then(function (versionResult) {
                        var versionsSel = registry.byId("selectReleaseGroupVersion_releaseGroup");
                        versionsSel.store = releaseGroupsModel.setVersions(versionResult.relGrpVersions);

                        // TODO force a refresh if version is the same as last viewed
                        // probably a better way to do this
                        versionsSel.attr("value", null);
                        var statusFound = false;
                        if(data.versionId && versionResult.relGrpVersions.length > 1) {
                            for(var i =0; i<versionResult.relGrpVersions.length; i++) {                                
                                if(versionResult.relGrpVersions[i].id == data.versionId) {
                                    versionsSel.attr("value", versionResult.relGrpVersions[i].id);      
                                    statusFound = true;
                                    break;
                                }
                            }
                            if(!statusFound)
                              versionsSel.attr("value", releaseGroupsModel.getVersions().data[releaseGroupsModel.getVersions().data.length - 1].id);
                        } else {
                            versionsSel.attr("value", releaseGroupsModel.getVersions().data[releaseGroupsModel.getVersions().data.length - 1].id);
                        }
                        versionsSel.startup();
                        Notice.doneLoading();
                    }, function (error) {
                        Function.handleError(error);
                        Notice.doneLoading();   
                    });  
                    restGroups.target = "/frmsadminservice/api/v1/releasegroups";
                    Function._setJsonRestEndpoint(restGroups);
                    restGroups.query("").then(function (groupResult) {
                        Notice.loading();
                        var nameTxt = registry.byId("txtReleaseGrpName_releaseGroup"),
                            index;
                        for (index = 0; index < groupResult.releaseGroups.length; index++) {
                            if (data.id === groupResult.releaseGroups[index].id) {
                                currentReleaseGroupName = groupResult.releaseGroups[index].groupName;
                                break;
                            }
                        }
                        nameTxt.set("value", currentReleaseGroupName);
                        Notice.doneLoading();
                    }, function (error) {
                        Function.handleError(error);
                        Notice.doneLoading();   
                    }); 
                    releaseGroupsModel.resetInvalidIds();
                } else {
                        var versionToSave = releaseGroupsModel.getVersionDocs(currentReleaseGroupId, currentReleaseGroupVersionId);
                        
                        if ("unassignedDocuments" === previousView.name && data.addedDocs && versionToSave) {
                            var objStore = new ObjectStore({objectStore: versionToSave});
                            documentsGrid.setStore(objStore); 
                            documentsGrid.update();
                        }
                    
                        if(releaseGroupsModel.getArrayToSave().length == 0 && versionToSave && versionToSave.data.length > 0) {
                                if ("Pending" === currentStatus || "Failed" === currentStatus || "Cancelled" === currentStatus) {    
                                    if(hasUserPromoteAccess) {
                                        promoteButton.set("disabled", false);
                                     }
                                } else {
                                    promoteButton.set("disabled", true);
                                } 
                        } 
                        if ("Installed" === currentStatus || "Canceled" === currentStatus ) {
                            addButton.set("disabled", true);
                        } else {
                            addButton.set("disabled", false);
                        }
                }
                
                if (releaseGroupsModel.getArrayToSave().length > 0) {
                	saveButton.set("disabled", false);
                } 
                Notice.doneLoading();   
            },
            
            updateReleaseGroupName: function (e) {
                var saveButton = registry.byId("btnSave_releaseGroup");
                if(nameChangeCnt > 0) {
                    releaseGroupsModel.setNameChanged(true); 
                    saveButton.set("disabled", false);
                } 
                nameChangeCnt ++; 
            },
            
            setCurrentVersion: function (e) {
                var restVersions = this.app.loadedStores.releaseGroupsJsonRest,
                    localApp = this.app; 
                restVersions.target = "/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId + "/versions/";
                Function._setJsonRestEndpoint(restVersions);

                restVersions.query("").then(function (versionResult) {
                    var statusTxt = registry.byId("txtStatus_releaseGroup"),
                        modifiedByTxt = registry.byId("txtLastModBy_releaseGroup"),
                        addButton = registry.byId("btnAdd_releaseGroup"),
                        promoteButton = registry.byId("btnPromote_releaseGroup"),
                        groupName = registry.byId("txtReleaseGrpName_releaseGroup"),
                        releaseGrpVerRest,
                        dataStore,
                        index;

                    function initDocsGrid() {
                        var documentsGrid = registry.byId("documentsGrid_releaseGroup"),
                            objStore;
                            
                        releaseGrpVerRest = localApp.loadedStores.releaseGroupsJsonRest; 
                        releaseGrpVerRest.target = "/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId + "/versions/" + e + "/";
                        Notice.loading();
                        Function._setJsonRestEndpoint(releaseGrpVerRest);
                        releaseGrpVerRest.query("").then(function (results) {
                            objStore = new ObjectStore({objectStore: releaseGroupsModel.setVersionDocs(currentReleaseGroupId, e, results)});
                            documentsGrid.setStore(objStore);
                            
                             var versionToSave = releaseGroupsModel.getVersionDocs(currentReleaseGroupId, currentReleaseGroupVersionId);
                             if(versionToSave && versionToSave.data.length > 0) {
                                 if ("Pending" === currentStatus || "Failed" === currentStatus || "Cancelled" === currentStatus) {    
                                    if(hasUserPromoteAccess) {
                                        promoteButton.set("disabled", false);
                                     }
                                } else {
                                    promoteButton.set("disabled", true);
                                }
                            }                            
                            if ("Installed" === currentStatus || "Canceled" === currentStatus ) {
                                addButton.set("disabled", true);
                            } else {
                                addButton.set("disabled", false);
                            }                            
                            if("Pending" === currentStatus && versionResult.relGrpVersions.length == 1 && 
                                 hasUserPromoteAccess) {
                                groupName.set("disabled", false);
                            } 
                             Notice.doneLoading();
                        }, function (error) {
                            Function.handleError(error);
                            Notice.doneLoading(); 
                        }); 
                    }

                    statusTxt.set("value", releaseGroupsModel.getVersionStatusName(e));
                    modifiedByTxt.set("value", releaseGroupsModel.getVersionLastModifiedBy(e));  
                    groupName.set("disabled", true);
                    
                    if ("All" !== e) {
                        var documentsGrid = registry.byId("documentsGrid_releaseGroup");
                        for (index = 0; index < versionResult.relGrpVersions.length; index++) {
                            if (versionResult.relGrpVersions[index].id === e) {
                                currentStatus = versionResult.relGrpVersions[index].statusName;
                                currentReleaseGroupVersionId = versionResult.relGrpVersions[index].id;
                                break;
                            }
                        }
                        initDocsGrid();
                    }                     
                });   
            },
            
            saveVersion: function (e) {       
             	var saveButton = registry.byId("btnSave_releaseGroup"), 
             	    promoteButton = registry.byId("btnPromote_releaseGroup"),
             	    saveVersion = this.app.loadedStores.releaseGroupsJsonRest;
                 
             	var saveArray = releaseGroupsModel.getArrayToSave();
        		if(saveArray.length > 0 ) {
                    saveVersion.target = "/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId;
                    Function._setJsonRestEndpoint(saveVersion);    
                        saveVersion.put(saveArray).then(function () {
                            saveButton.set("disabled", true);
                            releaseGroupsModel.resetArrayToSave();
                             if ("Pending" === currentStatus || 
                                "Failed" === currentStatus ) {   
                                 if(hasUserPromoteAccess) {
                                     promoteButton.set("disabled", false);
                                 }
                             }   
                        }); 
            	}
                if (releaseGroupsModel.getNameChanged()) {
                    var releaseGrpTxt = registry.byId("txtReleaseGrpName_releaseGroup"),
                        obj = {};
                        releaseGrpTxt.focus();
                        releaseGrpTxt.validate();

                        if (releaseGrpTxt.isValid()) {
                                var isValid = true,
                                    releaseGroupJsonRest = this.app.loadedStores.releaseGroupsJsonRest;
                                obj.releaseGroupName = releaseGrpTxt.get("value");     
                                releaseGroupJsonRest.target = "/frmsadminservice/api/v1/releasegroups";
                                Function._setJsonRestEndpoint(releaseGroupJsonRest);

                                releaseGroupJsonRest.query().then(function (results) {
                                    if(results && results.releaseGroups) {
                                        var releaseGroups = results.releaseGroups;
                                        for(var i =0; i<releaseGroups.length; i++) {
                                            if(releaseGroups[i].groupName.toUpperCase() === releaseGrpTxt.get("value").toUpperCase()) {
                                                isValid = false;
                                                break;
                                            } 
                                        }
                                    }
                                    if(isValid) {  
                                        var updateVersionName = localApp.loadedStores.releaseGroupsJsonRest;
                                        updateVersionName.target = "/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId +"/updateReleaseGroupName";
                                        Function._setJsonRestEndpoint(updateVersionName);
                                        updateVersionName.put(obj).then(function () {
                                            saveButton.set("disabled", true);
                                            releaseGroupsModel.setNameChanged(false);
                                            releaseGrpTxt.focus(); 
                                        }); 
                                    } else {
                                        var confDialog = Notice.showDialog({text:"The Release Group Name entered is already in use. Please select a different Release Group Name.", type: "warning"});  
                            confDialog.on("execute", function (dialogEvent) {});
                                        releaseGrpTxt.focus();
                                    }

                                });
                      }
                } else if("Pending" !== currentStatus && "Failed" !== currentStatus) {
                       localApp.transitionToView(e.target, {target: "promotionInProgress"});
                  }
            },
            
            promoteVersion: function (e) {
                var documentsGrid = registry.byId("documentsGrid_releaseGroup"),
                    promoteVersion = this.app.loadedStores.releaseGroupsJsonRest;
                
                promoteVersion.target ="/frmsadminservice/api/v1/releasegroups/" + currentReleaseGroupId + "/versions/" + currentReleaseGroupVersionId;
                Function._setJsonRestEndpoint(promoteVersion);
                releaseGroupsModel.resetInvalidIds();
                
            	var versionToSave = releaseGroupsModel.getVersionDocs(currentReleaseGroupId, currentReleaseGroupVersionId);
               	var promoteArray = [];
        		for (var i = 0; i < versionToSave.data.length; i++) { 
        			 promoteArray.push({id:versionToSave.data[i].id,
        						     orgnlDocId: versionToSave.data[i].orgnlDocId });
        		}         

                if(promoteArray.length > 0 ) {
                    Notice.loading();
                    promoteVersion.put(promoteArray).then(function (results) {
                         if (results && results.invalidIds) {                             
                             releaseGroupsModel.setInvalidIds(results.invalidIds);  
                             documentsGrid.update();                             
                             var confDialog = Notice.showDialog({text:"The minimum data required for promotion has not been entered.", type: "warning"});                 confDialog.on("execute", function (dialogEvent) { 
                                  Notice.doneLoading();  
                             });

                         } else if (results && results.statusDetailMsg && results.frmsSrvcStatusCd === "VALIDATION_EXCEPTION") {     
                             var confDialog = Notice.showDialog({text:results.statusDetailMsg, type: "warning"});  
                             confDialog.on("execute", function (dialogEvent) {});
                         } else {
                              localApp.transitionToView(e.target, {target: "promotionInProgress"});
                         }                         
                       Notice.doneLoading();  
                    }, function (error) {                        
                        Notice.doneLoading();                        
                        Function.handleError(error); 
                    }); 
                }
            },
 
            cancelChanges: function (e) {
                 var saveArray = releaseGroupsModel.getArrayToSave();                 
        		 if(saveArray.length > 0 ) {
                   var confDialog = Notice.showConfirmDialog({text:"You have unsaved changes. Do you wish to discard your unsaved changes?", type: "warning", okBtnText:"Discard"}); 
                   confDialog.on("execute", function (dialogEvent) {
                        releaseGroupsModel.setNameChanged(false);
                           releaseGroupsModel.resetArrayToSave();
                           for (var i = 0; i < saveArray.length; i++) {
                                if(saveArray[i].id && saveArray[i].orgnlDocId) {
                                    releaseGroupsModel.removeVersionDocs(saveArray[i].id, saveArray[i].orgnlDocId, null);   
                                }
                            }                             
                            currentReleaseGroupId = null; 
                            localApp.transitionToView(e.target, {target: "promotionInProgress"});
                       });  
                 } else {
                     releaseGroupsModel.resetArrayToSave();
                     releaseGroupsModel.setNameChanged(false);
                     localApp.transitionToView(e.target, {target: "promotionInProgress"});
                 }                
            } 
        };
    });