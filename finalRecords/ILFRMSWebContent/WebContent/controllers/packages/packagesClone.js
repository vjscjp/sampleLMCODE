define([ 
       
	"dojo/dom", "dojo/on",  "dojo/_base/array",
	"dojo/store/JsonRest", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", 
	"dojox/grid/EnhancedGrid", "dijit/form/Button", "dojo/_base/lang",  "dijit/form/Select", "dijit/form/DateTextBox",
    "controllers/widgets/functions.js", "models/packages/packageVersionModel.js", "dojo/domReady!"
	], 
function(
	dom, on, array,
	JsonRest, ObjectStore, Memory, Cache, 
	EnhancedGrid, Button, lang, Select, DateTextBox,
    Functions, packageVersionModel
) {
    var Function = this.app.FunctionHelper;
    var Notice = this.app.NoticeHelper;
	var firstVersionCloneDate, documentList;
    
	return {
		
		init: function() {
			
			var self = this;
            
//            versionSelect = new Select({
//                id: "selPackageIteration_clone",
//                name: "selPackageIteration_clone",
//                sortByLabel: false
//            }, "selPackageTarget_packageClone");
//            versionSelect.startup();
            
            
            
            dijit.byId("selPackageTarget_packageClone").on("change",function(e){
                self.setDates();
            });
            
            dijit.byId("btnSearch_packageClone").on("click",function(e){
                if(dijit.byId("form_packageClone").validate()){                    
                    self.saveDocs(e);
                }else{
                    Notice.showError("Form not Valid");
                }
            });
            
            
            dijit.byId("btnClear_packageClone").on("click",function(e){
                self.transitionTo(e,"packagesViewModify", {
                    code: self.params.code,
                    action: "modify"
                });
            });

		},
        
        afterActivate: function(){
            var self = this;
            var activeIndex, curVersion, curVersionText, packageVersion;
            Notice.doneLoading();
            
            // set default date
            firstVersionCloneDate = packageVersionModel.loadFirstEmptyVersionsDate();
            dijit.byId("txtEffective_packageClone").set("value", Function._isoDateFormatter(firstVersionCloneDate));
            
            // empty versions
            var packageVersionDropDownList = packageVersionModel.loadEmptyVersionsDropDown();

            var memPackageVersionsDropDownStore = new Memory( { data:packageVersionDropDownList } );
            var memPackageVersionsDropDownObject = new ObjectStore( { objectStore: memPackageVersionsDropDownStore } );

            dijit.byId("selPackageTarget_packageClone").setStore(memPackageVersionsDropDownObject);
            
            // current selected version
            var packageVersion = packageVersionModel.getPackageVersionStore();
            activeIndex = self.params.packageIndex;
            curVersion = packageVersion[activeIndex];
            curVersionText = Function._isoDateFormatter(curVersion.effectiveDate) + " - " + 
                        (( Function._isFuture(curVersion.expirationDate) ||  curVersion.expirationDate == '')?"current":Function._isoDateFormatter(curVersion.expirationDate))
            
            
            dijit.byId("txtPackageName_packageClone").set("value", decodeURIComponent(this.params.packageName));
            dijit.byId("txtPackageIteration_packageClone").set("value",curVersionText);
            
            documentList = packageVersion[activeIndex].documents;
            
            
            self.setDates();
        },
        
        setDates: function(){
            var packageVersion = packageVersionModel.getPackageVersionStore();
            var currentIndex = dijit.byId("selPackageTarget_packageClone").get("value");
            
            if(currentIndex){
                var startDate = new Date(packageVersion[currentIndex].effectiveDate);
                var endDate = new Date(packageVersion[currentIndex].expirationDate);

                // need to validate selected start date against version satart date
                //firstVersionCloneDate = startDate;

                dijit.byId("txtEffective_packageClone").set("value", startDate);
                dijit.byId("txtExpiration_packageClone").set("value", endDate);  
            }else{
                Notice.showWarning("No empty packages for cloning.");
            }
        },
        
        saveDocs: function(e){
            var self = this;
            var startDate = dijit.byId("txtEffective_packageClone").get("value");
            var endDate =dijit.byId("txtExpiration_packageClone").get("value");
            
            var packageVersion = packageVersionModel.getPackageVersionStore();
            
            // all new docs are adds
            array.forEach(documentList, function(docItem){
                docItem.changeInd = "A";
            });
            
            
            startDate = Function._isoDateFormatter(startDate);
            endDate = Function._isoDateFormatter(endDate);
            packageVersionModel.addTo(startDate, endDate, self.params.code, documentList);

            self.transitionTo(e,"packagesVerifyOrder", {type:self.params.type, code: self.params.code});
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