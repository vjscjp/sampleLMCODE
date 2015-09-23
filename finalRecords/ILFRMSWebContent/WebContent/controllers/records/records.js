
/*global hasUserFormRWAccess : true*/

/*global define, dojo, dojox, dijit, console, alert, setTimeout, confirm : true*/

define(["dojo/_base/lang","dijit/form/Form","dojox/mvc/at","dojox/mvc/Output",
		"dijit/form/DateTextBox","dijit/form/Textarea","/common/widgets/ValidationTextArea.js",
		"dijit/form/RadioButton","dijit/form/CheckBox","dojo/dom-class","dojo/on",
		"controllers/widgets/recordsSearch.js",
		"models/records/recordsModel.js",
		"dojo/domReady!"],
    function (lang,Form,at,Output,Textarea,ValidationTextArea,DateTextBox,RadioButton,CheckBox,domClass,on,RecordsSearchWidget,recordsModel) {
        "use strict";
		var _self;
		var formModel;
		var recordsFieldsConfig = recordsModel.getFormFieldConfig();
		var recordsSearchWidget;
        return {
			
            init: function () {
				_self=this;
				_self.initializeView();
				recordsSearchWidget = new RecordsSearchWidget();
				recordsSearchWidget.setCallbackFunction(_self.updateModel);
            },
			
			//initialize field and page actions
			initializeView:function(){
				FRMS.FrmsUtils.initializeFields(recordsFieldsConfig,_self);
				// map page actions
				//this.validateRecords_btn.on('click',_self.promoteForm);
				//this.btnSave_recordsCreate.on('click',_self.saveForm );
				//this.btnCancel_recordsCreate.on('click',_self.cancelForm);
			},

			//before Activate
			beforeActivate: function (previousView, data) {
                console.debug('Records:Entering into beforeActivate method..');
                
				_self.resetView();
				debugger;
				if(data && data.displaySearch){
					recordsSearchWidget.placeAt(_self.recordsSearchContainer);
					_self.viewTitle.innerHTML =FRMS.FrmsConstants.constants.MODIFY_RECORD_TITLE;
				}else{
					
					_self.viewTitle.innerHTML =FRMS.FrmsConstants.constants.CREATE_RECORD_TITLE;
				}
				var document = null;
				//set document obj if passed from another view
				if(data && data.document){
					document = data.document;
				}
				formModel = recordsModel.createFormModel(document);
				_self.loadViewWithModel(formModel);
            },
            // Reset view
			resetView:function(){
				_self.documentRecord.reset();
				_self.recordsSearchContainer.innerHTML = "";
			},
			//call back function on search
			updateModel:function(documentInstance){
				console.log('UpdateModel');
				console.log(documentInstance);
				console.log(formModel);
				formModel.document = documentInstance;
				alert("callback from records search");
				_self.loadViewWithModel(formModel);
			},
			
			loadViewWithModel:function(modelObj){
				for(var field in recordsFieldsConfig){
					//set value from model to all form Fields
					var fld=_self[field];
					if(fld){
						// map fields with modal data
						if(modelObj){
							var customMapping =recordsFieldsConfig[field].customMapping;
							var doc =modelObj.document;
							if(customMapping){
								fld.set(customMapping.mappingAttr,at(doc,field).transform(customMapping.converter),false);
							}else {
								fld.set('value',at(doc,field),false);
							}
						}else{
							console.log('Model is null. Nothing to map');
						}						
					}
				}
			},
			
			highlightFields:function(invalidFlds){
				dojo.forEach(invalidFlds , function(field){
					var wdg=_self[field];
					if(wdg){
						wdg.set('state','Error');
					}
				});		
			}
			

        };

    });