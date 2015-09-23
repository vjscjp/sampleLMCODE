/*global define:true,confirm:true,dijit:true,alert:true,dojo:true,console:true,setTimeout:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dojox/grid/EnhancedGrid", "dojo/data/ObjectStore",
    "dojo/store/Memory", "dojo/store/Cache", "dijit/registry", "controllers/widgets/functions.js", "dojox/grid/EnhancedGrid"
    ], function (dom, on, lang, DataGrid, ObjectStore, Memory, Cache, registry, Functions, EnhancedGrid) {
    "use strict";
    var params, isTwoAdminUsers = false, Function = new Functions(); 
    var userGrid;
    
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                data: params
            };
            this.app.transitionToView(e.target, transOpts);
        },
        init: function () {
            var btnAddUser = registry.byId("btnAddUser_users"),
                btnViewArchive = dom.byId("btnViewArchive_users"),
                layout = null,
                userGrid = null;
            
              if(!hasUserAdminstrationAccess) {
                    btnAddUser.set("disabled", true); 
                } else {
                    btnAddUser.set("disabled", false);
                } 
            
            on(btnAddUser, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, "addUser");
            }));
            on(btnViewArchive, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, "archivedUsers");
            })); 
                
             layout = [{
                    name: "Detail",
                    field: "detail",
                    width: "20%",
                    formatter: function () {
                        return "<button>Edit</button>";
                    }
                }, {
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
                    name: "FormsWrite",
                    field: "formsWriteIndicator",
                    width: "20%",
                    hidden: true
                }, {
                    name: "RecordWrite",
                    field: "recordsWriteIndicator",
                    width: "20%",
                    hidden: true
                }, {
                    name: "PackagesWrite",
                    field: "packagesWriteIndicator",
                    width: "20%",
                    hidden: true
                }, {
                    name: "FrmsPromote",
                    field: "frmsPromoteIndicator",
                    width: "20%",
                    hidden: true
                }, {
                    name: "UserAdministrator",
                    field: "userAdministratorIndicator",
                    width: "20%",
                    hidden: true
                }, {
                    name: "Identifier",
                    field: "identifier",
                    width: "20%",
                    hidden: true
                }];
    
                userGrid = new EnhancedGrid({
                    autoHeight : true, 
                    structure : layout,  
                    sortInfo:4
                }, "usersGrid_users");

                userGrid.startup(); 
           
            
            dojo.connect(userGrid, "onRowClick", function (e) {
                var formsWrite, recordWrite, packagesWrite, frmsPromote, userAdmin,
                    dataItem = userGrid.selection.getSelected();
                formsWrite = dataItem[0].formsWriteIndicator;
                if (formsWrite === '1') {
                    registry.byId("frmWrite_users").set("checked", true);
                } else {
                    registry.byId("frmWrite_users").set("checked", false);
                }
                registry.byId("frmWrite_users").set("disabled", true);
                
                recordWrite = dataItem[0].recordsWriteIndicator;
                if (recordWrite === '1') {
                    registry.byId("recWrite_users").set("checked", true);
                } else {
                    registry.byId("recWrite_users").set("checked", false);
                }
                registry.byId("recWrite_users").set("disabled", true);
                
                packagesWrite = dataItem[0].packagesWriteIndicator;
                if (packagesWrite === '1') {
                    registry.byId("packWrite_users").set("checked", true);
                } else {
                    registry.byId("packWrite_users").set("checked", false);
                }
                registry.byId("packWrite_users").set("disabled", true);
                
                frmsPromote = dataItem[0].frmsPromoteIndicator;
                if (frmsPromote === '1') {
                    registry.byId("frmsPrmo_users").set("checked", true);
                } else {
                    registry.byId("frmsPrmo_users").set("checked", false);
                }
                registry.byId("frmsPrmo_users").set("disabled", true);
                
                userAdmin = dataItem[0].userAdministratorIndicator;
                if (userAdmin === '1') {
                    registry.byId("userAdmin_users").set("checked", true);
                } else {
                    registry.byId("userAdmin_users").set("checked", false);
                }
                registry.byId("userAdmin_users").set("disabled", true);
                
            });  
            
            dojo.connect(userGrid, "onCellClick", lang.hitch(this, function (e) {
                var cellField, dataItem, orginalIdentifier;
                cellField = e.cell.field;
                if (cellField === 'detail' || cellField === 'history') {
                    userGrid.selection.setSelected(e.rowIndex, true);
                    dataItem = userGrid.selection.getSelected();
                    orginalIdentifier = dataItem[0].identifier;
                    if (cellField === 'history') {
                        params = {
                            "orginalIdentifier": orginalIdentifier
                        };
                        this.transitionTo(e, "userHistory");
                    } else {   
                        params = {
                            id:dataItem[0].userIdentifier,
                            isTwoAdminUsers:isTwoAdminUsers
                        };
                        var transOpts = {
                            target: "editUser",
                            params: params
                        };
                        this.app.transitionToView(e.target, transOpts);
                    }
                }
            }));
        },
        afterActivate: function () {          
            var activeUserDetails = Function._getJsonRestEndpoint(this.app.loadedStores.activeUserDetails);
            var userGrid = registry.byId("usersGrid_users");  
            activeUserDetails.query("").then(function (results) {
                    if (results && results.usersList) {
                        var objStore = new ObjectStore({
                            objectStore: new Memory({
                                data: results.usersList
                            })
                        }); 
                        userGrid.setStore(objStore);
                        //userGrid.update();
                        var adminUsersCnt =0;
                        for(var j=0; j< results.usersList.length; j++) {
                            var user = results.usersList[j];  
                              if(user.userAdministratorIndicator === '1') {
                                 adminUsersCnt ++;
                                 if(adminUsersCnt > 2) {
                                     isTwoAdminUsers = true;
                                     break;
                                 }
                              }
                        } 
                     } else {
                            userGrid.setStore(null);
                     }
                }, function (error) {
                    console.debug("err: ", error);
                }); 
        }
    };
});


       