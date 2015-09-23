//Predefined tokens
/*global define, console, dijit, dojox, dojo, confirm, FileReader, setTimeout, alert : true*/

/*global FROM_TEMPLATE_TO_FORM_CRT_EDT, REQUIRED_FIELDS_MISSING : true*/
/*global hasUserFormRWAccess, docTemplateTypeMemoryStore, this.app : true*/



define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "dojox/grid/_CheckBoxSelector", "dijit/form/Button",
    "dojo/store/Memory", "dojo/data/ObjectStore", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", 
	"dojo/promise/all"],
    function (dom, on, lang, registry, array, EnhancedGrid, CheckBoxSelector, Button, Memory, ObjectStore,
        domClass, domAttr, domStyle, all) {
        //"use strict";
        //Global variables pertain to this file.
        var optionType, formNum = {}, revDate = {}, formDesc = {}, localApp,
             selectedFileArray = [], selRowsForDeletion = [],
           /* displayErrorDiv, displayInfoDiv,*/ recordIndexCode, cancelButton, docFormTmpltTypeCM;
        
            var Function = this.app.FunctionHelper;
            //var Notice = this.app.NoticeHelper;
        
    
        return {
            init: function () {
                var uploadedTmpltLayout = null, templateTypeComp, templGridCells;
                var self = this;
                localApp = this.app;
                
                

                //templateTypeComp = dijit.byId("formTmpltType_uploadFormTemplates");

                console.debug('Trying to invoke the document form template type results..');
                //docFormTmpltTypeCM = registry.byId("formTmpltType_uploadFormTemplates");
				docFormTmpltTypeCM = dijit.byId("formTmpltType_uploadFormTemplates");
				docTemplateTypeMemoryStore = localApp.loadedStores.docTemplateTypeMemory;
                Function._getJsonRestEndpoint(localApp.loadedStores.jsonDocTemplateTypeRestDetails)
                    .query({}, {}).then(
                        function (docTemplateTypeResultsObj) {
                            var docTemplateTypes =  docTemplateTypeResultsObj.referenceData;
                            console.debug('Successful retrieval of document type templates..', docTemplateTypes);
                            docTemplateTypeMemoryStore.setData(docTemplateTypes);
                            docFormTmpltTypeCM.set("searchAttr", "targetDescription");
                            docFormTmpltTypeCM.set("placeHolder", "--Select--");
                            docFormTmpltTypeCM.store = docTemplateTypeMemoryStore;
                        },
                        function (error) {
                            console.error('Error in retreving the document form type data..');
                        }
					);

                //displayErrorDiv = dom.byId("displayErrorMsg_uploadFormTemplates");
                //displayInfoDiv = dom.byId("displayInfoMsg_uploadFormTemplates");


                //On change of document template type.
                on(docFormTmpltTypeCM, "click", function (evt) {
                    if (evt.length > 0) {
                        domAttr.remove("formTmplTpLbl_uploadFormTemplates", "style");
                        /*displayErrorDiv.innerText = "";
                        displayInfoDiv.innerText = "";
                        domClass.remove(displayErrorDiv, 'error');
                        domClass.remove(displayInfoDiv, 'info');*/
                    }
                });
                
//                cancelButton = new Button({
//                      label: 'Programatic',
//                      onClick: function(e){
//                            self.goBack(e);
//                      }
//                }, 'xBtn_uploadFormTemplates');   


                //Cancel button event
                /*on(dijit.byId("cancelBtn_uploadFormTemplates"), "click",  function (e) {
                    self.goBack(e);
                });*/

                //Done button event
                on(dijit.byId("doneBtn_uploadFormTemplates"), "click",  function (e) {
                    //registry.byId("cancelBtn_uploadFormTemplates").click();
                    self.goBack(formNum, revDate, formDesc, recordIndexCode,e);
                });

            },
            beforeActivate: function (previousView, data) {
                //alert("before activate");
                var formNumTxtComp, revDateTxtComp, formDescTxtComp;
                var self = this;
                console.debug('Entering into before activate of uploadformtemplate..');

                /*displayErrorDiv.innerText = "";
                displayInfoDiv.innerText = "";
                //domAttr.remove("formTmplTpLbl_uploadFormTemplates", "style");
                
                domClass.remove(displayErrorDiv, 'error');
                domClass.remove(displayInfoDiv, 'info');*/
                
                recordIndexCode = self.params.ric;
                formNum = self.params.formNum;
                formNumTxtComp = dijit.byId("formNum_uploadFormTemplates");
                formNumTxtComp.set('value', formNum);
                formNumTxtComp.set('disabled', true);

                revDate = self.params.revDate;
                revDateTxtComp = dijit.byId("revDate_uploadFormTemplates");
                revDateTxtComp.set('value', revDate);
                revDateTxtComp.set('disabled', true);

                formDesc = self.params.formDesc;
                formDescTxtComp = dijit.byId("formDesc_uploadFormTemplates");
                formDescTxtComp.set('value', formDesc);
                formDescTxtComp.set('disabled', true);

            },
            afterActivate: function (previousView, data) {
                var self = this;
                // -- Start Jquery -- //

                jQuery( document ).ready(function( $ ) {
                var upCount = 0, clearButton;

                var jqUploader = $('#puploader').plupload({
                    runtimes : 'html5',
                    max_file_size : '40mb',
                    file_data_name:"uploadedfile",
                    url: "blankUpload.html",                
                          filters: [{title: "Files", extensions: "tif,tiff,pdf,jpg,jpeg,png,gif,bmp,rtf,doc,docx,xls,xlsx,ppt,pptx"}],
                    init : {
                        FilesAdded: function(up, files) {
                            // Called when files are added to queue
                            //console.log('[FilesAdded]', files , up);
                            //var validate = thiss.validateForm();

                            $(".plupload_add .ui-button-text").html("Add Files");

                            if(up.files.length > 0) {
                                clearButton.button("enable");
                            } else {
                                clearButton.button("disable");
                            }

                        },
                        BeforeUpload: function(up, file){
                            // files trigger one at time, get the current upload number and push in just like to dojo uploader but as 1D array
                            //var fileCurSettings = fileSettingsGlobal.data[upCount];
                            var base64data;
                            var fileType = file.name.split(".").pop();
                            Notice.loading();
                            
                            var reader = new window.FileReader();
                            reader.readAsDataURL(file.getNative());
							
							/* try {
								docFormTmpltTypeCM.focus();
								docFormTmpltTypeCM.set("required", true);
								if (!docFormTmpltTypeCM.validate()) {
									//classftnObj.set('missingMessage', 'Classification should not be empty');
									domStyle.set(query("label[for=formTmpltType_uploadFormTemplates]")[0],
										{ color: "red",  fontWeight: "bold", fontStyle: "italic"});
									throw MINIMUM_DATA_REQUIRED;
								} */
								reader.onload = function () {
									base64data = reader.result;
									base64data = base64data.substring(base64data.indexOf(",") + 1);
									self.saveDocs(base64data,fileType);
								}
							/* } catch (error) {
								//registry.byId("standby").hide();
								Notice.doneLoading();
								domClass.add(displayErrorDiv, 'error');
								displayErrorDiv.innerText = error;
								return false;
							} */

                        },
                        UploadComplete: function(up, files) {

                            // Called when all files are either uploaded or failed

                            up.splice();
                            clearButton.button("disable");
                            upCount = 0;
							//Notice.doneLoading();
                        },
                        PostInit: function(up){
                            $(".plupload_add .ui-button-text").html("Add Files");
                            $(".plupload_add").attr('tabindex',0);
                            $(".plupload_start .ui-button-text").html("Import");
                            $(".plupload_start").attr('tabindex',0);
                            $(".plupload_start").css('z-index',1);
                            $(".plupload_stop").attr('tabindex',-1);

                            clearButton = $(" <a href='#' tabindex='0'>Clear</a>").button({icons: {primary: "ui-icon-trash"}}).button("disable").insertAfter('.plupload_buttons');

                            clearButton.click(function(e){
                                e.preventDefault();
                                up.splice();
                                $(".plupload_filelist_content").html('');
                                thiss._clearFiles();
                                clearButton.button("disable");

                            });
                        },
                        Error: function(up, args) {
                            // Called when error occurs
                            if(args.code == -601){
                                alert("Invalid File Type");
                                console.log(args);
                            }else{
                                // we aren't really firing an endpoint
                                //alert("Service Unavailable"); 
                                //console.log(args);
                            }
							Notice.doneLoading();
                        }
                    }
               });

               });



                // -- END jQuery -- //
                
            },
            
            saveDocs: function(encoded64, fileType){
                var fileSaveRequest = {}, jsonString, tempTmplEndPoint, jsonObj, endpoint, deferredTemplRes;
                var self = this;
                
                fileSaveRequest.documentTemplateData = encoded64;
                //fileSaveRequest.docTmplTypeCode = registry.byId("formTmpltType_uploadFormTemplates").get('value');
				fileSaveRequest.docTmplTypeCode = docFormTmpltTypeCM.get('value');
				fileSaveRequest.fileNameExtension = fileType;
                
                jsonString = JSON.stringify(fileSaveRequest);
                jsonObj = JSON.parse(jsonString);

                endpoint = localApp.loadedStores.formsTmplRepRestSvcsEndPoint;

                var tempTarget = endpoint.target;
                endpoint.target = endpoint.target +  self.params.ric + '/formtemplates';
                console.log("SAVE TEMPLATE URL:: ", endpoint.target);
                console.log("RREQUEST:: ",jsonString);
                //console.debug('endpoint.target+recordIndexCode/formtemplates', tempTmplEndPoint);
                Notice.loading();
				Function._setJsonRestEndpointTable(endpoint);
				deferredTemplRes = endpoint.put(jsonObj, {});
				console.log("SAVE TEMPLATE URL AFTER :: ", endpoint.target);
                
                all({deferredTemplRes : deferredTemplRes}).then(function (results) {
					
					console.info('Success in saving uploaded templates.');
					/*displayErrorDiv.innerHTML = '';
					domClass.remove(displayErrorDiv, 'error');
					domClass.add(displayInfoDiv, 'info');
					displayInfoDiv.innerHTML = 'Success in saving uploaded templates.';*/
					Notice.showSuccess(SUCCESS_UPLOAD_TEMPLATE);
					endpoint.target = tempTarget;
					Notice.doneLoading();
				}, function (err) {
					console.error('Error while saving uploaded templates.');
					Notice.showError(FAILURE_UPLOAD_TEMPLATE);
					/*displayInfoDiv.innerHTML = '';
					domClass.remove(displayInfoDiv, 'info');
					
					domClass.add(displayErrorDiv, 'error');
					displayErrorDiv.innerHTML = 'Error while saving uploaded templates.';*/
					endpoint.target = tempTarget;
					Notice.doneLoading();
				});
				
				
                /* Function._getJsonRestEndpoint(endpoint)
                    .put(jsonObj, {}).then(
                        function (saveResult) {
                            console.info('Success in saving uploaded templates.');
//                            var data = {}, transOpts;
//                            data.formNum = self.params.formNum;
//                            data.revDate =  self.params.revDate;
//                            data.formDesc = self.params.formDesc;
//                            data.recIndxNum = self.params.ric;
//                            transOpts = {
//                                target : "formTemplates",
//                                data : data
//                            };
//                            localApp.transitionToView(e.target, transOpts);
                            Notice.doneLoading();
                        },
                        function (error) {
                            console.error('Error while saving uploaded templates.');
                            domClass.add(displayErrorDiv, 'error');
                            displayErrorDiv.innerHTML = 'Error while saving uploaded templates.';
                        }
                    ); */
                //endpoint.target = tempTarget;
                
            },
            
            goBack: function(formNum, revDate, formDesc, recordIndexCode, e){
                    var data = {}, transOpts;
                    data.formNum = formNum;
                    data.revDate = revDate;
                    data.formDesc = formDesc;
                    data.recIndxNum = recordIndexCode;
                    transOpts = {
                        target : "formTemplates",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);   
            }
        };
    });