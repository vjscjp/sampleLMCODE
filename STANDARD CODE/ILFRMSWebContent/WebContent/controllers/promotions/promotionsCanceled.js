define([ "dijit/registry", "dojo/on", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/store/Memory",
    "dojox/grid/EnhancedGrid", "controllers/widgets/functions.js"],
        function (registry, on, lang, ObjectStore, Memory, EnhancedGrid, Functions) {
        "use strict";
        var functions = new Functions();
    
        return {
       
            init: function () {
            
                function formatDate(date) { 
                    if(date.indexOf("T") > 0) {
                        date = date.slice(0, date.indexOf("T"));
                    } 
                    return functions._isoDateFormatterShort(date);
                }
                
               
                    var cancelButton = registry.byId("btnDone_releaseGroup"),
                    
                    layout = [ {
                        name : "Name",
                        field : "groupName",
                        width : "25%"
                    }, {
                        name : "Created",
                        field : "createDate",
                        width : "20%",
                        formatter : formatDate
                    }, {
                        name : "Created By",
                        field : "createNNumber",
                        width : "10%"
                    }, {
                        name : "Last",
                        field : "createLastName",
                        width : "15%"
                    }, {
                        name : "First",
                        field : "createFirstName",
                        width : "10%"
                    }, {
                        name : "Canceled",
                        field : "statusStartDate",
                        width : "20%",
                        formatter : formatDate
                    } ],

                    inProductionGrid = new EnhancedGrid({
                        autoHeight : true,
                        sortInfo:-6,
                        structure : layout
                    }, "canceledReleaseGrid");
                
                  on(cancelButton, "click", lang.hitch(this, function (e) {this.cancelChanges(e); }));
            },


            afterActivate: function (previousView, data) {
                var releaseGroupsJsonRest = this.app.loadedStores.releaseGroupsJsonRest,
                    params = {"status": ["Canceled"]},
                    inProductionGrid = registry.byId("canceledReleaseGrid");
                
                releaseGroupsJsonRest.target = "/frmsadminservice/api/v1/releasegroups";
                functions._setJsonRestEndpoint(releaseGroupsJsonRest);
                
                releaseGroupsJsonRest.query(params).then(function (results) {
                    if(results && results.releaseGroups) {
                        var objStore = new ObjectStore({
                            objectStore : new Memory({
                                data: results.releaseGroups
                            })
                        });

                        inProductionGrid.setStore(objStore);
                    } else {
                        inProductionGrid.setStore();
                    }
                });
                inProductionGrid.startup();
            },
            
             cancelChanges: function (e) {  
        		  this.app.transitionToView(e.target, {target: "promotionInProgress"});
             }

        };
    });