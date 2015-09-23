define([ 
       
	"dojo/dom", "dojo/on", "dojo/dom-class", "dojo/window", "dojo/dom-style", "dojo/query", "dojo/NodeList-traverse", "dojo/request/xhr", 
	"dojo/store/JsonRest", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/dom-construct", "dojo/promise/all",
    "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/form/Form", "dijit/form/ComboBox", "dijit/registry",
	"dojox/grid/EnhancedGrid", "dojox/validate",
    "dijit", "dijit/form/Select", "dijit/form/Button", "dojo/_base/lang", 
    "controllers/widgets/classSubClass.js", "models/packages/packageVersionModel.js"
	], 
function(
	dom, on, domClass, win, domStyle, query, traverse, xhr,
	JsonRest, ObjectStore, Memory, Cache, domConstruct, all,
    TabContainer, ContentPane, Form, ComboBox, registry,
	EnhancedGrid, validate, 
    dijit, Select, Button, lang, classSubClass, packageVersionModel
) {
    var Function = this.app.FunctionHelper;
    var Notice = this.app.NoticeHelper;
    
	return {
		
		init: function() {
			
			var self = this;
            var selDateException;
            
            //Triggers
           
            
            var classSubClassSelect = new classSubClass();
            classSubClassSelect.createClassSubClass({classDom:"selClassification_packageAddClass", subClassDom:"selSubClassification_packageAddClass"});
            
//            var classificationAdd = new ComboBox({
//		        id: "classificationAdd",
//		        name: "classificationAdd",
//		        value: "",
//		        multiple:false, 
//		    }, "selClassification_packageAddClass");
//            Function._getJsonRefDataMemoryStore( { memoryStore:clasftnMemStore, objectID:"classificationAdd", digitType:"combobox" });
//            
//            classificationAdd.on("change",lang.hitch(this,function(e){this.selectClass(e);}));
//            
//            tempSubClassMemStore = new Memory( { data:subClassMemStore.data } );
//            
//            var subClassificationAdd = new ComboBox({
//		        id: "subClassificationAdd",
//		        name: "subClassificationAdd",
//		        value: "",
//		        multiple:false, 
//                store:tempSubClassMemStore,
//		    }, "selSubClassification_packageAddClass");
//            Function._getJsonRefDataMemoryStore( { memoryStore:subClassMemStore, objectID:"subClassificationAdd", digitType:"combobox" });
            
            selDateException = dijit.byId("selDateException_packageAddClass");
            selDateException.set("searchAttr", "targetDescription");
            selDateException.set("placeHolder", "--Select--");
            selDateException.set("fetchProperties", sortObj);
            selDateException.store = queryExceptionDateStore;
            
            if(this.params.type == "class"){
                domClass.add("hide_subclass","hidden");
            }else{
                domClass.remove("hide_subclass","hidden");
            }
            
            dijit.byId("form_packageAddClass").on("onSubmit", function(e){
                e.preventDefault();
            });
            
            dijit.byId("btnUpdateAddClass_packageAddClass").on("click",function(e){
                if( dijit.byId("selClassification_packageAddClass").validate() 
                   && dijit.byId("selDateException_packageAddClass").validate()
                   && dijit.byId("dateAssociationStartAdd_packageAddClass").validate() 
                ){
                    self.addPackageClassificationDialog(e);
                }else{
                    Notice.showWarning("Form Not Valid");
                }
                
            });
            
            dijit.byId("btnCancelAddClass_packageAddClass").on("click",function(e){
                self.transitionTo(e,"packagesViewModify", {
                    code: self.params.code,
                    action: "modify"
                });
            });
			
			
		},
        
        afterActivate: function(){
            var self = this;
            
            Function.doAfterActivate();
        },
        
        beforeDeactivate: function(nextView, data){
            Function.doBeforeDeactivate();
        },
        
        
        /*******_____________ CLASS ADD --START-- ____________********/
        
        /**
		 * CLASS ADD ** Loading initial pop up 
         */
        addPackageClassificationDialog: function(e){
            
            var self = this;
            var searchAdd = {};
            
            
            if(dijit.byId("selClassification_packageAddClass").get("value"))
                searchAdd.classCd = dijit.byId("selClassification_packageAddClass").get("value");
//            if(typeof dijit.byId("selSubClassification_packageAddClass").get("value") != "undefined")
//                searchAdd.subClassCd = dijit.byId("selSubClassification_packageAddClass").get("value");
            if(dijit.byId("selDateException_packageAddClass").get("value"))
                searchAdd.dateExpection = dijit.byId("selDateException_packageAddClass").get("value");
            if(dijit.byId("dateAssociationStartAdd_packageAddClass").get("value")){
                searchAdd.effDate = Function.formatLocalDate(dijit.byId("dateAssociationStartAdd_packageAddClass").get("value"));
                if(searchAdd.effDate.indexOf(" 0:00:00"))
                    searchAdd.effDate = searchAdd.effDate.substring(0,11)+"00:00:00";
            }
            if(dijit.byId("dateAssociationEndAdd_packageAddClass").get("value")){
                searchAdd.endDate = Function.formatLocalDate(dijit.byId("dateAssociationEndAdd_packageAddClass").get("value"));
                if(searchAdd.endDate.indexOf(" 0:00:00"))
                    searchAdd.endDate = searchAdd.endDate.substring(0,11)+"00:00:00";
            }
            
     
            // query documents
            var queryString = Function._urlFromObject(searchAdd);
            console.log(searchAdd);
            //console.log('searching ', queryString);
            
            Notice.loading();
            cacheDocumentsStore.query(queryString).then(function( results ){
                var documentList = [], dateExpSelect, docDtTypeCd, docTypeName;
                Notice.doneLoading();
                //hard codeing the response
                if(typeof results != "undefined" && results != null) {
                    //console.log("Docs From in ", dojo.toJson(packageVersion));
                    
                    
//                    dateExpSelect = document.getElementById("selDateExpectionAdd_packageAddClass");
//                    if(typeof dateExpSelect.selectedIndex != "undefined" && dateExpSelect.selectedIndex != -1){
//                        var dateExpOption = dateExpSelect.options[dateExpSelect.selectedIndex];
//                        docDtTypeCd = dateExpOption.value;
//                        docTypeName = dateExpOption.text;
//                    }
                    docDtTypeCd = dijit.byId("selDateException_packageAddClass").get("value");
                    docTypeName = dijit.byId("selDateException_packageAddClass").get("name")
                    console.log('Got Class Docs ',results.documentList);
                    
                    dojo.forEach(results.documentList, function(doc){
                        documentList.push({
                            // from the documents endpoint
    //                        classCd: "1043400001"
    //                        classNm: "Accounting"
    //                        docNum: "Chase EC Returns & CP Chargeback Report"
    //                        docTitle: null
    //                        effDate: "2015-01-22T13:08:12.000+0000"
    //                        endDate: "9999-12-31T05:00:00.000+0000"
    //                        id: 10597064
    //                        orgnlDocId: 10597064
    //                        subClassCd: "1043400078"
    //                        subClassNm: "Chase EC Returns & CP Ch"

                            // Mixed
                            id: doc.id,
                            origDocId: doc.orgnlDocId,
                            classification: doc.classCd,
                            docDtTypeCd: docDtTypeCd,
                            docDtTypeNm: docTypeName,
                            documentTitle: doc.recordTitle,
                            effectiveDate: searchAdd.effDate,
                            expirationDate: searchAdd.endDate,
                            subclassification: doc.subClassCd,
                            changeInd: "A"
                        });
                    });
                    
                    var packageVersion = packageVersionModel.getPackageVersionStore();
                    
                    searchAdd.effDate = Function._isoDateFormatter(searchAdd.effDate);
                    searchAdd.endDate = Function._isoDateFormatter(searchAdd.endDate);
                    packageVersionModel.addTo(searchAdd.effDate, searchAdd.endDate, self.params.code, documentList);
                    
                    var packageVersionDropDownList = packageVersionModel.loadChangedVersionsDropDown();
	
                    // only save if one package version is changed, else go to pacakge view modify
                    // DON't think this is correct, need a response of what you are adding
//                    if(packageVersionDropDownList.length > 1){
//                        self.transitionTo(e,"packagesVerifyOrder", {
//                            code: self.params.code,
//                            type: self.params.type
//                        }); 
//                    }else{
//                        var savedVersion = packageVersionModel.returnForSave(self.params.code, "save");
//
//                        all({ savedVersion: savedVersion}).then(function(results){
//
//                            var transOpts = {
//                                    target : "packagesViewModify",
//                                    params : {code: self.params.code}
//                                };
//                            self.app.transitionToView(e.target, transOpts);	
//                        });
//                    }
                    
                    self.transitionTo(e,"packagesVerifyOrder", {
                        code: self.params.code,
                        type: self.params.type
                    }); 
                    
                }else{
                    Notice.showWarning("No Document Results Found");
                }
            }, function(error) {
                Function.handleError(error);
            });
            
            
        },

        transitionTo: function(e, targetView, passParams) {
			var transOpts = {
					target : targetView,
					params : passParams
				};
			this.app.transitionToView(e.target, transOpts);		
		},

		
	};
});