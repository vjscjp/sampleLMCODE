/**
 * 
 */

/*global hasUserFormRWAccess : true*/

/*global define, dojo, dojox, dijit, console, alert, setTimeout, confirm : true*/

define(["dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/Deferred",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",  
	"dijit/_WidgetsInTemplateMixin",
    "dojo/text!/frmsadmin/controllers/widgets/templates/recordsSearch.html",
	"models/records/recordsModel.js"],
    function (declare,lang,Deferred,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,template,RecordsModel) {
		var _self, formFieldsConfig, callBackFunction;
        return declare('app.recordsSearch',[_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin],{
			templateString : template,
			postCreate : function(e) {
				console.log(this);
				formFieldsConfig = RecordsModel.getFormFieldConfig();
				_self = this;
				FRMS.FrmsUtils.initializeFields(formFieldsConfig,_self);
				// map page actions
				this.searchForm_btn.on('click',_self.searchForm);
			},
			setCallbackFunction : function(callback){
				_self.callBackFunction = callback;
			},
			searchForm : function(){
				console.log('RecordsSearchForm');
				var srchProcess=new Deferred();
				//Create a DOC and pass the records# number to it
				var doc=RecordsModel.createDocumentInsance();
				doc.frmRecNum=_self.frmRecNumSrch.get('value');
				console.log(doc);
				//Call service to get the resords
				srchProcess.resolve(doc);
				//Pass the response to callback funtion
				srchProcess.then(_self.callBackFunction);
			}
		});

    });