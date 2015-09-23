/*global define:true,dijit:true,dojo:true,alert:true,console:true*/
define(["dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid", "dojo/_base/lang", "dojo/_base/array", "dojo/data/ObjectStore", "dojo/promise/all",
    "dojo/store/Memory", "dojo/store/Cache", 
        
    "dijit/registry", "dijit/form/Form", "dijit/form/Button", "dijit/Dialog", "dijit/form/Form",
        
    "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "controllers/widgets/functions.js",
    "dojo/text!/frmsadmin/controllers/widgets/templates/widgRecordSearch.html",
    ], function (
        on, dom, EnhancedGrid, lang, array, ObjectStore, all, Memory, Cache, 
         registry, Form, Button, Dialog, Form,
        declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin, Functions, template
    ){
        var Function = new Functions(); // Functions.js helper Widget
            
        return declare('app.RecordSearch', [_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
	       
            /**
             * record search setup 
             */
            postCreate: function(e) {
        	   
//                on(dom.byId("btnClear_recordsSearch"), "click", function () {
//                    dom.byId("txtRecordNumber_recordsSearch").value = '';
//                    dom.byId("txtRecordTitle_recordsSearch").value = '';
//                    dom.byId("asOfDate_recordsSearch").value = '';
//                    registry.byId("ddlRecordSource_recordsSearch").set('value', []);
//                    registry.byId("ddlRecordSource_recordsSearch")._updateSelection();
//                });
            },
            
            clearForm: function(){
                this.form_recordSearch.reset();
                
                this.ddlRecordSource_recordsSearch.set('value',[]);
                this.ddlRecordSource_recordsSearch._updateSelection();
            },
            
            btnSearchClick: function(e) {
				var self = this;
                console.log("search");
                
				self.btnSearch_recordsSearch.set('disabled', true);
                var recordNumber, recordTitle, recordSourceArray, recordSource = "", objStore, queryObj = {}, queryString, returnResults = null,
					asOfDate;
                
                recordNumber = this.txtRecordNumber_recordsSearch.get("value");
                if (recordNumber) {
                    queryObj.recordNumber = recordNumber;
                }
                recordTitle = this.txtRecordTitle_recordsSearch.get("value");
                if (recordTitle) {
                    queryObj.recordTitle = recordTitle;
                }
                recordSource = this.ddlRecordSource_recordsSearch.get("value");
//                recordSource = recordSourceArray.join(",");
                if (recordSource) {
                    queryObj.recordSource = recordSource;
                }
//                array.forEach(recordSourceArray, function(resultsItem){
//                     recordSource = recordSource + "&recordSource="+resultsItem;
//                });
                
				asOfDate = this.asOfDate_recordsSearch.get("value");
				if (asOfDate) {
					queryObj.asOfDate = Function._isoDateFormatter(asOfDate);
				}
                
                if( (recordNumber && recordNumber != " ") || (recordTitle && recordTitle != " ") ){
                    


                    queryString = Function._urlFromObject(queryObj);

                    console.debug("Searching for ", queryObj, queryString)
                    Notice.loading();
                    returnResults = cacheRecordsStore.query(queryString).then(function (results) {
                        if(results != null) {
                            Notice.showSuccess("Request completed. Records Loaded");
							self.btnSearch_recordsSearch.set('disabled', false);
                            objStore = new ObjectStore({
                                objectStore: new Memory({
                                    data: results.matchRecords
                                })
                            });
                            //grid.setStore(objStore);
							return objStore;
                        }else{
							self.btnSearch_recordsSearch.set('disabled', false);
                            Notice.showInfo("Request completed. No Matches found");
                            //alert("No Records Found");
                        }
                    }, function (error) {
						self.btnSearch_recordsSearch.set('disabled', false);
                        Function.handleError(error);
                    }); 
					//self.btnSearch_recordsSearch.set('disabled', false);
                    return returnResults;
                    
                }else{
                    Notice.showWarning("Record Number or Record Title are required.");
					self.btnSearch_recordsSearch.set('disabled', false);					
                    return null;
                }
				
            }
            
        });

});