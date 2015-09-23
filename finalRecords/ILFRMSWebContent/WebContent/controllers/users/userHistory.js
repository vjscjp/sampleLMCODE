/*global define:true,confirm:true,dijit:true,alert:true,dojo:true,console:true,setTimeout:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dojox/grid/DataGrid", "dojo/data/ObjectStore", "dojo/store/Memory",
    "dojo/store/Cache", "controllers/widgets/functions.js"
    ], function (dom, on, lang, DataGrid, ObjectStore, Memory, Cache, Functions) {
    'use strict';
    Function = new Functions();
    var backView, cacheHistUserStore, grid = null;
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                params: null
            };
            this.app.transitionToView(e.target, transOpts);
        },
        afterActivate: function (previousView, data) {
            backView = previousView.name;
            cacheHistUserStore.query(data.orginalIdentifier + "/history").then(function (results) {
                var objStore = new ObjectStore({
                    objectStore: new Memory({
                        data: results.usersList
                    })
                });
                grid.setStore(objStore);
            }, function (error) {
                console.debug("err: ", error);
            });
        },
        init: function () {
            var userHistDne = dom.byId("userHistDne_userHistory"),
                userDetails;
            on(userHistDne, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, backView);
            }));
            userDetails = this.app.loadedStores.userMemory;
            cacheHistUserStore = new Cache(this.app.loadedStores.jsonUserDetails, userDetails);
            function dateFormatter(endDateTime) {
                var archivedDate = Function.formatDateHourMin (endDateTime); 
                return archivedDate;
            }
            grid = new DataGrid({
                autoHeight: true,
                structure: [{
                    name: "Archived Date",
                    field: "effectiveDateTime",
                    formatter: dateFormatter
                }, {
                    name: "Last Name",
                    field: "userLastName",
                    width: "20%"
                }, {
                    name: "First Name",
                    field: "userFirstName",
                    width: "20%"
                }, {
                    name: "N#",
                    field: "userIdentifier",
                    width: "20%"
                }, {
                    name: "User Change",
                    field: "change",
                    width: "20%",
                    formatter: function (inText) {                        
                        if(inText!= null && inText.search("UserStatus") != -1) {                            
                            if(inText.search("Removed") != -1) {
                                return "Archived";
                            }else{
                                return "Restored";
                            }
                        } else if(inText == null) {
                            return "Added";
                        } else {
                            return inText;
                        }
                    }
                }]
            }, "historyUserGrid_userHistory");
            grid.startup();
        }
    };
});
