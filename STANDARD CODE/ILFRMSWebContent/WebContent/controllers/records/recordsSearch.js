/*global define:true,dijit:true,dojo:true,alert:true,console:true*/
define(["dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/promise/all",
    "dojo/store/Memory", "dojo/store/Cache", "dijit/registry", "dijit/form/Button", "dijit/Dialog",
    "controllers/widgets/widgRecordSearch.js",
    "dijit/form/Form", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "controllers/widgets/functions.js",  "dojo/json"
    ], function (on, dom, EnhancedGrid, lang, ObjectStore, all, Memory, Cache, registry, Button, Dialog, RecordSearch, Form, 
		CSVWriter, domClass, domAttr, domStyle, Functions, json) {
    "use strict";
    var Function = new Functions();
    var localApp,
        grid = null,
        fullGrid = null,
        selfRecObj, searchRecEvent, exportBtn, fullScreen, fullScreenDialog; 

    
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                params: {
                    id: 0
                }
            };
            this.app.transitionToView(e.target, transOpts);
        },
        init: function () {
			console.debug("In init method of record search function");
		    selfRecObj = this;
            localApp = this.app;
            
            
			//displayErrorDiv = dom.byId("displayErrorMsg_recordsSearch");
            //displayInfoDiv = dom.byId("displayInfoMsg_recordsSearch");
			exportBtn = dijit.byId("btnExport_recordsSearch"); 
			fullScreen = dijit.byId("btnFullScreen_recordsSearch");
			exportBtn.set("disabled", true);
			fullScreen.set("disabled", true);
			
			
            var recordSearchDiv = dom.byId("recordSearchDiv"), idToEdit, cacheRecordsStore, memRecords;
            var recordSearchWidget = new RecordSearch();
            recordSearchWidget.placeAt(recordSearchDiv);
            memRecords = this.app.loadedStores.recordsMemory;
            cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords);
			
			var layout = selfRecObj.getGridLayOut();
			grid = dijit.byId("grid_recordsSearch");
			grid.set("structure", layout);
			grid.set("autoHeight", true);
			grid.set("loadingMessage", "Retrieving Record search results..");
			grid.set("selectionMode", "single");
			grid.set("plugins", {nestedSorting: true}),
			grid.set("plugins", {exporter: true});
			grid.startup();
            
             // Call search btn from here so we don't have to emit from widget and have better scoping
            on(recordSearchWidget.btnSearch_recordsSearch, "click", function (event) {
				searchRecEvent = event;
				//displayErrorDiv.innerText = "";
				//displayInfoDiv.innerText = "";
				//domClass.remove(displayErrorDiv, 'error');
				//domClass.remove(displayInfoDiv, 'info');
                
				// Notice.loading(); NOTICE is handled inside the widget same with error
                var recordResults = recordSearchWidget.btnSearchClick();
                all({
                    recordResults: recordResults
                }).then(function(results){
                    grid.setStore(results.recordResults);
					console.debug('results.recordResults--->', results.recordResults);
					//Notice.showSuccess(RECORD_SEARCH_SUCCESS);
					exportBtn.set("disabled", false);
					fullScreen.set("disabled", false);
                });
            });
            
            
            on(recordSearchWidget.btnClear_recordsSearch, "click", function (e) {
                recordSearchWidget.clearForm();
                grid.setStore(null);
            });
            
             
			//Form comment save
            on(dijit.byId("saveBtn_expDate"), "click", lang.hitch(this, function (e) {
                var createRecResDeferred, recCreateReq = {}; 
                cacheRecordsStore.query(idToEdit)
						.then(function (results) {                    
							var respJson = dojo.fromJson(json.stringify(results)); 
                            recCreateReq = respJson.record;
                            recCreateReq.endDtTm = dijit.byId("expirationDate_recordsUpdate").get("value");  
                            createRecResDeferred = dojo.xhrPut(Function.getXhrArguments(cacheRecordsStore.target+idToEdit, recCreateReq, SM_USER)); 
				            createRecResDeferred.then(function(value) {
                                var recordResults = recordSearchWidget.btnSearchClick();
                                all({
                                    recordResults: recordResults
                                }).then(function(results){
                                    grid.setStore(results.recordResults);
                                },function(error) {
                                    console.error('Exception while retrieving the record results based on the search:', error);
                                    Notice.showError(RECORD_SEARCH_FAILURE);
                               });                                                    
                            });
						}, function (error) {
 
					});
                 
                dijit.byId("updateDialog_expDate").hide();		
            }));
            
            on(dijit.byId("cancelBtn_expDate"), "click", lang.hitch(this, function (e) {
                  dijit.byId("updateDialog_expDate").hide();	                 
            }));
            
            on(dom.byId("btnFullScreen_recordsSearch"), "click", function () {
                var recordNumber, recordTitle, objStore, queryObj = {},
                    form = new Form(), fullGrid, fullScreenLayout;
					
				fullScreenLayout = selfRecObj.getGridLayOut();
				
                fullGrid = new EnhancedGrid({
                    autoHeight: true,
                    structure: fullScreenLayout
                }).placeAt(form.containerNode);
                fullGrid.startup();
                fullScreenDialog = new Dialog({
                    title: "Record Search Results",
                    content: form,
                    style: "width: 100%; height: 100%;"
                });
                fullGrid.setStore(grid.store); 
                fullScreenDialog.show();
            });
            
            // Export to XLS event
            on(dom.byId("btnExport_recordsSearch"), "click", function (e) {
                dijit.byId("grid_recordsSearch").exportGrid("csv", {writerArgs: {separator: "\t"}}, function (str) {
                    Function.exportGrid(str, "Record_Search_Results.xls");
                }); 
            }); 
                
            
            
        },
		beforeActivate: function (previousView, data) {
			
			if(data && data.displayMsg) {
				//domClass.add(displayInfoDiv, 'info');
				//displayInfoDiv.innerText = data.displayMsg;
				//Notice.doneLoading();
				var displayMsg = data.displayMsg;
				console.debug("data.displayMsg in record search::", data.displayMsg);
				Notice.showSuccess(displayMsg);
				grid.setStore(null);
			}
			exportBtn.set("disabled", false);
			fullScreen.set("disabled", false);

		},
		afterActivate: function (previousView, formdata) {
		
		},
		getGridLayOut : function() {
			self = this;
			var layout = [{
                name: "Detail",
                field: "id",
                width: "10%",
                formatter: detailFormatter
            }, {
                name: "History",
                field: "history",
                width: "10%",
                formatter: historyFormatter
            }, {
                name: "Record Number",
                field: "recordNumber",
                width: "30%"
            }, {
                name: "Record Title",
                field: "recordTitle",
                width: "30%"
            }, {
                name: "Life Exp Date",
                field: "lifeExprtnDt",
                width: "20%",
                formatter : formatDate
            }, {
                name: "Update Exp Date",
                field: "id",
                width: "20%",
                formatter: updateExpDate
            }];
		      
            // Formater for table
            function historyFormatter(value, idx){
                var gridRow = grid.getItem(idx);
                //console.log("button item", gridRow);
                var btn = new Button({
                    label: "View",
                    onClick: function(e) {

                        var transOpts = {
                                target : 'recordsHistory',
                                params : {
                                    "id": gridRow.id,
                                    "crtdDtTm": gridRow.crtdDtTm,
                                    "crtdByUsrId": gridRow.crtdByUsrId,
                                    "recordTitle": gridRow.recordTitle
                                }
                            };
                        if(typeof fullScreenDialog != "undefined" && fullScreenDialog){
                            fullScreenDialog.hide();
                        }
                        localApp.transitionToView(searchRecEvent.target, transOpts);
                    }
                });
                return btn;
            }

            function detailFormatter(value, idx){
                var gridRow = grid.getItem(idx);
                //console.log("button item", gridRow);
                var btn = new Button({
                    label: "View/Modify",
                    onClick: function(e) {
                        // Notice.loading(); We do't need noticees between transitions only on REST calls
                        var transOpts = {
                                target : 'recordsCreate',
                                params : {
                                    "id": gridRow.id
                                }
                            };
                        if(typeof fullScreenDialog != "undefined" && fullScreenDialog){
                            fullScreenDialog.hide();
                        }
                        localApp.transitionToView(searchRecEvent.target, transOpts);
                    }
                });
                return btn;
            }


            function updateExpDate(value, idx) {
                var gridRow = grid.getItem(idx);     
                var btn = new Button({
                    label: "Update Exp Date",
                    onClick: function(e) { 
                        idToEdit = gridRow.id;
                        var expDate = dijit.byId("expirationDate_recordsUpdate");
                        dijit.byId("expirationDate_recordsUpdate").set("displayedValue", Function._isoDateFormatter(gridRow.lifeExprtnDt));
                        dijit.byId("updateDialog_expDate").show();
                    }
                });
                return btn;
            }
            
            function formatDate(date) { 
                if(date != null) {
                    return Function._isoDateTimeFormatter(date);
                }
            }
            
            return layout;
			
		},
        
        
    };
    
    
});
