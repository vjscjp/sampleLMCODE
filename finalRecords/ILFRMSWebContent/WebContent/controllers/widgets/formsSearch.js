
/*global hasUserFormRWAccess : true*/

/*global define, dojo, dojox, dijit, console, alert, setTimeout, confirm : true*/

define(["dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/Deferred",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",  
	"dijit/_WidgetsInTemplateMixin",
    "dojo/text!/frmsadmin/controllers/widgets/templates/formsSearch.html",
	"models/forms/formsModel.js"],
    function (declare,lang,Deferred,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,template,FormsModal) {
		var _self ,formFieldsConfig, callBackFunction;
        return declare('app.formsSearch',[_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin],{
			templateString: template,
			postCreate: function(e) {
				console.log(this);
				formFieldsConfig = FormsModal.getFormFieldConfig();
				_self = this;
				FRMS.FrmsUtils.initializeFields(formFieldsConfig,_self);
				// map page actions
				this.searchForm_btn.on('click',_self.searchForm);
			},
			setCallbackFunction:function(callback){
				_self.callBackFunction = callback;
			},
			searchForm:function(){
				console.log('SearchForm');
				var srchProcess=new Deferred();
				var doc=FormsModal.createDocumentInsance();
				doc.frmRecNum=_self.frmRecNumSrch.get('value');
				console.log(doc);
				srchProcess.resolve(doc);
				srchProcess.then(_self.callBackFunction);
			}
		});

    });