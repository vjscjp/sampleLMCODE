define([ 
       
	"dojo/dom", "dojo/on", "dojo/dom-class", "dojo/window", "dojo/dom-style", "dojo/query", "dojo/NodeList-traverse", "dojo/request/xhr", 
	"dojo/store/JsonRest", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/dom-construct", "dojo/promise/all",
    "dijit/form/Form", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/Dialog", "dijit/Dialog", "dijit/ConfirmDialog",  "dijit/form/ComboBox", "dijit/registry",
	"dojox/grid/EnhancedGrid",
    "dijit", "dijit/form/Select", "dijit/form/Button", "dojo/_base/lang", 
    "controllers/widgets/classSubClass.js", "models/packages/packageVersionModel.js"
	], 
function(
	dom, on, domClass, win, domStyle, query, traverse, xhr,
	JsonRest, ObjectStore, Memory, Cache, domConstruct, all,
    Form, TabContainer, ContentPane, Dialog, Dialog, ConfirmDialog, ComboBox, registry,
	EnhancedGrid,
    dijit, Select, Button, lang, classSubClass, packageVersionModel
) {
    var documentGrid, subClassificationGrid, classificationGrid, packageVersionActive, tempPackageVersionStore = [], versionSelect_packageModify, packageData,
        packageVersionDropDown = [], packageClassStore, packageClassObj, packageSubClassStore, packageSubClassObj, selectedVersion, fullScreenDialog;
    // Global Widgets and Helpers
    var Function = this.app.FunctionHelper;
    
    
	return {
        
        
		
		init: function() {
			            
			var self = this;
            versionSelect_packageModify = null;
            var packageVersions = null;
            var firstVersion, layout;
            
            
			
			documentGrid = new EnhancedGrid({
				autoHeight : true,
				structure : this.getDocGridLayout()
			});
			documentGrid.placeAt("documentGrid_packageModify");
            documentGrid.canSort = function(col) {
                return false;
            }
            
            // emited event from dialog for add class sub class
            on(window, "pushMessage", function(event) {
                self.transitionTo(event,"packagesVerifyOrder", {"type":"document"});
            });
            
            var btnDocumentRecord = dijit.byId("btnDocumentRecord_packageModify");
            btnDocumentRecord.on("click",function(e){
                self.transitionTo(e,"packagesAddRecords", {"code": self.params.code});
            });
            
            var btnDocumentForm = dijit.byId("btnDocumentAddForm_packageModify");
            btnDocumentForm.on("click",function(e){
                Notice.loading();
                self.transitionTo(e,"packagesAddForms", {"code": self.params.code});
            });
            
            //selectedVersion = Function.getSelectedIndex(registry.byId("selPackageIteration"));
            
            
            //Classification Actions
            var classMoveUp = dijit.byId("btnClassMoveUp_packageModify");
            classMoveUp.on("click", function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.classificationMove("up", selectedVersion, classificationGrid);
                self.loadAllGrids();
            });
            
            var classMoveDown = dijit.byId("btnClassMoveDown_packageModify");
            classMoveDown.on("click", function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.classificationMove("down", selectedVersion, classificationGrid);
                self.loadAllGrids();
            });
            
            //SubClassification Actions
            var subClassMoveUp = dijit.byId("btnSubClassMoveUp_packageModify");
            subClassMoveUp.on("click", function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.subClassificationMove("up", selectedVersion, subClassificationGrid);
                self.loadAllGrids();
            });
            
            var subClassMoveDown = dijit.byId("btnSubClassMoveDown_packageModify");
            subClassMoveDown.on("click", function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.subClassificationMove("down", selectedVersion, subClassificationGrid);
                self.loadAllGrids();
            });
            
            
            //Document Tab Actions
            var documentMoveUp = dijit.byId("btnDocumentMoveUp_packageModify");
            documentMoveUp.on("click",function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.documentMove("up", selectedVersion, documentGrid );
                self.loadAllGrids();
            });
            
            var documentMoveDown = dijit.byId("btnDocumentMoveDown_packageModify");
            documentMoveDown.on("click",function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.documentMove("down", selectedVersion, documentGrid );
                self.loadAllGrids();
            });
            
            var documentFullScreen = dijit.byId("btnDocumentFullScreen_packageModify");
            documentFullScreen.on("click", function(e){
                var form = new Form(), fullGrid;
				
                fullGrid = new EnhancedGrid({
                    autoHeight: true,
                    structure: self.getDocGridLayout()
                }).placeAt(form.containerNode);
                fullGrid.startup();
                fullScreenDialog = new Dialog({
                    title: "Package Documents Results",
                    content: form,
                    style: "width: 100%; height: 100%;"
                });
                fullGrid.setStore(documentGrid.store); 
                fullScreenDialog.show();
            });
            
            var btnDocumentRemove = dijit.byId("btnDocumentRemove_packageModify");
