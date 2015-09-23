/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define, Function,
    cachePackagesStore*/


define([ 
       
	"dojo/dom", "dojo/on", 
	"dojo/store/JsonRest", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/store/Cache", 
	"dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/exporter/CSVWriter",  "dijit/form/Button", "dojo/_base/lang", "dojo/domReady!"
	], 
function(
	dom, on, 
	JsonRest, ObjectStore, Memory, Cache, 
	EnhancedGrid, CSVWriter, Button, lang
) {
//	var Function = new Functions(); // Functions.js helper Widget
//    var Notice = this.app.NoticeHelper;
    var self, packageSelectGrid;
	
	return {
		
		init: function() {
			var layout;
			self = this;

            
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
			
			packageSelectGrid = new EnhancedGrid({
				autoHeight : true,
				structure : layout,
				sortInfo : 3,
				plugins: {exporter: true}
			}, "packageSelectGrid");
			packageSelectGrid.startup();
            
            // Export to XLS event
            dijit.byId("btnExport_packageSelect").on("click", function (e) {
                packageSelectGrid.exportGrid("csv", {writerArgs: {separator: "\t"}}, function (str) {
                    Function.exportGrid(str);

                });
            });  
			
			// run .get last as it is deffered
            //Notice.loading();
			cachePackagesStore.query("").then(function(results) {
                var packageMemoryStore, packageStore;
				//Notice.doneLoading();
				packageMemoryStore = new Memory( { data:results.packages } );
				packageStore = new ObjectStore( { objectStore: packageMemoryStore } );
				
				//console.log("Packages in",packageStore);
				packageSelectGrid.setStore(packageStore);
			}, function(error){
                Function.handleError(error);
			});
			
			function viewFormatter(value, idx){
                var gridRow = packageSelectGrid.getItem(idx);

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
                var gridRow = packageSelectGrid.getItem(idx);
                
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
		transitionTo: function(e, targetView,params) {
			var transOpts = {
					target : targetView,
					params : params
				};
			this.app.transitionToView(e.target, transOpts);		
		},
		
	};
});