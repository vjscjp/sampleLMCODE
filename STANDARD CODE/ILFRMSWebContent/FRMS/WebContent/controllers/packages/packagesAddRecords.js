define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all", "dojo/_base/lang", "dojo/parser",
    "dijit", "dijit/form/Form", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/form/FilteringSelect", 
    "controllers/widgets/widgRecordSearch.js",
    "dojox/grid/EnhancedGrid", "dojox/grid/_CheckBoxSelector", "models/packages/packageVersionModel.js",
    "dojo/domReady!"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all, lang, parser,
    dijit, Form, ComboBox, Button, DateTextBox, MultiSelect, FilteringSelect,
	RecordSearch,
    EnhancedGrid, _CheckBoxSelector, packageVersionModel
) {
	var Function = this.app.FunctionHelper;
    var Notice = this.app.NoticeHelper;
    var addGrid, selDateException, gridData;
	
	return {
		
		init: function() {
			
			var self = this;
            
            var recordSearchDiv = dom.byId("packageRecordSearch_packageAddRecord");
			var recordSearchWidget = new RecordSearch();
			recordSearchWidget.placeAt(recordSearchDiv);
            
            layout = [{
                type: "dojox.grid._CheckBoxSelector"
            }, [{
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
                formatter : dateFormatter
            }, {
                name: "createTime",
                field: "crtdDtTm",
                width: "20%",
                hidden: true
            }, {
                name: "createUser",
                field: "crtdByUsrId",
                width: "20%",
                hidden: true
            }, {
                name: "TitleRecord",
                field: "recordTitle",
                width: "20%",
                hidden: true
            }]];
            
            addGrid = new EnhancedGrid({
                autoHeight: true,
                structure: layout
            }, "packageRecordGrid_packageAddRecord");
            
            addGrid.startup();
            
            function dateFormatter(value) {
                if (value) {
                    return Function._isoDateFormatter(value)
                }
            }
            
            selDateException = dijit.byId("selDateException_packageAddRecord");
            selDateException.set("searchAttr", "targetDescription");
            selDateException.set("placeHolder", "--Select--");
            selDateException.set("fetchProperties", sortObj);
            selDateException.store = queryExceptionDateStore;
            
            
            // Call search btn from here so we don't have to emit from widget and have better scoping
            on(recordSearchWidget.btnSearch_recordsSearch, "click", function (e) {
                var recordResults = recordSearchWidget.btnSearchClick();
                Notice.loading();
                all({
                    recordResults: recordResults
                }).then(function(results){
                    // Notice.doneLoading(); -- notice handled iside the widget
                    // strip it down and built it up to remove the deffered
                    var gridDataMem = new Memory( { data: results.recordResults.objectStore.data } );
                    gridData = new ObjectStore( { objectStore: gridDataMem } );
                    addGrid.setStore(gridData);
                });
            });
            
            on(recordSearchWidget.btnClear_recordsSearch, "click", function (e) {
                recordSearchWidget.clearForm();
                addGrid.setStore(null);
            });
            
            
            on(dijit.byId("btnUpdate_packageAddRecord"), "click", function (e) {

                if(! dijit.byId("form_packageAddRecord").validate()){                    
                    Notice.showWarning("Form not valid"); 
                }else{
                    self.savePackage(e);
                }
            });
            
            
            on(dijit.byId("dateEffective_packageAddRecord"), "change", function (e) {
                self.filterDates();
            });
            
            on(dijit.byId("dateExpiration_packageAddRecord"), "change", function (e) {
                self.filterDates();
            });
            
            dijit.byId("btnCancel_packageAddRecord").on("click",function(e){
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

            startDate = new Date(dijit.byId("dateEffective_packageAddRecord").get("value")).getTime();
            endDate = new Date(dijit.byId("dateExpiration_packageAddRecord").get("value")).getTime();

            dojo.forEach(gridData.objectStore.data, function(data){
                var effDt = 0;
                if(typeof data.endDtTm != "undefined" && data.endDtTm != '' && data.endDtTm != null){
                    effDt = Function._returnDateObj(data.effDtTm).getTime();
                }
                // blank end date
                //var tmpEnd = (data.endDtTm ? data.endDtTm : "12/31/9999");
                var endDt = new Date("12/31/99999").getTime();
                if(typeof data.endDtTm != "undefined" && data.endDtTm != '' && data.endDtTm != null){
                    endDt = Function._returnDateObj(data.endDtTm).getTime();
                }
                //if(endDt == NaN || !endDt) endDt = new Date("12/31/99999").getTime();
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
                
                var docDtTypeCd = '', docTypeName = '',startDate, endDate;
                
//                var dateExpSelect = document.getElementById("selDateException_packageAddRecord");
//                if(typeof dateExpSelect.selectedIndex != "undefined" && dateExpSelect.selectedIndex != -1){
//                    var dateExpOption = dateExpSelect.options[dateExpSelect.selectedIndex];
//                    docDtTypeCd = selDateException.value;
//                    docTypeName = selDateException.text;
//                }
                docDtTypeCd = selDateException.get('value');
                docTypeName = selDateException.get('name');
                
                
                selectedItem = addGrid.selection.getSelected();
                
                if(selectedItem.length == 0){
                    Notice.showWarning("Please search for and select a document from the list");   
                    return false;
                }
            
                startDate = dijit.byId("dateEffective_packageAddRecord").get("value");
                endDate = "12/31/9999";
                if(dijit.byId("dateExpiration_packageAddRecord").get("value")){
                    endDate = dijit.byId("dateExpiration_packageAddRecord").get("value");
                }
            
                dojo.forEach(selectedItem, function(doc){
                    if(doc != null){ // selected index stays true after filterDates
                        documentList.push({
                            // from the records
    //                        classCd: "11111"
    //                        classNm: "Disclosure"
    //                        effectiveDate: "2000-07-03"
    //                        expirationDate: null
    //                        id: 3
    //                        recordNumber: "Test RecordNumber"
    //                        recordSource: "Internal"
    //                        recordTitle: "HIV Disclosure"
    //                        subClassCd: "22222"
    //                        subClassNm: "HIV"

                            // Mixed
                            id: doc.id,
                            origDocId: doc.orgnlDocId,
                            classification: doc.classtnCd,
                            docDtTypeCd: docDtTypeCd,
                            docDtTypeNm: docTypeName,
                            documentTitle: doc.recordTitle,
                            effectiveDate: Function.formatLocalDate(startDate),
                            expirationDate: Function.formatLocalDate(endDate),
                            subclassification: doc.subclassificationCd,
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
                    }
                });
                console.log("Selected Docs are", documentList);
                
                
                // Need to chec packageVersion and see if selected dates are inside a version.
                var packageVersion = packageVersionModel.getPackageVersionStore();
                console.log("Doc in package before adding: ", packageVersion);
                
                startDate = Function._isoDateFormatter(startDate);
                endDate = Function._isoDateFormatter(endDate);
                packageVersionModel.addTo(startDate, endDate, self.params.code, documentList);
                //packageVersionModel.addDates(newStartDate, newEndDate, this.params.code);
                //packageVersionModel.addingDocsToDates(newStartDate, newEndDate, documentList);
                
                // do save here
                //console.log("Doc in package before SAVING: ", packageVersion);
            
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