//            documentFullScreen.on("click", function(e){
//                domStyle.set("notice", { display: "block"});
//            });
            btnDocumentRemove.on("click",function(e){
                selectedVersion = registry.byId("selPackageIteration").get("value");
                packageVersionModel.documentRemove(selectedVersion, documentGrid);
                self.loadAllGrids();
            });
            
            // handles close for all pop ups
            query(".l_pop_up_btn").on("click", function(){
                query(".l_pop_up_btn").closest(".l_pop_up").style( { display: "none"});
            });
            //
            
//            var documentFullScreenClose = dijit.byId("btnDocumentFullScreenClose_packageModify");
//            documentFullScreenClose.on("click", function(e){
//                //domConstruct.empty("documentGridWraper_packageModify");
//                //domConstruct.place( "popUp", "documentGridWraper_packageModify");
//                domStyle.set("popUp", { display: "none"});
//
//                documentGrid.setStore(packageVersionActive);
//
//            });
            
            
            // set up Classification grid
            layout = [ {
				name : "Classification",
				field : "classification",
				width : "100%"
			},{
				name : "ID",
				field : "id",
				hidden: true
			}];
			classificationGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout
			}, "classificationGrid_packageModify");
			classificationGrid.startup();
            classificationGrid.canSort = function(col) {
                return false;
            }
            
            // set up SubClassification grid
            layout = [ {
				name : "Classification",
				field : "classification",
				width : "100%"
			},{
				name : "Sub-Classification",
				field : "subclassification",
				width : "100%"
			},{
				name : "ID",
				field : "id",
				hidden: true
			}];
			subClassificationGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout
			}, "subClassificationGrid_packageModify");
			subClassificationGrid.startup();
            subClassificationGrid.canSort = function(col) {
                return false;
            }
            
            dijit.byId("btnClassAdd_packageModify").on("click",function(e){
                self.transitionTo(e,"packagesAddClass", {
                    code: self.params.code,
                    type: "class"
                });
            });
            
            dijit.byId("btnSubClassAdd_packageModify").on("click",function(e){
                self.transitionTo(e,"packagesAddClass", {
                    code: self.params.code,
                    type: "subclass"
                });
            });
            
            
            

            
            versionSelect_packageModify = new Select({
                id: "selPackageIteration",
                name: "selPackageIteration",
                sortByLabel: false
            }, "selPackageIteration_packageModify");
            versionSelect_packageModify.startup();
            versionSelect_packageModify.on("change",function(activeId){
                //selectedIndex = Function.getSelectedIndex(this);
                selectedIndex = this.get("value");
                // need the selected index for the packageVersionModel, code and activeId for the rest call
                // WAs only loading one version, now all are loaded
//                currentVersionLoaded = packageVersionModel.loadVersion(selectedIndex, code, activeId);
//                all({ currentVersionLoaded: currentVersionLoaded}).then(function(results){
//                    self.loadAllGrids();
//                });
                self.loadAllGrids();
            }); 
            
            
            dijit.byId("btnClone_packageModify").on("click",function(e){
                //var currentIndex = Function.getSelectedIndex(versionSelect_packageModify);
                var currentIndex = versionSelect_packageModify.get("value");
                var packageVersion = packageVersionModel.getPackageVersionStore();
                
                if(packageVersion[currentIndex].documents.length){
                    self.transitionTo(e,"packagesClone", {
                        code: self.params.code,
                        packageName: dijit.byId("txtName_packageModify").get("value"),
                        packageIndex: currentIndex,
                        type: "class"
                    });
                }else{
                    Notice.showWarning("There are no documents in the selected iteration to clone");   
                }
            });
            
            
            dijit.byId("btnHistory_packageHistory").on("click",function(e){
                self.transitionTo(e,"packagesHistory", {
                    code: self.params.code,
                    packageName: dijit.byId("txtName_packageModify").get("value"),
                    packageDate: dijit.byId("txtEffective_packageModify").get("value")
                    
                });
//                packageData: packageData
//                    packagelName: packageData.userLastName,
//                    packageN: packageData.createdByUserId,
//                    packageCreated: packageData.createdByUserId,
            });
            
            dijit.byId("btnSave_packageModify").on("click",function(e){self.savePackage(e);});
            
            
            // to Cancel button to navigate to records search screen
            dijit.byId("btnCancel_packageModify").on("click",function(e){
                if( packageVersionModel.validateDocumentChange() ){
                    var confDialog = Notice.showConfirmDialog({text:ALERT_FOR_UNSAVED_CHANGES, type: "warning"});
                    confDialog.on("execute", function (dialogEvent) {
                        self.transitionTo(e,"packagesSearch", {});
                    });
                }else{
                    self.transitionTo(e,"packagesSearch", {});
                }
            });
			
		},
        
        
        
        afterActivate: function(){
            var packageVersion = packageVersionModel.getPackageVersionStore();
            var self = this;
            var code = self.params.code;
            
            Function.doAfterActivate();
            
            // switch between view and modify views
            var lockItems = query(".modify");
            if(this.params.action == "view"){
                dojo.forEach(lockItems, function(selectedItem){
                    domClass.add(selectedItem,"hidden");
                });
            }else{
                dojo.forEach(lockItems, function(selectedItem){
                    domClass.remove(selectedItem,"hidden");
                });
            }
            
            // should validate if package version is laoded before loading another, or move REST call into model
            
            // load the versions for selectable drop down, .get last as it is deffered
            //if(typeof packageVersion.length == "undefined" || packageVersion.length == 0){ 
                    
                loadedVersions = packageVersionModel.loadPackages(code);

                all({ loadedVersions: loadedVersions}).then(function(results){
                    
                
                    var currentVersionId = "";
                    var i = 0;

                    dojo.forEach(results.loadedVersions, function(resultsItem){
                        // build drop down for version selection
                        
                        // last loaded version save package and load documents
                        
                        
                        currentVersionLoaded = packageVersionModel.loadVersion(i, code, resultsItem.id);
                        if(i == (results.loadedVersions.length-1)){
                            currentVersionId = resultsItem.id;
                            all({ currentVersionLoaded: currentVersionLoaded}).then(function(results){
                                self.loadAllGrids();
                            });
                        }
                        
                        // make it a new DFFERED()
                        //Was only loading one version, now loading all versions for clone- need to know what is blank
//                        if(i == (results.loadedVersions.length-1)){
//                            currentVersionId = resultsItem.id;
//                            currentVersionLoaded = packageVersionModel.loadVersion(i, code, resultsItem.id);
//                            all({ currentVersionLoaded: currentVersionLoaded}).then(function(results){
//                                self.loadAllGrids();
//                            });
//                        } 


                        i = i + 1;
                    });
                    
                    var packageVersionDropDownList = packageVersionModel.loadVersionsDropDown();

                    var memPackageVersionsDropDownStore = new Memory( { data:packageVersionDropDownList } );
                    var memPackageVersionsDropDownObject = new ObjectStore( { objectStore: memPackageVersionsDropDownStore } );

                    versionSelect_packageModify.setStore(memPackageVersionsDropDownObject);
                    versionSelect_packageModify.set("Value",currentVersionId);
                    
                    //selectedVersion = Function.getSelectedIndex(registry.byId("selPackageIteration"));
                    selectedVersion = registry.byId("selPackageIteration").get("value");

                });
                
                

                this.loadPackageFields();
//            }else{ // package already loaded
//                // update version drop down, coming from add forms or add records, packageVersion has new versions and docs
//                var currentVersionId = "";
//                packageVersionDropDown = [];
//                dojo.forEach(packageVersion, function(resultsItem){
//                    packageVersionDropDown.push({
//                        id:resultsItem.id,
//                        label:
//                            Function._isoDateFormatter(resultsItem.effectiveDate) + " - " + 
//                            (( Function._isFuture(resultsItem.expirationDate) ||  resultsItem.expirationDate == '')?"current":Function._isoDateFormatter(resultsItem.expirationDate))
//                    });
//                    currentVersionId = resultsItem.id;
//                    
//                });
//                
//                var memPackageVersionsDropDownStore = new Memory( { data:packageVersionDropDown } );
//                var memPackageVersionsDropDownObject = new ObjectStore( { objectStore: memPackageVersionsDropDownStore } );
//                
//                versionSelect_packageModify.setStore(memPackageVersionsDropDownObject);
//                versionSelect_packageModify.set("Value",currentVersionId);
//                
//                console.log("Packages are back ", packageVersionDropDown, packageVersion);
//                
//                self.loadAllGrids();   
//            }
            
            
            
        },

        beforeDeactivate: function(nextView, data){
            Function.doBeforeDeactivate();
        },

        
        /**
		 * Load initial document package data 
         * called on init, does it need to be called again when version drop down changes?
         */
		loadPackageFields: function() {
            var self = this;
            var code = self.params.code;
            
            cachePackagesStore.query("").then(function(results) {
                //console.log("Results for package " , results);
                
                cdMemoryStore = new Memory( { data:results.packages } );
				//cdStore = new ObjectStore( { objectStore: cdMemoryStore } );
                
                cdMemoryStore.query({'code':code}).forEach(function(item){
                    var exprDate = ''
                    if(item.expirationDate) exprDate =  Function._isoDateFormatter(item.expirationDate);
                    exprDateObj = Function._returnDateObj(item.expirationDate);
                    var afterDate = new Date("01/01/2100");
                    if(exprDateObj > afterDate) exprDate = '';
                    
                    registry.byId("txtName_packageModify").set('value', item.packageName);
                    registry.byId("txtRIC_packageModify").set('value',item.recIdxNum);
                    registry.byId("txtEffective_packageModify").set('value',Function._isoDateFormatter(item.effectiveDate));
                    registry.byId("txtExpiration_packageModify").set('value',exprDate );
                    registry.byId("txtDate_packageModify").set('value',item.dateTypeName);
                    
                    registry.byId("txtClassification_packageModify").set('value',"Package");
                    registry.byId("txtSubClassification_packageModify").set('value',item.packageName);
                    
                    packageData = item;
                });
                
            }, function(error){
				Function.handleError(error);
			});
            
		},
        
        
        /**
		 * Refresh Version drop down based on packageVersionModel
         * called afterany new form, records, or documents are added to packageVersionModel
		 */
        refreshVersion: function() {
            var packageVersionDropDownList = packageVersionModel.loadVersionsDropDown();
            
            		
            var memPackageVersionsStore = new Memory( { data:packageVersionDropDownList} );
            var packageVersions = new ObjectStore( { objectStore: memPackageVersionsStore } );
					
			versionSelect_packageModify.setStore(packageVersions);
            
        },
        
        
        
        /**
		 * Parses and Loads packageVersion Store into all 3 datagrids
         * Called on init and when items is moved
		 */
        loadAllGrids: function(e){
            
            var packageVersion = packageVersionModel.getPackageVersionStore();
            
            var searchByIndex = Function.getSelectedIndex(registry.byId("selPackageIteration"));
            
            var packageVersionActiveStore = new Memory( { data:packageVersion[searchByIndex].documents , idProperty:"id" } );
            packageVersionActive = new ObjectStore( { objectStore: packageVersionActiveStore} );
            documentGrid.setStore(packageVersionActive);
            
            // limit classifications and build count for move function
            var classArray = packageVersionModel.classificationFromPackageDocs(searchByIndex);
            packageClassObj = new ObjectStore( { objectStore: classArray } );
            classificationGrid.setStore(packageClassObj);
            
            // limit subclass
            var subClassArray = packageVersionModel.subClassificationFromPackageDocs(searchByIndex);
            var packageSubClassObj = new ObjectStore( { objectStore: subClassArray } );
            subClassificationGrid.setStore(packageSubClassObj);
            
        },
        
        savePackage: function(e){
            
            var savedVersion = packageVersionModel.returnForSave(this.params.code, "save");
            
            all({ savedVersion: savedVersion}).then(function(results){
                // reload everything
                //self.loadAllGrids();
            });
            

        },
        
        getDocGridLayout: function(){
            // set up version document grid
			var layout = [ {
				name : "Title",
				field : "documentTitle",
				width : "20%"
			}, {
				name : "Classification",
				field : "classification",
				width : "30%"
			}, {
				name : "Sub-Classification",
				field : "subclassification",
				width : "30%"
			}, {
				name : "Number",
				field : "seqNum",
				width : "10%"
			}, {
				name : "ID",
				field : "id",
				hidden: true
			}];
            
            return layout;
        },
        
        transitionTo: function(e, targetView, passParams) {
			var transOpts = {
					target : targetView,
					params : passParams
				};
			this.app.transitionToView(e.target, transOpts);		
		}
        
		
	};
});