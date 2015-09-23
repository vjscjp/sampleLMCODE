/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define, console, Function, Notice,
    cachePackagesStore*/

define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", "dojo/promise/all",
    "dijit", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox", "dijit/form/MultiSelect", "dijit/form/Select", "dijit/form/Textarea", "dijit/Tooltip",
	"dojox/grid/EnhancedGrid",  "dojo/_base/lang", "dojo/dom-class",
    "dojo/query", "dojo/NodeList-traverse"
	], 
function(
	dom, on, 
	JsonRest, json, ObjectStore, Memory, Cache, all,
    dijit, ComboBox, Button, DateTextBox, MultiSelect, Select, Textarea, Tooltip,
	EnhancedGrid, lang, domClass, query
) {
    // Defined in main.js
//	var Function = this.app.FunctionHelper;
//    var Notice = this.app.NoticeHelper;
    var packageGrid, self;
	
	return {
		
		init: function() {
			var self = this;
            var code = this.params.code;
            var layout;

			// set up package grid
			layout = [ {
				name : "Comment",
				field : "commentText",
				width : "35%"
			}, {
				name : "Modified By: Last Name",
				field : "createLastNm",
				width : "20%"
			}, {
				name : "First Name",
				field : "createFirstNm",
				width : "20%"
			}, {
				name : "N#",
				field : "createUserId",
				width : "15%"
			}, {
				name : "Created Date",
				field : "createDate",
                formatter: function(effectiveDate){
                    return Function._isoDateFormatter(effectiveDate);
                },
				width : "10%"
			} ];
			
			packageGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout
			}, "gridComments_packageComments");
			packageGrid.startup();
            
            
            self.getComment();
            
            dijit.byId("txtPackageName_packageComments").set("value",decodeURIComponent(this.params.packageName));
            
            dijit.byId("btnSave_packageComments").on("click",function(e){
                var node;
                var commentBox = dijit.byId("txtComment_packageComments");
                if(commentBox.get("value")){
                    
                    self.saveComment(e);
                }else{
                    node = dom.byId('txtComment_packageComments');
                    Tooltip.show("Comment Text Required", node);
                    Notice.showError("Comment text Required");
                }
                
            });
            
            
            dijit.byId("btnCancel_packageComments").on("click",function(e){
                var commentDialog = dijit.byId("dialog_packageComments");
                commentDialog.hide();
            });
            
            dijit.byId("txtComment_packageComments").on("change",function(e){
                var node = dom.byId('txtComment_packageComments');
                Tooltip.hide(node);
            });
            
            dijit.byId("btnComments_packageComments").on("click",function(e){
                var commentDialog = dijit.byId("dialog_packageComments");
                commentDialog.show();
                
            });
            
            
			dijit.byId("btnDone_packageComments").on("click",function(e){
                self.transitionTo(e,"packagesHistory", {
                    code: self.params.code,
                    packageName: self.params.packageName
                });
            });
			
		},
        
        getComment: function(){
            Notice.loading();
			cachePackagesStore.query(this.params.code+"/comments").then(function(results) {
				
                if(typeof results != "undefined" && results){
                    var packageMemoryStore = new Memory( { data:results.pkgComments } );
                    var packageStore = new ObjectStore( { objectStore: packageMemoryStore } );

                    //console.log("Packages in",packageStore);
                    packageGrid.setStore(packageStore);
                    Notice.showSuccess("Comments Loaded");
                }else{
                    Notice.showSuccess("Done, no comments found");
                }
                
			}, function(error){
				Function.handleError(error);
			});  
        },
        
        saveComment:function(e){
            var tempTarget, cachePackageSaveEndpoint, commentObject, doneSave;

            
            Notice.loading();
            cachePackageSaveEndpoint = Function._returnUnSetEndpoint(cachePackagesStore);
            commentObject = {
                commentText: dijit.byId("txtComment_packageComments").get("Value")
            }
            
            tempTarget = cachePackagesStore.__proto__.target;
            cachePackagesStore.__proto__.target = cachePackagesStore.__proto__.target + this.params.code + '/comments';
            console.debug('cachePackagesStore.target', cachePackagesStore);

            doneSave = cachePackagesStore.put(commentObject, {}).then(function (results) {
                var commentDialog;
                console.debug('Successfully saved packages..', results);
                Notice.showSuccess('Successfully saved packages');
                
                commentDialog = dijit.byId("dialog_packageComments");
                commentDialog.hide();
                Notice.doneLoading();
                
                self.getComment();
            },
            function (error) {
                console.debug(error.response.responseText, error);
                Notice.showError('Error in  saving comment');
            });
            cachePackagesStore.__proto__.target = tempTarget;
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