/*global define:true,confirm:true,dijit:true,alert:true,dojo:true,console:true,setTimeout:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dojox/grid/DataGrid", "dojo/data/ObjectStore",
    "dojo/store/Memory", "dojo/store/Cache", "controllers/widgets/functions.js", "dijit/registry"
    ], function (dom, on, lang, DataGrid, ObjectStore, Memory, Cache, Functions, registry) {
    'use strict';
    var params,  defArchUsers, 
        grid = null, Function = new Functions(); // Functions.js helper Widget
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                data: params
            };
            this.app.transitionToView(e.target, transOpts);
        }, 
        init: function () {
            var btnArchUserDne = dom.byId("btnArchUserDne_archivedUsers"), cacheArchUserStore, 
                localApp = this.app, self = this,
                transOpts = {
                    target: "users",
                    params: null
                };
            on(btnArchUserDne, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, "users");
            }));
            
            grid = new DataGrid({
                autoHeight: true,
                structure: [{
                    name: "History",
                    field: "history",
                    width: "20%",
                    formatter: function () {
                        return "<button>View</button>";
                    }
                }, {
                    name: "N#",
                    field: "userIdentifier",
                    width: "20%"
                }, {
                    name: "Last Name",
                    field: "userLastName",
                    width: "20%"
                }, {
                    name: "First Name",
                    field: "userFirstName",
                    width: "20%"
                }, {
                    name: "Restore",
                    field: "restore",
                    width: "20%",
                    formatter: function () {
                        if(!hasUserAdminstrationAccess) {
                            return "<button type='button' disabled>Restore</button>";                            
                        } else {
                            return "<button>Restore</button>";
                        }
                    }
                }, {
                    name: "Identifier",
                    field: "identifier",
                    width: "20%",
                    hidden: true
                }]
            }, "archUserGrid_archivedUsers");
            grid.startup();
            dojo.connect(grid, "onCellClick", lang.hitch(this, function (e) {
                var cellField, dataItem, userId, originalIdentifer, endDate, formattedEndDate, userJson, userDetails, restoreUserDetails;
                cellField = e.cell.field;
                if (cellField === 'restore' || cellField === 'history') {
                    grid.selection.setSelected(e.rowIndex, true);
                    dataItem = grid.selection.getSelected();
                    userId = dataItem[0].identifier;
                    if (cellField === 'history') {
                        params = {
                            "orginalIdentifier": userId
                        };
                        this.transitionTo(e, "userHistory");
                    } else {
                        originalIdentifer = dataItem[0].identifier;
                        endDate = new Date(9999, 11, 31);
                        formattedEndDate = Function.formatUTCDate(endDate);
                        userJson = "{\"endDateTime\":\"" + formattedEndDate + "\"}";
                        userDetails = this.app.loadedStores.userMemory;
                        restoreUserDetails = this.app.loadedStores.archiveUserDetails;
                        cacheArchUserStore = new Cache(restoreUserDetails, userDetails);
                        cacheArchUserStore.add(dojo.fromJson(userJson), {id: originalIdentifer}).then(function (result) {
                            if (result.frmsSrvcStatusCd === "SUCCESSFUL_CREATION_OR_UPDATION") {
                                // isTwoAdminUsers is true, they can't archive if there wasn't
                                params = {
                                    id:dataItem[0].userIdentifier,
                                    isTwoAdminUsers:true
                                };
                                var transOpts = {
                                    target: "editUser",
                                    params: params
                                };
                                self.app.transitionToView(e.target, transOpts);
                            }
                        });
                    }
                }
            }));
        },
         beforeActivate: function (previousView, data) {           
            var userArchGrid = registry.byId("archUserGrid_archivedUsers"); 
            userArchGrid.setStore(emptyStore); 
            defArchUsers = null;
        },
        afterActivate: function (previousView, data) {
             var objStore= null;
             var cacheArchUserStore = new Cache(Function._getJsonRestEndpoint(this.app.loadedStores.archiveUserDetails), memUsers); 
             
             defArchUsers = cacheArchUserStore.query().then(function (results) {
                    if(results != null && results.usersList) {
                        objStore = new ObjectStore({
                            objectStore: new Memory({
                                data: results.usersList
                            })
                        });
                        grid.setStore(objStore);
                    }
               }, function (error) {
                    console.debug("err: ", error);
             });            
        }
    };
});
