define([
	"dojo/dom","dojo/dom-construct","dojo/dom-style", "dojo/dom-class", "dojo/_base/array",
	"dojo/on", "dojo/fx", 
    "dijit/ConfirmDialog",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",  "dijit/_OnDijitClickMixin",
    "dojo/text!/frmsadmin/controllers/widgets/templates/notices.html",
    "dojo/query", "dojo/NodeList-traverse"
    
    
], function(
	dom, domConstruct, domStyle, domClass, array,
	on, fx,
    ConfirmDialog,
	declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template,
    query
) {
	
	/**
	 * A notifyer helper, Must have the following div in your main HMTL - you may need to ajust the top:125px
     * Notice.placeAt(dom.byId("notice_holder"));
     * This should be a global widget difined in your first loaded view
     * you should only call the Notice.loading() before you ajax / xhr / .get call, then either show .showSuccess or .showDialog inside the .then() and the error function. This will close the loading
     * Since it is a global widget you should clear it on each view's AfterActivate and or BeforeDeactivate, Notice.doneLoading(). In FRMS we created doAfterActivate() function that we call from AfterActivate().
     * In your Sass files you'll need to include the reference to the LM application, or notices sass, file @import "../../../Shared_Web_UI_Component/ILSharedUIWeb/WebContent/sass/_lm_application.scss" 
     * or just the notice module "../../../Shared_Web_UI_Component/ILSharedUIWeb/WebContent/sass/modules/_notices.scss";
	 */
    
    // -- Default vars, can get set with setters -- //
    // can be a milesecond value or false;
    var timeOut = false;
    
    // can be set to true false, or time in mileseconds. Should be set on an app by app basis via setters
    var timeOutInfo = timeOut;
    var timeOutSuccess = timeOut;
    var timeOutError = timeOut;
    var timeOutWarning = timeOut;
    
    var showCloseOnNotice = true;
    
	
	return declare('app.Notices',[_WidgetBase, _OnDijitClickMixin, _TemplatedMixin],{
        templateString: template,
        // variables
        /*
        * Init Function, needed to wipeOut the Notice item, setting display:none doesn't work
        */
        afterActivate: function(){
            var noticeID = this.notices;
            fx.wipeOut({ node: noticeID }).play();
        },

        /*
        * shows*** takes in required text and optional params object
        * it can take a params.timeOut else if will inhereit the default values, if params.timeOut it will use the default timeOut, if a number is passed in it will use that timeout
        */
        showInfo: function(text, params){
            if(typeof params == "undefined") params = {};
            this._showNotice(text,"notice_pop_info", (params.timeOut ? params.timeOut : timeOutInfo), params);
        },
        
        showSuccess: function(text, params){
            if(typeof params == "undefined") params = {};
            this._showNotice(text,"notice_pop_success", (params.timeOut ? params.timeOut : timeOutSuccess), params);
        },
        
        showError: function(text, params){
            if(typeof params == "undefined") params = {};
            this._showNotice(text,"notice_pop_error", (params.timeOut ? params.timeOut : timeOutError), params);
        },
        
        showWarning: function(text, params){
            if(typeof params == "undefined") params = {};
            this._showNotice(text,"notice_pop_warning", (params.timeOut ? params.timeOut : timeOutWarning), params);
        },
        
        // called from either show Function - TODo, show x in top right
        _showNotice:function(text, classUse, hideAfter, params){
            if(typeof params == "undefined") params = {};
            var self = this, closeIcon;
            var animation, newTimeout;
            var noticeID = this.notices;
            var noticeText = this.notices_text;
            
                        

            if(params.showCloseOnNotice || showCloseOnNotice){
                closeIcon = '<i class="fa fa-times closeNotice"></i>';
            }
            
            this.doneLoading();
 
            noticeText.innerHTML = closeIcon + text;
            domClass.add(noticeText,classUse);
            fx.wipeIn({ node: noticeID }).play();
            // Slide down and show
            // uses default timeout or passed in timeout if not equat to true
            newTimeout = false;
            if(hideAfter > 1) newTimeout = hideAfter;
            
            if(newTimeout){
                setTimeout(function(){
                    self._hideNotice();
                }, newTimeout);
            }
            
            query(".closeNotice").on("click", function(){
                var noticeBox = query(".closeNotice").closest(".notice_wrapper");
                fx.wipeOut({ node: noticeBox[0] }).play();
            });

        },
        
        _hideNotice:function(){
            // hide any notices
            var noticeID = this.notices;
            var noticeText = this.notices_text;
            fx.wipeOut({
                node: noticeID,
                onEnd: function(){
                    domClass.remove(noticeText,"notice_pop_info");
                    domClass.remove(noticeText,"notice_pop_success");
                    domClass.remove(noticeText,"notice_pop_error");
                    domClass.remove(noticeText,"notice_pop_warning"); 
                    domClass.remove(noticeText,"notices_text"); 
                }
            }).play();
        },
        
        // -- Loading -- //
        
        loading: function(){
            var loadingItem = this.notices_loading;
            domClass.remove(loadingItem,"hidden");
            
            this._hideNotice();
        },
        
        doneLoading: function(){
            var loadingItem = this.notices_loading;
            domClass.add(loadingItem,"hidden");
        },
        
        // -- Dialogs --//
        /*
        * shows dialog with several options
        * REQUIRED text = "Do you want to save?"
        * OPTIONAL type = warning, info success, error : title = "Notice", closable: true, okText : "Ok Button Text", cancelText : "cancel Button Text", dontShow: true
        * 
        */
        showConfirmDialog: function(params){
            params.noCancel = false;
            return this._showDialog(params);
        },
        
        /*
        * shows dialog 1 button options
        * REQUIRED text = "Do you want to save?"
        * OPTIONAL type = warning, info success, error : title = "Notice", closable: true, okText : "Ok Button Text", cancelText : "cancel Button Text", dontShow: true
        * 
        */
        showDialog: function(params){
            params.noCancel = true;
            return this._showDialog(params);
        },
        
        /*
        * shows dialog with takes Params
        */
        _showDialog: function(params){
            
            this.doneLoading();
            
            var icon, typeTitle, typeClass, confDialog;
            
            
            icon = '';
            typeTitle = 'Notice';
            if(params.type == 'warning'){
                icon = ' <i class="fa fa-exclamation-triangle"></i> ';
                typeTitle = 'Warning';
                typeClass = "dialog_warning";
            }else if(params.type == 'info'){
                icon = ' <i class="fa fa-info-circle"></i> ';
                typeTitle = 'Info';
                typeClass = "dialog_info";
            }else if(params.type == 'success'){
                icon = ' <i class="fa fa-check-square"></i> ';
                typeTitle = 'Success';
                typeClass = "dialog_success";
            }else if(params.type == 'error'){
                icon = ' <i class="fa fa-times-circle"></i> ';
                typeTitle = 'Error';
                typeClass = "dialog_error";
            }
            
            //if a title is passed in used that
            if(params.title){
                typeTitle = params.title;
            }

            
            var confDialog = new ConfirmDialog({
                title: icon + typeTitle,
                content: params.text,
                closable: (params.closable? params.closable : false),
                class:(params.noCancel? 'dialog_hide_cancel' : '')+' '+typeClass,
                //style: "width: 300px" //Providing parameterized style
				style: params.style //Anyway style attribute is string here, why can't we pass this parameter 
					//from the caller?
            });
			//Modified the okText to okBtnText and cancelText to cancelBtnText for better readability.
            confDialog.set("buttonOk", (params.okBtnText? params.okBtnText : "Discard"));
            confDialog.set("buttonCancel", (params.cancelBtnText? params.cancelBtnText : "Cancel"));
            
            if(! params.dontShow){
			     confDialog.show();
            }
            
            return confDialog;
            
            // Returns the Dialog, can then use execute and cancel functions
            // confDialog.on("execute", function (dialogEvent) { });
        },
        
        // -- Setters to be used after notice object is instansiated -- //
        
        /*
        * Sets the global time out for all dialogs
        * Will take miliseconds or false to not hide dialogs
        */
        setTimeOut: function(milSec){
            timeOut = milSec;

            timeOutInfo = milSec;
            timeOutSuccess = milSec;
            timeOutError = milSec;
            timeOutWarning = milSec;
        },
        
        /*
        * Show close button / icon on notices, accepts true false
        */
        setShowCloseOnNotice:function(value){
            showCloseOnNotice = value;
        },
        
        /*
        * Sets Individual time outs
        * Will take miliseconds or false to not hide dialogs
        * this may be desired for your app if you want info windows to time out, but have errors always present.
        */
        setInfoTimeOut: function(milSec){
            timeOutInfo = milSec;
        },
        
        setSuccessTimeOut: function(milSec){
            timeOutSuccess = milSec;
        },
        
        setErrorTimeOut: function(milSec){
            timeOutError = milSec;
        },
        
        setWarningTimeOut: function(milSec){
            timeOutWarning = milSec;
        },
        
        
        setShowCloseOnNotice: function(trueFalse){
            showCloseOnNotice = trueFalse;
        }
        
    
	});	
});