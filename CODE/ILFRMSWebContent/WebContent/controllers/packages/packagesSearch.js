define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all", 
    "dojo/_base/lang", "dojo/dom-class",
    "dijit", "dijit/form/Form", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/form/FilteringSelect",
	"dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/form/CheckedMultiSelect",
    "dojo/query", "dojo/NodeList-traverse"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all, 
    lang, domClass, 
    dijit, Form, ComboBox, Button, DateTextBox, MultiSelect, FilteringSelect,
	EnhancedGrid, CSVWriter, CheckedMultiSelect, query
) {
    // Defined in main.js
	var Function = this.app.FunctionHelper;
    var Notice = this.app.NoticeHelper;
	
	return {
		
		init: function() {
			
			self = this;
            
            //var confDialog = Notice.showDialog({text:"Request completed. No matches found.", type: "info"});
            
            var formProductType = dijit.byId("selProductType_packageSearch");
            formProductType.set("searchAttr", "label");
            formProductType.set("labelAttr", "label");
            formProductType.set("placeHolder", "--Select--");
            formProductType.set("fetchProperties", sortObj);
            
            var formStateType = dijit.byId("selStateType_packageSearch");
            formStateType.set("searchAttr", "targetDescription");
            formStateType.set("placeHolder", "--Select--");
            formStateType.set("fetchProperties", sortObj);
            
            var formStateList = dijit.byId("selStateList_packageSearch");
            formStateList.set("searchAttr", "targetDescription");
            formStateList.set("labelAttr", "targetDescription");
            formStateList.set("placeHolder", "--Select--");
            formStateList.set("fetchProperties", sortObj);
            
            var formFormType = dijit.byId("selFormType_packageSearch");
            formFormType.set("searchAttr", "targetDescription");
            formFormType.set("labelAttr", "targetDescription");
            formFormType.set("placeHolder", "--Select--");
            formFormType.set("fetchProperties", sortObj);
            
            
            all({
                stateTypeMemStore: defStateTypeMemStore,
                timingCodeList: defStateMemStore,
                stateList: defDocFormTpMemStore,
                defferedProdTypeStore: defferedProdTypeStore
            }).then(function(results){
                // These are all deffered calls, stores are already set from the main.js _getJsonRefDataMemoryStore()
                formFormType.setStore(docFormTpMemStore);
                formStateType.store = stateTypeMemStore;
                formStateList.setStore(stateMemStore);
                formProductType.setStore(results.defferedProdTypeStore);
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
            
            var btnSearch = dijit.byId("btnSearch_packageSearch");
            btnSearch.on("click",function(e){self.doSearch(e);});
            
            var btnCancel = dijit.byId("btnClear_packageSearch");
            btnCancel.on("click",function(e){
                
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
            
            var searchInput = {};
            
            var packageName = dijit.byId("txtPackageName_packageSearch").get("value");
            if(packageName)
                searchInput.packageName = packageName;
            
            var formTypeCodesArray = dijit.byId("selFormType_packageSearch").get("value");
            var formTypeCodes = formTypeCodesArray.join(",");
            if(formTypeCodes)
               searchInput.formTypeCodes = formTypeCodes;
            
            var stateCodes = dijit.byId("selStateList_packageSearch").get("value");
            if(stateCodes)
               searchInput.stateCodes = stateCodes;
            
            var asOfDate = dijit.byId("selAsOfDate_packageSearch").get("value");
            if(asOfDate)
               searchInput.asOfDate = Function._isoDateFormatter(asOfDate);
            
            var productSubTypeCodes = dijit.byId("selProductType_packageSearch").get("value");
            if(productSubTypeCodes)
                searchInput.productSubTypeCodes = productSubTypeCodes;
            
            var stateTypeCode = dijit.byId("selStateType_packageSearch").get("value"); 
            if(stateTypeCode)
                searchInput.stateTypeCode = stateTypeCode;
            
            

            var queryString = Function._urlFromObject(searchInput);
            console.log('searching ', searchInput, queryString);
            
            Notice.loading();
            cachePackagesStore.query(queryString).then(function(results){
                //hard codeing the response
                if(results !== null) {
                    Notice.showSuccess("Request Completed.");
                    var objStore = new ObjectStore({
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
                grid.setStore(null);
                
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