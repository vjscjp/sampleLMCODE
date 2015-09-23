/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define, console, Function, Notice,
    sortObj, defStateMemStore, defStateTypeMemStore, defDocFormTpMemStore, defferedProdTypeStore, docFormTpMemStore, stateTypeMemStore, stateMemStore*/

define([ 
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all", 
    "dojo/_base/lang", "dojo/dom-class",
    "dijit", "dijit/form/Form", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/form/FilteringSelect", "dijit/form/Textarea", "dijit/form/RadioButton",
	"dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/form/CheckedMultiSelect",
    "dojo/query", "dojo/NodeList-traverse"
	],
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all, 
    lang, domClass, 
    dijit, Form, ComboBox, Button, DateTextBox, MultiSelect, FilteringSelect, Textarea, RadioButton,
	EnhancedGrid, CSVWriter, CheckedMultiSelect, query
) {
    // Defined in main.js
//	var Function = this.app.FunctionHelper;
//    var Notice = this.app.NoticeHelper;
	var packageGrid;
    
	return {
		
		init: function() {
			var formProductType, formStateType, formStateList, formFormType, layout;
            
			var self = this;
            
            //Notice.loading();
            
            //var confDialog = Notice.showDialog({text:"Request completed. No matches found.", type: "info"});
            //Notice.showError("Required data has not been entered");
            
            formProductType = dijit.byId("selProductType_packageSearch");
            formProductType.set("searchAttr", "label");
            formProductType.set("labelAttr", "label");
            formProductType.set("placeHolder", "--Select--");
            formProductType.set("fetchProperties", sortObj);
            
            formStateType = dijit.byId("selStateType_packageSearch");
            formStateType.set("searchAttr", "targetDescription");
            formStateType.set("placeHolder", "--Select--");
            formStateType.set("fetchProperties", sortObj);
            
            formStateList = dijit.byId("selStateList_packageSearch");
            formStateList.set("searchAttr", "targetDescription");
            formStateList.set("labelAttr", "targetDescription");
            formStateList.set("placeHolder", "--Select--");
            formStateList.set("fetchProperties", sortObj);
            
            formFormType = dijit.byId("selFormType_packageSearch");
            formFormType.set("searchAttr", "targetDescription");
            formFormType.set("labelAttr", "targetDescription");
            formFormType.set("placeHolder", "--Select--");
            formFormType.set("fetchProperties", sortObj);
            
            
            all({
                stateMemStore: FRMS.deferredStateMemStore,
                stateTypeMemStore: FRMS.deferredStateTypeMemoryStore,
                timingCodeList: FRMS.deferredTimingCdMemStore,
                docFormTpMemStore: FRMS.deferredDocFormTypeMemStore
                //defferedProdTypeStore: FRMS.defferedProdTypeStore
            }).then(function(results){
                // These are all deffered calls, stores are already set from the main.js _getJsonRefDataMemoryStore()
                formFormType.setStore(FRMS.loadedStores.docFormTypeMemoryStore);
                formStateType.store = FRMS.loadedStores.stateTypeMemStore;
                formStateList.setStore(FRMS.loadedStores.stateMemStore);
                //FRMS.loadedStores.timingCdMemStore
//                formProductType.setStore(results.defferedProdTypeStore);
                Notice.doneLoading();
            });
            
            
            
			
			// set up package grid
			layout = [ {
				name : "View",
				field : "detail",
				width : "10%",
				formatter : viewFormatter
			}, {
				name : "Modify",
				field : "history",
				width : "10%",
				formatter : modifyFormatter
			}, {
				name : "Package Name",
				field : "packageName",
				width : "30%"
			}, {
				name : "Package Timing Code",
				field : "code",
				width : "30%"
			}, {
				name : "Effective Date",
				field : "effectiveDate",
                formatter: function(effectiveDate){
                    return Function._isoDateFormatter(effectiveDate);
                },
				width : "30%"
			}, {
				name : "Expiration Date",
				field : "expirationDate",
                formatter: function(expirationDate){
                    return Function._isoDateFormatter(expirationDate);
                },
				width : "20%"
			} ];
			
			packageGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout,
				sortInfo : 3,
				plugins: {exporter: true}
			}, "packageGrid");
			packageGrid.startup();
            
            // Export to XLS event
            dijit.byId("btnExport_packageSearch").on("click", function (e) {
                packageGrid.exportGrid("csv", {writerArgs: {separator: "\t"}}, function (str) {
                    Function.exportGrid(str, "Package_Search_Results.xls");
                });
            });  
            
            dijit.byId("btnSearch_packageSearch").on("click",function(e){self.doSearch(e);});
            
            dijit.byId("btnClear_packageSearch").on("click",function(e){
                
                formFormType.set('value',[]);
                formFormType._updateSelection();
                
                formStateList.set('value',[]);
                formStateList._updateSelection();
                
                formProductType.set('value',[]);
                formProductType._updateSelection();
                
                dijit.byId("form_packageSearch").reset();
            });
			
			
			function viewFormatter(value, idx){
                var gridRow = packageGrid.getItem(idx);
                //console.log("button item", gridRow.code);
				var btn = new Button({
					label: "View",
					onClick: function(e) {
                        self.transitionTo(e,"packagesViewModify",
                            {
                                "code" : gridRow.code,
                                "action" : "view"
                            }
                        );
					}
				});
				return btn;
			}
			
			function modifyFormatter(value, idx){
                var btn;
                var gridRow = packageGrid.getItem(idx);
                
                if(Function.hasPackageAccess()){
                    
                    btn = new Button({
                        label: "Modify",
                        onClick: function(e) {
                            self.transitionTo(e,"packagesViewModify",
                                {
                                    "code" : gridRow.code,
                                    "action" : "modify"
                                }
                            );
                        }
                    });
                }else{
                    btn = new Button({
                        label: "Modify",
                        disabled: true
                    });
                }
                    
				return btn;
			}
		},
        
        doSearch: function(e){
            var searchInput, packageName, formTypeCodesArray, formTypeCodes, stateCodes, asOfDate, productSubTypeCodes, stateTypeCode, queryString;
            
            searchInput = {}, cachePackagesStore;
            
            packageName = dijit.byId("txtPackageName_packageSearch").get("value");
            if(packageName)
                searchInput.packageName = packageName;
            
            formTypeCodesArray = dijit.byId("selFormType_packageSearch").get("value");
            formTypeCodes = formTypeCodesArray.join(",");
            if(formTypeCodes)
               searchInput.formTypeCodes = formTypeCodes;
            
            stateCodes = dijit.byId("selStateList_packageSearch").get("value");
            if(stateCodes)
               searchInput.stateCodes = stateCodes;
            
            asOfDate = dijit.byId("selAsOfDate_packageSearch").get("value");
            if(asOfDate)
               searchInput.asOfDate = Function._isoDateFormatter(asOfDate);
            
            productSubTypeCodes = dijit.byId("selProductType_packageSearch").get("value");
            if(productSubTypeCodes)
                searchInput.productSubTypeCodes = productSubTypeCodes;
            
            stateTypeCode = dijit.byId("selStateType_packageSearch").get("value"); 
            if(stateTypeCode)
                searchInput.stateTypeCode = stateTypeCode;
            
            

            queryString = FRMS.Utils.urlFromObject(searchInput);
            console.log('searching ', searchInput, queryString);
            
            Notice.loading();
            cachePackagesStore.query(queryString).then(function(results){
                var objStore;
                //hard codeing the response
                if(results !== null) {
                    Notice.showSuccess("Request Completed.");
                    objStore = new ObjectStore({
                        objectStore : new Memory({
                            data :  results.packages
                        })
                    });				
                    packageGrid.setStore(objStore);
                }else{
                    Notice.showSuccess("Request Completed. No matches found.");
                     packageGrid.setStore(null);
                }
                
            }, function(error) {
                Function.handleError(error);
                packageGrid.setStore(null);
                
            });  

        },
        
		transitionTo: function(e, targetView, params) {
			var transOpts = {
					target : targetView,
					params : params
				};
			this.app.transitionToView(e.target, transOpts);		
		},
		
	};
});