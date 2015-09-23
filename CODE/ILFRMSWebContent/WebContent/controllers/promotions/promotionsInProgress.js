define([ "dijit/registry", "dojo/on", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/JsonRest",
    "dojox/grid/EnhancedGrid", "dijit/form/Button", "controllers/widgets/functions.js", "dojo/dom-style",  "models/promotion/releaseGroupsModel.js", "dijit/form/ValidationTextBox"],
        function (registry, on, lang, ObjectStore, Memory, JsonRest, EnhancedGrid, Button, Functions, domStyle, releaseGroupsModel) {
        "use strict";
       var functions = new Functions();
    
        return {
            init: function () {
                var inProgressGrid = null, 
                    newRelButton = registry.byId("btnNewRel_inProgress"),
                    layout = null,
                    localApp = this.app;
                    
                function formatDate(date) {
                    if(date.indexOf("T") > 0) {
                        date = date.slice(0, date.indexOf("T"));
                    }
                    return functions._isoDateFormatterShort(date);
                }

                function editFormatter(id,rowIndex, cell) {
                    var versionId = cell.grid._by_idx[rowIndex].item.relGrpVerId;

                    var btn = new Button({
                        label: "Edit",
                        onClick: function (e) {
                            var transOpts = {
                                    target : "releaseGroup",
                                    data : {"id": id, "versionId": versionId}
                                };
                             localApp.transitionToView(e.target, transOpts);
                             releaseGroupsModel.setNameChanged(false);
                             releaseGroupsModel.resetArrayToSave();
                             releaseGroupsModel.resetInvalidIds();
                        }
                    });
                    return btn;
                }

                
                
                function cancelFormatter(id, rowIndex, cell) {
                    var tempStatus = cell.grid._by_idx[rowIndex].item.statusName,
                        versionId = cell.grid._by_idx[rowIndex].item.relGrpVerId,
                        inProgressGrid = registry.byId("inProgressReleaseGrid"),
                        releaseGroupRest = localApp.loadedStores.releaseGroupsJsonRest;                    
                        releaseGroupRest.target = "/frmsadminservice/api/v1/releasegroups/" + id + "/versions/";
                            
                    functions._getJsonRestEndpoint(releaseGroupRest);
                     if("File Generated" === tempStatus) {
                        var btn = new Button({
                            label: "Fail",
                            onClick: function (e) {
                                releaseGroupRest.put({"status": "Failed"}, {id: versionId}).then(function () { 
                                    localApp.transitionToView(e.target, {target: "promotionInProgress" });
                                });
                            }
                        });
                        return btn;
                    } else {
                           var btn = new Button({
                                label: "Cancel",
                                onClick: function (e) {                                    
                                      releaseGroupRest.put({"status": "Canceled"}, {id: versionId}).then(function () {
                                        localApp.transitionToView(e.target, {target: "promotionInProgress" });
                                    });                                   
                                }
                            });                        
                       return btn;
                    } 
                }

                layout = [ {
                    name : "Release Group",
                    field : "groupName",
                    width : "25%"
                }, {
                    name : "Modified",
                    field : "createDate",
                    width : "15%",
                    formatter : formatDate
                }, {
                    name : "Status",
                    field : "statusName",
                    width : "10%"
                }, {
                    name : "Modified by",
                    field : "createNNumber",
                    width : "10%"
                }, {
                    name : "Last",
                    field : "createLastName",
                    width : "10%"
                }, {
                    name : "First",
                    field : "createFirstName",
                    width : "10%"
                }, {
                    name : "Edit",
                    field : "id",
                    width : "10%",
                    formatter : editFormatter
                }, {
                    name : "Cancel/Fail",
                    field : "id",
                    width : "10%",
                    formatter : cancelFormatter
                }, { name: "Release Grp Version Id", field: "relGrpVerId", hidden: true} ];

                inProgressGrid = new EnhancedGrid({
                    autoHeight : true,
                    sortInfo:-2,
                    structure : layout
                }, "inProgressReleaseGrid");

                inProgressGrid.startup();
                
                on(newRelButton, "click", lang.hitch(this, function (e) {      
                    this.inProgressReleaseGroup(e); }));
            },
            
             beforeActivate: function () {
                var newRelButton = registry.byId("btnNewRel_inProgress");
                 if(!hasUserPromoteAccess) {
                      newRelButton.set("disabled", true); 
                 } else {
                      newRelButton.set("disabled", false);
                 }     
             },

            afterActivate: function () {
                var releaseGroupsJsonRest = this.app.loadedStores.releaseGroupsJsonRest,
                    params = {"status": ["Pending", "Scheduled", "File Generated", "Failed"]},
                    inProgressGrid = registry.byId("inProgressReleaseGrid");
 
                releaseGroupsJsonRest.target = "/frmsadminservice/api/v1/releasegroups";
                functions._setJsonRestEndpoint(releaseGroupsJsonRest);
                
                releaseGroupsJsonRest.query(params).then(function (results) {
                    if (results && results.releaseGroups) {
                        var objStore = new ObjectStore({
                            objectStore : new Memory({
                                data: results.releaseGroups
                            })
                        });

                        inProgressGrid.setStore(objStore);
                    } else {
                        inProgressGrid.setStore();
                    }
                });
            },
            
             inProgressReleaseGroup: function (e) {
                  this.app.transitionToView(e.target, {target: "promotionCreate"});
             }
        };
    });