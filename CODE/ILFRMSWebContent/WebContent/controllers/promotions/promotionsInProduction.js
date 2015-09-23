define([ "dijit/registry", "dojo/on", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/store/Memory",
    "dojox/grid/EnhancedGrid", "dijit/form/Button", "controllers/widgets/functions.js"],
        function (registry, on, lang, ObjectStore, Memory, EnhancedGrid, Button, Functions) {
        "use strict";
        var functions = new Functions();
    
        return {
            init: function () {
                  var localApp=this.app,
                    inProductionGrid = null,
                    cancelButton = registry.byId("btnDone_production"),
                    layout = null;
        
                function formatDate(date) {
                    if(date.indexOf("T") > 0) {
                        date = date.slice(0, date.indexOf("T"));
                    }
                    return functions._isoDateFormatterShort(date);
                }
                
                function viewFormatter(id) {
                    var btn = new Button({
                        label: "View",
                        onClick: function (e) {
                            var transOpts = {
                                    target : "releaseGroup",
                                    data : {"id": id}
                                };
                            localApp.transitionToView(e.target, transOpts);
                        }
                    });
                    return btn;
                } 
                
                layout = [ {
                        name : "Release Group",
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
                        name : "Production",
                        field : "statusStartDate",
                        width : "20%",
                        formatter : formatDate
                    }, {
                        name : "View",
                        field : "id",
                        width : "10%",
                        formatter : viewFormatter
                    } ];

                    inProductionGrid = new EnhancedGrid({
                        autoHeight : true,
                        structure : layout,
                        sortInfo : -6
                    }, "inProductionReleaseGrid");
                    
                 inProductionGrid.startup();
                
                on(cancelButton, "click", lang.hitch(this, function (e) {this.cancelChanges(e); }));
            },


            afterActivate: function (previousView, data) {
                var releaseGroupsJsonRest = this.app.loadedStores.releaseGroupsJsonRest,
                    params = {"status": ["Installed"]},
                    inProductionGrid = registry.byId("inProductionReleaseGrid");
                
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
            },
            
             cancelChanges: function (e) {
        		  this.app.transitionToView(e.target, {target: "promotionInProgress"});
             }
        };
    });