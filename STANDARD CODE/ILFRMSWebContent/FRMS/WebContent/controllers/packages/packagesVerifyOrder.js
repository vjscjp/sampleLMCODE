/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define, console, Function, Notice,
    */

define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all", "dojo/_base/lang", "dojo/_base/array",
    "dijit", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/ConfirmDialog", "dijit/registry",
    "dojox/grid/DataGrid", "dojox/grid/_CheckBoxSelector", "models/packages/packageVersionModel.js",
    "dojo/domReady!"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all, lang, array,
    dijit, ComboBox, Button, DateTextBox, MultiSelect, ConfirmDialog, registry,
    DataGrid, _CheckBoxSelector, packageVersionModel
) {
//	var Function = this.app.FunctionHelper;
	var classificationGrid, subClassificationGrid, documentGrid, verfifyType,
        viewedItems = [], needToView = [], self;
    
	return {
		
		init: function() {
            var layout, confDialog;
            verfifyType = this.params.type;
            self = this;
            // clear arrays
            viewedItems = [];
            needToView = [];
			
			//orderClassification_packagesVerifyOrder
            //orderSubClassification_packagesVerifyOrder
            //orderDocuments_packagesVerifyOrder
            
            
            // set up Classification grid
            layout = [{
				name : "Classification",
				field : "classification",
				width : "100%"
			}];
            
			classificationGrid = new DataGrid({
				autoHeight : true,
				structure : layout
			}, "classificationGrid_packagesVerifyOrder");
			classificationGrid.startup();
            classificationGrid.canSort = function(col){
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
			subClassificationGrid = new DataGrid({
				autoHeight : true,
				structure : layout
			}, "subclassificationGrid_packagesVerifyOrder");
			subClassificationGrid.startup();
            subClassificationGrid.canSort = function(col) {
                return false;
            }
            
            // set up document grid
            layout = [ {
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
            documentGrid = new DataGrid({
				autoHeight : true,
				structure : layout
			}, "documentGrid_packagesVerifyOrder");
			documentGrid.startup();
            documentGrid.canSort = function(col) {
                return false;
            }
            
            
            
            //Classification Actions
            dijit.byId("btnMoveUp_packagesVerifyOrder").on("click", function(e){
                var selectedVersion = registry.byId("selPackageIteration_packagesVerifyOrder").get('value');
                
                if(verfifyType == "class"){
                    packageVersionModel.classificationMove("up", selectedVersion, classificationGrid);
                }
                if(verfifyType == "subclass"){
                    packageVersionModel.subClassificationMove("up", selectedVersion, subClassificationGrid);
                }
                if(verfifyType == "document"){
                    packageVersionModel.documentMove("up", selectedVersion, documentGrid );
                }
                self.loadAllGrids(selectedVersion);
            });
            
            dijit.byId("btnMoveDown_packagesVerifyOrder").on("click", function(e){
                var selectedVersion = registry.byId("selPackageIteration_packagesVerifyOrder").get('value');
                
                if(verfifyType == "class"){
                    packageVersionModel.classificationMove("down", selectedVersion, classificationGrid);
                }
                if(verfifyType == "subclass"){
                    packageVersionModel.subClassificationMove("down", selectedVersion, subClassificationGrid);
                }
                if(verfifyType == "document"){
                    packageVersionModel.documentMove("down", selectedVersion, documentGrid );
                }
                self.loadAllGrids(selectedVersion);
            });
        
            dijit.byId("selPackageIteration_packagesVerifyOrder").on("change",function(activeId){
                //selectedIndex = Function.getSelectedIndex(this);
                this.get("value");
                self.loadAllGrids(activeId);
            }); 
            
            dijit.byId("btnFinished_packagesVerifyOrder").on("click", function(e){
                
                if(viewedItems.length == needToView.length){
                    var savedVersion = packageVersionModel.returnForSave(self.params.code, "save");

                    all({ savedVersion: savedVersion}).then(function(results){
                        
                        var transOpts = {
                                target : "packagesViewModify",
                                params : {code: self.params.code}
                            };
                        self.app.transitionToView(e.target, transOpts);	
                    });
                }else{
                    Notice.showError("You must view and vierify each package Iteration");
                }
                
            });
            
            // set up check for change and stop navigation
            confDialog = new ConfirmDialog({
                title: "Notice",
                content: "You have unsaved changes. <br>Do you wish to discard your unsaved changes?",
                closable: false,
                style: "width: 300px"
            });
            confDialog.set("buttonOk", "Dismiss");
            confDialog.set("buttonCancel", "Cancel");
            
            // to Cancel button to navigate to records search screen
            dijit.byId("btnCancel_packagesVerifyOrder").on("click",function(e){
                confDialog.show();
                confDialog.on("execute", function (dialogEvent) {
                    self.transitionTo(e,"packagesViewModify", {
                        code: self.params.code,
                        action: "modify"
                    });
                });

            });
            
            
		},
        
        afterActivate: function(){
            var typeText, versionSelect_packageModify, packageVersionDropDownList, memPackageVersionsDropDownStore, memPackageVersionsDropDownObject, currentVersionId;
            Function.doAfterActivate();
            
            // pick style of review
            Function._hideDiv("orderClassification_packagesVerifyOrder");
            Function._hideDiv("orderSubClassification_packagesVerifyOrder");
            Function._hideDiv("orderDocuments_packagesVerifyOrder");
                        
            typeText = dom.byId("orderType_packagesVerifyOrder");
            if(verfifyType == "class"){
                Function._showDiv("orderClassification_packagesVerifyOrder");
                typeText.innerHTML = "Classification(s)";
            }
            if(verfifyType == "subclass"){
                Function._showDiv("orderSubClassification_packagesVerifyOrder");
                typeText.innerHTML = "Sub-Classification(s)";
            }
            if(verfifyType == "document"){
                Function._showDiv("orderDocuments_packagesVerifyOrder");
                typeText.innerHTML = "Document(s)";
            }
            
            // loading any changed versions
            versionSelect_packageModify = dijit.byId("selPackageIteration_packagesVerifyOrder");
            packageVersionDropDownList = packageVersionModel.loadChangedVersionsDropDown();
            memPackageVersionsDropDownStore = new Memory( { data:packageVersionDropDownList } );
            memPackageVersionsDropDownObject = new ObjectStore( { objectStore: memPackageVersionsDropDownStore } );
            // ID is now the index, since we are not doing any rest calls
            currentVersionId = 0;
            // activate the last drop down
            array.forEach(packageVersionDropDownList, function(item){
                currentVersionId = item.id;
            });

            versionSelect_packageModify.setStore(memPackageVersionsDropDownObject);
            versionSelect_packageModify.set("Value",currentVersionId);
            
            // validate if all versions were reviewed
            array.forEach(packageVersionDropDownList, function(packageItem){
                var ids = packageItem.id;
                //if(!ids) ids = 100;
                if(ids){
                    if (needToView.indexOf(ids) === -1){
                        needToView.push(ids);
                    }
                }
            });
            
            this.loadAllGrids(currentVersionId);            
        },
        
        beforeDeactivate: function(nextView, data){
            Function.doBeforeDeactivate();
        },

        
        /**
		 * Parses and Loads packageVersion Store into all 3 datagrids
         * Called on init and when items is moved
		 */
        loadAllGrids: function(searchByIndex){
            var pushing, packageVersion, packageVersionActiveStore, packageVersionActive, classArray, packageClassObj, subClassArray, packageSubClassObj;
            
            pushing = searchByIndex;
            //if(!pushing) pushing = 100; // could be 0
            if(pushing){
                if (viewedItems.indexOf(pushing) === -1){
                    viewedItems.push(pushing);
                }
            }
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            //var searchByIndex = Function.getSelectedIndex(registry.byId("selPackageIteration_packagesVerifyOrder"));
            
            packageVersionActiveStore = new Memory( { data:packageVersion[searchByIndex].documents , idProperty:"id" } );
            packageVersionActive = new ObjectStore( { objectStore: packageVersionActiveStore} );
            documentGrid.setStore(packageVersionActive);
            
            // limit classifications and build count for move function
            classArray = packageVersionModel.classificationFromPackageDocs(searchByIndex);
            packageClassObj = new ObjectStore( { objectStore: classArray } );
            classificationGrid.setStore(packageClassObj);
            
            // limit subclass
            subClassArray = packageVersionModel.subClassificationFromPackageDocs(searchByIndex);
            packageSubClassObj = new ObjectStore( { objectStore: subClassArray } );
            subClassificationGrid.setStore(packageSubClassObj);
            
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