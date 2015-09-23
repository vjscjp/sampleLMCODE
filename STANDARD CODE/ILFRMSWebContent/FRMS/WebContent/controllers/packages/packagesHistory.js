/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define, Function, Notice,
    cachePackagesStore*/

define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all",
    "dijit", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/form/Select",
	"dojox/grid/EnhancedGrid",  "dojo/_base/lang", "dojo/dom-class",
    "dojo/query", "dojo/NodeList-traverse"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all,
    dijit, ComboBox, Button, DateTextBox, MultiSelect, Select,
	EnhancedGrid, lang, domClass, query
) {
    // Defined in main.js
//	var Function = this.app.FunctionHelper;
//    var Notice = this.app.NoticeHelper;
	
	return {
		
		init: function() {
			var self = this;
            var code = this.params.code;
            var packageGrid, layout;


			// set up package grid
			layout = [ {
				name : "Modified By: Last Name",
				field : "modLastName",
				width : "20%"
			}, {
				name : "First Name",
				field : "modFirstName",
				width : "20%"
			}, {
				name : "N#",
				field : "modByUserId",
				width : "15%"
			}, {
				name : "Modified Date",
				field : "modByDate",
                formatter: function(effectiveDate){
                    return Function._isoDateFormatter(effectiveDate);
                },
				width : "10%"
			}, {
				name : "Modification",
				field : "modDesc",
				width : "35%"
			} ];
			
			packageGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout
			}, "gridHistory_packageHistory");
			packageGrid.startup();
            
            
            // run .get last as it is deffered
			cachePackagesStore.query(code+"/history").then(function(results) {
				
				var packageMemoryStore = new Memory( { data:results.pkgListVersHist } );
				var packageStore = new ObjectStore( { objectStore: packageMemoryStore } );
				
				//console.log("Packages in",packageStore);
				packageGrid.setStore(packageStore);
                
                // Should this be a seperate call?
                dijit.byId("txtLastName_packageHistory").set("value",packageMemoryStore.data[0].modLastName);
                dijit.byId("txtFirstName_packageHistory").set("value",packageMemoryStore.data[0].modFirstName);
                dijit.byId("txtN_packageHistory").set("value",packageMemoryStore.data[0].modByUserId);
                
                
			}, function(error){
				Function.handleError(error);
			});
            
            dijit.byId("txtPackageName_packageHistory").set("value",decodeURIComponent(this.params.packageName));
            dijit.byId("txtCreatedDate_packageHistory").set("value", decodeURIComponent(this.params.packageDate));
            
            
            dijit.byId("btnComments_packageHistory").on("click",function(e){
                self.transitionTo(e,"packagesComments", {
                    code: self.params.code,
                    packageName: decodeURIComponent(self.params.packageName)
                });
            });
            
            dijit.byId("btnDone_packageHistory").on("click",function(e){
                self.transitionTo(e,"packagesViewModify", {
                    code: self.params.code,
                    action: "modify"
                });
            });
            
			
			
			
		},
        
        afterActivate: function(){
            Notice.doneLoading();
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