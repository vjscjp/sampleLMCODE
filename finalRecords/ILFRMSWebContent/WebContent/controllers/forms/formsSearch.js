//Predefined tokens
/*global define, document, console, dojo, dijit, alert : true*/

//Custom Stores
/*global productNamesMemStore : true*/
/*global productSeriesMemStore : true*/
/*global productTypesMemStore : true*/
/*global docFormTpMemStore : true*/
/*global businessFunMemStore : true*/
/*global stateMemStore : true*/
/*global stateTypeMemStore : true*/
/*global clasftnMemStore : true*/
/*global subClassMemStore : true*/

//Custom global variables
/*global FORM_VIEW_OR_EDIT : true*/
/*global NAVIGATION_LINK_PATH, errorStyleClass, REQUIRED_FIELDS_MISSING, FORM_SEARCH_SUCCESS_RESULTS,
  FROM_SEARCH_ROW_TO_FORM_CRT_EDT, fromCrtOrUpdFormToSearch: true*/


define(["dojo/request", "dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid",
     "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/promise/all",
     "dijit/registry", "dijit/form/Button",
     "dojo/json", "dijit/form/Form", "dijit/Dialog",
     "dojo/_base/window",
     "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojo/ready",
     "dojox/mvc",
     "dojox/form/CheckedMultiSelect", "dojo/_base/array",
     "dijit/form/MultiSelect", "dojo/dom-construct", "dijit/form/ValidationTextBox",
     "dijit/form/Select", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr",
     "dojo/query", "dojo/Deferred", 
    "controllers/widgets/widgFormSearch.js",    
    "dojo/domReady!"],
    function (request, on, dom, EnhancedGrid, ObjectStore, Memory, all,
        registry, Button, json, Form, Dialog, win, CSVWriter, ready,
        mvc, CheckedMultiSelect, array, MultiSelect,
        domConstruct, ValidationTextBox, Select, domClass, domStyle, domAttr, query, Deferred, FormSearch) {
        // "use strict"; -- not working with this.app
        var labelValueObj = {}, label = {}, cd = {}, value = {}, formSearchGrid, formSearchMemStore,
            formSrchResultStore, jsonRestFormSearchStore, searchLayout, localApp, 
            displayErrorDiv, displayInfoDiv, displayWarnDiv, subClsftnCMSelect, globalEvent, fullScreen, exportBtn, selfFormSearchObj;
    
        var Function = this.app.FunctionHelper;
        var Notice = this.app.NoticeHelper;
        
        /**
         * This method disables or enables the label style
         */
        function disableOrEnableErrMsg(selectedVal, label) {
            if (selectedVal) {
                domAttr.remove(query(label)[0], "style");
                //domClass.remove(displayErrorDiv, 'error');
                //displayErrorDiv.innerText = "";
            } else {
                domStyle.set(dojo.query(label)[0], errorStyleClass);
            }
        }
        /**
         * This method disables or enables the label style
         */
        function disableOrEnableErrMsgForCMSelect(selectedVal, label) {
            if (selectedVal.length > 0) {
                domAttr.remove(query(label)[0], "style");
                //domClass.remove(displayErrorDiv, 'error');
                //displayErrorDiv.innerText = "";
            } else {
                domStyle.set(dojo.query(label)[0],
                    errorStyleClass);
            }
        }
        /**
        * This function clear the error message
        */
        function disableErrMsg(noFocusClass, tempSearchFldClass, tempFormNumClass) {
            query(noFocusClass).forEach(function (node, index, arr) {
                dijit.byNode(node).set("required", false);
            });
            query(tempSearchFldClass).forEach(function (node, index, arr) {
                domAttr.remove(node, "style");
            });
            domAttr.remove(query(tempFormNumClass)[0], "style");
            //displayErrorDiv.innerText = "";
            //displayInfoDiv.innerText = "";
            //domClass.remove(displayErrorDiv, 'error');
            //domClass.remove(displayInfoDiv, 'info');
            
        }
        /**
        * This method gives the label valud object for given array of objects
        */
        function getCodeArrayObjs(arrayObjects) {
            var labelValArray = [], labelValueObj = {}, cd = {};
            array.forEach(arrayObjects, function (code) {
                labelValueObj.cd = code;
                labelValArray.push(labelValueObj);
                labelValueObj = {};
            });
            return labelValArray;
        }
        /**
        * This method gives the label value object.
        */
        function getLabelValueObjs(arrayObjects) {
            var labelValArray = [], labelValueObj = {}, label = {}, value = {};
            array.forEach(arrayObjects, function (arrayObject) {
                labelValueObj.label = arrayObject.targetDescription;
                labelValueObj.value = arrayObject.targetCode;
                labelValArray.push(labelValueObj);
                labelValueObj = {};
            });
            return labelValArray;
        }

        return {
            init : function () {
            	selfFormSearchObj = this;
            	localApp = this.app;
				
				//displayErrorDiv = dom.byId("displayErrorMsg_formSearch");
                //displayInfoDiv = dom.byId("displayInfoMsg_formSearch");
                //displayWarnDiv = dom.byId("displayWarnMsg_formSearch");
                
                // Search Widgett Set up
                // Could be a list of all required deffered items, but state looks to be the longest - Not I think we should have a blank page for the default, form search is to complicated
                all({defStateMemStore : defStateMemStore}).then(function (results) {
                    var formSearchDiv = dom.byId("packageFormSearch_formSearch");
                    var formSearchWidget = new FormSearch();
                    formSearchWidget.placeAt(formSearchDiv);
                    Notice.doneLoading();
                    
                    
                    // Call search btn from here so we don't have to emit from widget and have better scoping
                	on(formSearchWidget.formBtnSearch_formSearch, "click", function (event) {
                	    var recordResults = formSearchWidget.btnSearchClick();
						globalEvent = event;
                	    fullScreen.set("disabled", true); // Don't really need to disable the button, loading does this
                	    exportBtn.set("disabled", true);
                        //Notice.loading(); Notices are inside the widget, same with error notice
                	    all({
                 	       recordResults: recordResults
                 	   }).then(function(results){
                 	       formSearchGrid.setStore(results.recordResults);
                           // strip it down and built it up to remove the deffered
                           var formsSearchResultsMem = new Memory( { data:results.recordResults.objectStore.data } );
                           formsSearchResultsStore = new ObjectStore( { objectStore: formsSearchResultsMem } );
                 	       //formsSearchResultsStore = new ObjectStore({data:results.recordResults}); 
                 	       fullScreen.set("disabled", false);
                 	       exportBtn.set("disabled", false);
                 	   });
                	});
                    
                    
                    formSearchWidget.formBtnClear_formSearch.on("click", function () {
						formSearchWidget.clearFromFields();
						formSearchGrid.setStore(null);
						fullScreen.set("disabled", true);
			     	    exportBtn.set("disabled", true);
						disableErrMsg(".noFocusClass", ".tempSearchFldClass", ".tempFormNumClass");
				    });
                });
                
                
                
                
                fullScreen = registry.byId("btnFormFullScreen_formSearch"); 
                exportBtn = registry.byId("btnFormExport_formSearch");
                fullScreen.set("disabled", true);
                exportBtn.set("disabled", true);
                
                //Building up the grid columns

                var stringFormatter = function (value, rowIdx) {
                    var stringObj = '';
                    if (value) {
                        stringObj = value;
                    }
                    return stringObj;
                };

                var stNmFormatter = function (value, rowIdx) {
                    var stringObj = '';
                    if (value) {
                        stringObj = value;
                    }
                    return stringObj;
                };

                var stTypeNmFormatter = function (value, rowIdx) {
                    var ctgyNm = '';
                    if (value) {
                        ctgyNm = value;
                    } else {
						ctgyNm = "Issue";
					}
                    return ctgyNm;
                };
                var detailFormatter = function (formId) {

                    var btn = new Button({
                        label : "View/Modify",
                        onClick : function (e) {
							// Notice.loading(); notice only for REST calls
							var param = {}, type = {}, hasUserFormRWAccess = {}, path = {}, transOpts;
                            console.debug("The selected form id is...", formId);
                            param.id = formId;
                            param.type = FORM_VIEW_OR_EDIT;
                            param.hasUserFormRWAccess = hasUserFormRWAccess;
                            param.path = FROM_SEARCH_ROW_TO_FORM_CRT_EDT;
							param.isInit = true;
                            transOpts = {
                                target : "formsCreate",
                                data : param
                            };
                            localApp.transitionToView(e.target, transOpts);
                        }
                    });
                    return btn;
                };
                function isoDateFormatter(value) {
                    if (value) {
						return Function._isoDateFormatter(value);
                    }
                }
				searchLayout = selfFormSearchObj.getGridLayout(detailFormatter, stringFormatter,
						stNmFormatter, stTypeNmFormatter, isoDateFormatter);
                
                formSearchGrid = dijit.byId("formgrid_formSearch");
                formSearchGrid.set("structure", searchLayout);
                formSearchGrid.set("autoHeight", 20);
                formSearchGrid.set("loadingMessage", "Retrieving form search results..");
                formSearchGrid.set("selectionMode", "single");
                formSearchGrid.set("plugins", {exporter: true});
                formSearchGrid.startup();
               
                // Export to XLS event
                dijit.byId("btnFormExport_formSearch").on("click", function (e) {
                    formSearchGrid.exportGrid("csv", {writerArgs: {separator: "\t"}}, function (str) {
                        Function.exportGrid(str, "Form_Search_Results.xls");

                    });
                });  
 

                // Event for fullscreen
                on(fullScreen, "click", function (e) { 
                    var fullScreenGrid, searchGridDialog, fulScreenResultsLayout;
					
					var fullScreendtlFrmtr = function (formId) {
						var btn = new Button({
							label : "View/Modify",
							onClick : function (e) {
								// Notice.loading(); notice only for REST calls
								var param = {}, type = {}, hasUserFormRWAccess = {}, path = {}, transOpts;
								console.debug("The selected form id is...", formId);
								param.id = formId;
								param.type = FORM_VIEW_OR_EDIT;
								param.hasUserFormRWAccess = hasUserFormRWAccess;
								param.path = FROM_SEARCH_ROW_TO_FORM_CRT_EDT;
								param.isInit = true;
								transOpts = {
									target : "formsCreate",
									data : param
								};
								console.debug('globalEvent.target-->', globalEvent.target);
								searchGridDialog.hide();
								localApp.transitionToView(globalEvent.target, transOpts);
							}
						});
						return btn;
					};
					
					fulScreenResultsLayout = selfFormSearchObj.getGridLayout(fullScreendtlFrmtr, stringFormatter,
						stNmFormatter, stTypeNmFormatter, isoDateFormatter);
					try {
                        fullScreenGrid = new EnhancedGrid({
                            structure : fulScreenResultsLayout,
                            autoHeight : 40,
                            style: 'width:100%;height:100%',
                            plugins : {
                                exporter : true
                            }
                        }, "fullScreenGrid");
                        fullScreenGrid.startup();

                        fullScreenGrid.setStore(formsSearchResultsStore);
                        searchGridDialog = new Dialog({
                            title : "Form Search Results",
                            content : fullScreenGrid,
                            style : "width: 95%; height: 80%;"
                        });
                        searchGridDialog.show();
                    } catch (error) {
                        alert(error);
                    }
                });
                
            },
            beforeActivate: function (previousView, data) {
                console.debug('Start of beforeActivate of method..');
				//displayErrorDiv.innerText = "";
				//domClass.remove(displayErrorDiv, 'error');
				//displayInfoDiv.innerText = "";
				//domClass.remove(displayInfoDiv, 'info');
				formSearchGrid.setStore();
                if (data) {
                    if (data.path && data.path === NAVIGATION_LINK_PATH) {
						console.debug('if part of ');
                        globalEvent = null;
                        disableErrMsg(".noFocusClass", ".tempSearchFldClass", ".tempFormNumClass");
                    } else if (data.path && data.path === fromCrtOrUpdFormToSearch) {
                        console.debug('Else part of ');
                    	//displayErrorDiv.innerText = "";
                    	//domClass.remove(displayErrorDiv, 'error');
                        disableErrMsg(".noFocusClass", ".tempSearchFldClass", ".tempFormNumClass");
                        //domClass.add(displayInfoDiv, 'info');
                        //displayInfoDiv.innerText = data.displayMsg + data.cmntCreateRes;
						//displayInfoDiv.innerText = data.displayMsg;
						Notice.showSuccess(data.displayMsg);
					}
                }
				fullScreen.set("disabled", true);
                exportBtn.set("disabled", true);
				console.debug('End of beforeActivate method..');
            },
			getGridLayout : function(dtlFrmtr, stringFormatter, stNmFormatter, stTypeNmFormatter, isoDateFormatter) {
				var fulScreenResultsLayout = [{
						name : "Details",
						field : "formId",
						formatter : dtlFrmtr,
						width : "10%"
					}, {
						name : "Form Title",
						field : "formTitle",
						formatter : stringFormatter,
						width : "15%"

					}, {
						name : "Form #",
						field : "formNum",
						width : "10%"
					}, {
						name : "Revision Date",
						field : "revDate",
						formatter : stringFormatter,
						width : "5%"
					}, {
						name : "State",
						field : "stateShrtNm",
						formatter : stNmFormatter,
						width : "5%"
					}, {
						name : "State Type",
						field : "stateTypeNm",
						formatter : stTypeNmFormatter,
						width : "10%"
					}, {
						name : "State Eff",
						field : "stateEffDate",
						formatter : isoDateFormatter,
						width : "5%"
					}, {
						name : "State Exp",
						field : "stateExpDate",
						formatter : isoDateFormatter,
						width : "5%"
					}, {
						name : "Form Description",
						field : "formDesc",
						formatter : stringFormatter,
						width : "15%"

					} ];
				return fulScreenResultsLayout;
			}
			

        };
    });
