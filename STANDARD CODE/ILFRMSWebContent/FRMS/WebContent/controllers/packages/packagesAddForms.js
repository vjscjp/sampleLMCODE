define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all",
    "dijit", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dojo/_base/lang", 
    "controllers/widgets/widgFormSearch.js",
    "dojox/grid/EnhancedGrid", "dojox/grid/_CheckBoxSelector", "models/packages/packageVersionModel.js",
    "dojo/domReady!"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all,
    dijit, ComboBox, Button, DateTextBox, MultiSelect,
	lang, FormSearch,
    EnhancedGrid, _CheckBoxSelector, packageVersionModel
) {
	var Function = this.app.FunctionHelper;
    var Notice = this.app.NoticeHelper;
    var addGrid, selDateException, gridData;
	
	return {
		
		init: function() {
			
			var self = this;
            var layout;

            var formSearchDiv = dom.byId("packageFormSearch_packageAddForm");
			var formSearchWidget = new FormSearch();
			formSearchWidget.placeAt(formSearchDiv);
            
            //Grid
            
            
            layout = [{
                type: "dojox.grid._CheckBoxSelector"
            }, [ {
                name : "Details",
                field : "formId",
                formatter : detailFormatter,
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
                formatter : dateFormatter,
                width : "5%"
            }, {
                name : "State Exp",
                field : "stateExpDate",
                formatter : dateFormatter,
                width : "5%"
            }, {
                name : "Form Description",
                field : "formDesc",
                formatter : stringFormatter,
                width : "15%"

            } ]];
            
            
            addGrid = new EnhancedGrid({
                autoHeight: true,
                loadingMessage: "Retrieving search results..",
                structure: layout
            }, "packageFormGrid_packageAddForm");
            
            addGrid.startup();
            
            // Grid Formater
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
                }
                return ctgyNm;
            };
            var detailFormatter = function (formId) {

                var btn = new Button({
                    label : "View/Modify",
                    onClick : function (e) {
                        var data = {}, type = {}, hasUserFormRWAccess = {}, path = {}, transOpts;
                        console.debug("The selected form id is...", formId);
                        data.id = formId;
                        data.type = formViewOrEditLabel;
                        data.hasUserFormRWAccess = hasUserFormRWAccess;
                        data.path = FROM_SEARCH_ROW_TO_FORM_CRT_EDT;
                        transOpts = {
                            target : "formsCreate",
                            data : data
                        };
                        localApp.transitionToView(e.target, transOpts);
                    }
                });
                return btn;
            };
            function dateFormatter(value) {
                if (value) {
                    return Function._isoDateFormatter(value)
                }
            }
            
            
            selDateException = dijit.byId("selDateException_packageAddForm");
            selDateException.set("searchAttr", "targetDescription");
            selDateException.set("placeHolder", "--Select--");
            selDateException.set("fetchProperties", sortObj);
            selDateException.store = queryExceptionDateStore;


            // Call search btn from here so we don't have to emit from widget and have better scoping
            on(formSearchWidget.formBtnSearch_formSearch, "click",  function (e) {
                 Notice.loading();
                var recordResults = formSearchWidget.btnSearchClick();
                all({
                    recordResults: recordResults
                }).then(function(results){
                    //Notice.doneLoading();
                    // strip it down and built it up to remove the deffered
                    var gridDataMem = new Memory( { data: results.recordResults.objectStore.data } );
                    gridData = new ObjectStore( { objectStore: gridDataMem } );
                    addGrid.setStore(gridData);
                }, function (error) {
                            //Notice.doneLoading(); -- notices handled in widget
                            //Notice.showSuccess("Request completed. No Matches found");
                });
            });
            
            formSearchWidget.formBtnClear_formSearch.on("click", function () {
                formSearchWidget.form_formSearch.reset();
            });
            
            on(dijit.byId("btnUpdate_packageAddForm"), "click", lang.hitch(this, function (e) {
                if(! dijit.byId("form_packageAddForm").validate()){                    
                    Notice.showWarning("Form not valid"); 
                }else{
                    self.savePackage(e);
                }
            }));
            
            on(dijit.byId("dateEffective_packageAddForm"), "change", function (e) {
                self.filterDates();
            });
            
            on(dijit.byId("dateExpiration_packageAddForm"), "change", function (e) {
                self.filterDates();
            });
            
            dijit.byId("btnCancel_packageAddForm").on("click",function(e){
                self.transitionTo(e,"packagesViewModify", {
                    code: self.params.code,
                    action: "modify"
                });
            });
          
		},
        
        afterActivate: function(){
            Function.doAfterActivate();
        },
        
        beforeDeactivate: function(nextView, data){
            Function.doBeforeDeactivate();
        },

        
        // to be noted selected index stays the same after filter, they are simply null array elements
        filterDates: function(){
            // can't allow any docs outside of inserted date
            var newDocs = [], newGridDataMem, newGridData, endDate, startDate;

            startDate = new Date(dijit.byId("dateEffective_packageAddForm").get("value")).getTime();
            endDate = new Date(dijit.byId("dateExpiration_packageAddForm").get("value")).getTime();

            dojo.forEach(gridData.objectStore.data, function(data){
                
                var effDt = 0;
                if(typeof data.stateEffDate != "undefined" && data.stateEffDate != '' && data.stateEffDate != null){
                    effDt = Function._returnDateObj(data.stateEffDate).getTime();
                }
                //end date could be blank
                //var tmpEnd = (data.stateExpDate ? data.stateExpDate : "12/31/9999");
                var endDt = new Date("12/31/99999").getTime();
                if(typeof data.stateExpDate != "undefined" && data.stateExpDate != '' && data.stateExpDate != null){
                    endDt = Function._returnDateObj(data.stateExpDate).getTime();
                }
                // start date is default to 0 if no selection
                if(endDate){
                    // inside if( (endDt >= startDate && endDt <= endDate) && (effDt >= startDate && effDt <= endDate)){
                    // need outside
                    if( (endDate <= endDt) && (startDate >= effDt)){
                        newDocs.push(data);
                    }
                // its just the start dte
                }else{
                    if(startDate >= effDt){
                        newDocs.push(data);
                    }
                }

            });
            newGridDataMem = new Memory( { data: newDocs } );
            newGridData = new ObjectStore( { objectStore: newGridDataMem } );
            addGrid.setStore(newGridData);  
        },
        
        savePackage: function(e){
                var documentList = [];
                
                var docDtTypeCd = '', docTypeName = '', endDate = "", effDate = "";
                
//                var dateExpSelect = document.getElementById("selDateException_packageAddForm");
//                if(typeof dateExpSelect.selectedIndex != "undefined" && dateExpSelect.selectedIndex != -1){
//                    var dateExpOption = dateExpSelect.options[dateExpSelect.selectedIndex];
//                    docDtTypeCd = dateExpOption.value;
//                    docTypeName = dateExpOption.text;
//                }
                
                docDtTypeCd = selDateException.get('value');
                docTypeName = selDateException.get('name');
                
                effDate = dijit.byId("dateEffective_packageAddForm").get("value");
                endDate = "12/31/9999";    
                if(dijit.byId("dateExpiration_packageAddForm").get("value")){
                    endDate =  dijit.byId("dateExpiration_packageAddForm").get("value") ;
                }
                
                selectedItem = addGrid.selection.getSelected();
                
                if(selectedItem.length == 0){
                    Notice.showWarning("Please search for and select a document from the list");   
                    return false;
                }
                
                dojo.forEach(selectedItem, function(doc){
                    documentList.push({
                        // from the Forms
//                        formDesc: "Test"
//                        formId: 10583265
//                        formNum: "Tc114_1"
//                        formOrgnlId: 10583265
//                        formTitle: null
//                        revDate: "12/20"
//                        state: null
//                        stateCd: null
//                        stateEffDate: null
//                        stateExpDate: null
//                        stateShrtNm: null
//                        stateType: null
//                        stateTypeCd: null
//                        stateTypeNm: null
                        
                        // no sub class
                        
                        // Mixed
                        id: doc.formId,
                        origDocId: doc.formOrgnlId,
                        classification: doc.stateCd,
                        docDtTypeCd: docDtTypeCd,
                        docDtTypeNm: docTypeName,
                        documentTitle: doc.formTitle,
                        effectiveDate: Function.formatLocalDate(effDate),
                        expirationDate: Function.formatLocalDate(endDate),
                        subclassification: "",
                        changeInd: "A"
                        
                        // from the version
//                        classification: "cl123"
//                        docDtTypeCd: "545454"
//                        docDtTypeNm: "Application Sign Date"
//                        documentTitle: "Test doc title 1-47"
//                        effectiveDate: "01/15/2014"
//                        expirationDate: "12/31/2016"
//                        id: doc.id,
//                        seqCount: 1
//                        seqNum: 1
//                        state: "MA"
//                        subclassification: "sc321"
                    });
                });
                console.log("Selected Docs are", documentList);
                effDate = Function._isoDateFormatter(effDate);
                endDate = Function._isoDateFormatter(endDate);
                packageVersionModel.addTo(effDate, endDate, this.params.code, documentList);
                //packageVersionModel.addDates(effDate, endDate, this.params.code);
                //packageVersionModel.addingDocsToDates(effDate, endDate, documentList);
                
                // do save here
                //console.log("Doc in package before SAVING: ", packageVersion);
                //this.transitionTo(e,"packagesVerifyOrder", {type:"document", code: this.params.code});
                var packageVersionDropDownList = packageVersionModel.loadChangedVersionsDropDown();
                
                // only save if one package version is changed, else go to pacakge view modify
                if(packageVersionDropDownList.length > 1){
                    self.transitionTo(e,"packagesVerifyOrder", {type:"document", code: self.params.code});  
                }else{
                    var savedVersion = packageVersionModel.returnForSave(self.params.code, "save");

                    all({ savedVersion: savedVersion}).then(function(results){
                        
                        var transOpts = {
                                target : "packagesViewModify",
                                params : {code: self.params.code}
                            };
                        self.app.transitionToView(e.target, transOpts);	
                    });
                }
        },
  
		transitionTo: function(e, targetView, paramSettings) {
			var transOpts = {
					target : targetView,
					params : paramSettings
				};
			this.app.transitionToView(e.target, transOpts);		
		},
		
	};
});