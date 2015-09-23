
/*global stateTypeMemStore, secLvlCdMemStore, nppiPciDesnMemStore, clasftnMemStore, subClassMemStore,
         docFormTpMemStore, timingReqMemStore, timingCdMemStore, distChanMemStore, docContentTypeMemStore,
         businessFunMemStore, stateMemStore, hasUserFormRWAccess : true*/

/*global define, dojo, dojox, dijit, console, alert, setTimeout, confirm : true*/

/*global notApplicable, FORM_CREATE, FORM_VIEW_OR_EDIT, errorStyleClass, errorBtnStyleClass,
         filedCd, nonFiledCd, adminCd, correspondenceCd, NAVIGATION_LINK_PATH, pathFromprodToFormCrtorUpd,
         pathfromCmntToFormCrtOrUpd, fromCrtOrUpdFormToSearch, sortObj,
        SUCCESS_FORM_DTLS_CRT, SUCCESSFUL_FORM_UPDT, SUCCESS_FORM_CMNT_SAVE, EXCEPTION_IN_CMNT_SAVE,
        EXCEPTION_IN_FORM_DTLS_CRT, EXCEPTION_IN_FORM_UPDT, CONTACT_SYS_ADMIN, FAILURE, SUCCESS,
        NO_CMNTS_CRTD, NO_DETLS_FOR_CORM_CRT_OR_UPDT, FROM_HISTSCRN_TO_FORMCRTORUPD,
        EXCEPTION_IN_FETCHING_FORM_DTLS, MINIMUM_DATA_REQUIRED, ALERT_FOR_UNSAVED_CHANGES,
        FROM_SEARCH_ROW_TO_FORM_CRT_EDT : true*/

define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dijit/form/RadioButton", "dijit/form/DateTextBox",
        "controllers/widgets/functions.js", "dojo/data/ObjectStore", "dojo/store/Memory", "dojo/ready", "dijit/form/MultiSelect",
        "dijit/form/Form", "dijit/form/Button", "dijit/Dialog", "dojo/_base/array", "dojo/dom-style",
        "dojo/request/xhr", "dojo/query", "dojo/dom-attr", "dojo/parser", "dojo/request",
        "dojo/date", "dojox/grid/DataGrid", "dojo/dom-class", "models/forms/formCreateOrModifyModal.js", "dojo/promise/all", "dojox/grid/EnhancedGrid",
		"dojo/date/stamp", "dojo/date/locale", "dojox/grid/cells/dijit", "dojo/html", "dojo/domReady!"],
    function (dom, on, lang, registry, RadioButton, DateTextBox, Functions, ObjectStore, Memory, ready, MultiSelect,
        Form, Button, Dialog, array, domStyle, xhr, query, domAttr, parser, request, dojoDate, DataGrid,
        domClass, formCreateOrModifyModal, all, EnhancedGrid, stamp, locale, celldijit, html) {
        "use strict";
        //var Notice = this.app.NoticeHelper;
        var Function, labelValueObj = {}, label = {}, value = {}, cd = {}, emptyStore, formCreationMemStore, jsonRestEndPoint,
            formDetailMemStore, jsonRestFormDetailsStore, stateTypeLocalMemStore, resdncTypeLocalMemStore, optionType,
            msePrdCd, subClsWRTClsStore, docFormTypeObj, classftnObj, subClassftnObj, stateObj, tmgReqObj, tmgCdObj,
            distChnlObj, retunrHOIndObj, stateTypeObj, resdncTypeObj, docCntTypeObj, nppiPciDesnObj, busFunObj,
            formNumComp, formRevComp, docDecComp, docTitleComp, docUsageInuComp, formUseDtComp, stApprDtComp,
            stEffDtComp, stExpDateComp, pageCntComp, lunarDocTpComp, lifeEffDtComp, lifeExpDtComp, promImplDtComp,
            docMakerImplDtComp, formComp, clone_form_btn, view_form_history_btn, returnHOIndComp, tranIndComp,
            componentArray = [], returnHOYIndComp, returnHONIndComp, transYIndComp, transNIndComp, logoYIndComp,
            logoNIndComp, offSignYIndComp, offSignNIndComp, extract_st_form_btn, associtate_to_pack_form_btn,
            promotion_form_btn, save_form_btn, exStateDialogCM, inStateDialogCM, avaliableStateDialogCM, haveReadWriteAccess,
            tempStateMemStore, groupedFormStore = null, recivedForm  = null, previousStateCds = [], previousProductCds = [],
            previousChannelCds = [], selectedSts = [], selectedProdCds = [], selectedChannels = [], grpdStateCdsHash = {},
            commonAttrChange = false, editProdBtn, groupedFormIds = [], enteredComments = null, formId = null,
            commonFormAttrChangedFlag = false, isFormReadyForPromote = false, localApp = null, ricTxtCompObj = null,
            formEvents = [], formNumEvntHndlr, formRevEvntHndlr, docDecEvntHndlr, classftnEvntHndlr, subClassftnEvntHndlr,
            docFormTypeEvntHndlr, docTitleEvntHndlr, docUsageInuEvntHndlr, tmgReqEvntHndlr, tmgCdEvntHndlr, distChnlEvntHndlr,
            returnHOYIndEvntHndlr, returnHONIndEvntHndlr, stateTypeEvntHndlr, resdncTypeEvntHndlr, transYIndEvntHndlr,
            transNIndEvntHndlr, formUseDtEvntHndlr, stApprDtEvntHndlr, stEffDtEvntHndlr, pageCntEvntHndlr, logoYIndEvntHndlr,
            logoNIndEvntHndlr, offSignYIndEvntHndlr, offSignNIndEvntHndlr, lunarDocTpEvntHndlr, busFunEvntHndlr,
            lifeEffDtEvntHndlr, lifeExpDtEvntHndlr, docMakerImplDtEvntHndlr, isFormCloned = false, editStBtn, includeStBtn,
            excludeStBtn, removeStBtn, saveExtractBtn,cancelExtractBtn, includeAllStsBtn, excludeAllStsBtn, acceptStsBtn, /* resetRemovedStsBtn, */ historyBtn, commentsBtn,
            formCancelBtn, /* displayErrorDiv, displayInfoDiv, displayWarnDiv, */ stPrChAttrChangedFlag = false, templatesBtn,
            idAndOrgnlMapArray = [], promoteValidation, createCmntReq = {}, onPageLoad = false, groupedFormStPrChMapObj = [], expirationDtSetSts = [],
            remStatesWithExpDates = [], isInit, displayNameComp, self, isFormPromoted;

        Function = new Functions();
        //**********Global Methods********************//

        /**
        * This method is used to clean up the all global variables when navigation comes form
        * navigation frame.
        */
        function initializationCleanUp() {
            console.debug('Cleaning up of all data..');
            previousStateCds = [];
            previousProductCds = [];
            previousChannelCds = [];
            selectedSts = [];
            selectedProdCds = [];
            selectedChannels = [];
            exStateDialogCM.reset();
            inStateDialogCM.reset();
            tmgCdObj.set('value', []);
            tmgCdObj._updateSelection();
            distChnlObj.set('value', []);
            distChnlObj._updateSelection();
            nppiPciDesnObj.set('value', []);
            nppiPciDesnObj._updateSelection();
            stEffDtComp.set('value', null);
            groupedFormStore = null;
            groupedFormIds = [];
            enteredComments = null;
            createCmntReq = {};
            formId = null;
            isFormCloned = false;
            query(".promotionIndClass label").forEach(function (node, index, arr) {
                domAttr.remove(node, "style");
            });
            domStyle.set(dom.byId("riclbl_createOrViewMdfyForm"), 'display', 'none');
            //Button
            domAttr.remove("edit_product_btn_createOrViewMdfyForm", "style");
            stApprDtComp.set("disabled", false);
            returnHONIndComp.set("checked", false);
            stateTypeObj.set("disabled", false);
            array.forEach(formEvents, function (handle) {
                handle.remove();
            });
            formEvents = [];
            save_form_btn.set("disabled", true);
            commonFormAttrChangedFlag = false;
            stPrChAttrChangedFlag = false;
            idAndOrgnlMapArray = [];
            groupedFormStPrChMapObj = [];
            grpdStateCdsHash = [];
            expirationDtSetSts = [];
			remStatesWithExpDates = [];
			isFormPromoted = false;
            console.debug('Cleaning up of all data is done..');
        }
        /**
         * This method disables or enables the label style
         */
        function disableOrEnableErrMsgForSelect(selectedVal, label, isFormReadyForPromote) {
            if (selectedVal) {
                domAttr.remove(query(label)[0], "style");
            } else {
                if (isFormReadyForPromote) {
                    domStyle.set(dojo.query(label)[0], errorStyleClass);
                }
            }
        }
        /**
         * This method disables or enables the label style
         */
        function disableOrEnableErrMsgForCMSelect(selectedVal, label, isFormReadyForPromote) {
            if (selectedVal.length > 0) {
                domAttr.remove(query(label)[0], "style");
            } else {
                if (isFormReadyForPromote) {
                    domStyle.set(dojo.query(label)[0],
                        errorStyleClass);
                }
            }
        }
        /**
        * This method is used to check whether the form widget has a change in its value.
        */
        function isCommonFormAttrChanged(component,isValueChanged) {
            //commonFormAttrChangedFlag = true;
            //save_form_btn.set("disabled", false);
            console.debug(component.name, 'value is getting changed');
            var handler, isValueEmpty = true;
            try {
                handler = component.watch('value', function (name, oldValue, value) {
                    if (oldValue != value) {
                        commonFormAttrChangedFlag = true;
                        save_form_btn.set("disabled", false);
                        if(isValueChanged){
                            clone_form_btn.set("disabled", true);
                        }else{
                        clone_form_btn.set("disabled", false);
                        }
                        isValueEmpty = false;
                    } else {
                        commonFormAttrChangedFlag = false;
                        save_form_btn.set("disabled", true);
                            clone_form_btn.set("disabled", false);
                    }
                });
                //This check is used when the input field do have empty value.
                if (isValueEmpty) {
                    commonFormAttrChangedFlag = true;
                    save_form_btn.set("disabled", false);
                    if(isValueChanged){
                            clone_form_btn.set("disabled", true);
                    }else{
                        clone_form_btn.set("disabled", false);
                    }
                }
            } catch (error) {
                console.error('Error occured in isFormValueChanged -->');
            }

        }
        /**
        *This function gives java script label value object array for products.
        */
        function getLabelValueObjForProduct(arrayObjects) {

            var labelValArray = [], labelValueObj = {}, mseProdCd = {};
            array.forEach(arrayObjects, function (code) {
                labelValueObj.mseProdCd = code;
                labelValArray.push(labelValueObj);
                labelValueObj = {};
            });
            return labelValArray;
        }
        /**
         *This function compares two Arrays
         */
        Array.prototype.equals =  function (array) {
            // if the other array is a falsy value, return
                if (!array)
                    return false;
                // compare lengths - can save a lot of time
                if (this.length != array.length)
                    return false;

                for (var i = 0, l=this.length; i < l; i++) {
                    // Check if we have nested arrays
                    if (this[i] instanceof Array && array[i] instanceof Array) {
                        // recurse into the nested arrays
                        if (!this[i].equals(array[i]))
                            return false;
                    }
                    else if (this[i] != array[i]) {
                        // Warning - two different object instances will never be equal: {x:20} != {x:20}
                        return false;
                    }
                }
                return true;
         }
        /**
        *This method gives the label valud object for given array of objects
        */
        function getLabelValueObj(arrayObjects) {

            var labelValArray = [], labelValueObj = {}, cd = {};
            array.forEach(arrayObjects, function (code) {
                labelValueObj.cd = code;
                labelValArray.push(labelValueObj);
                labelValueObj = {};
            });
            return labelValArray;
        }
        /**
        * This method gives the label value channel objects
        */
        function getChannels(addedDistChanCds, previousChannelCds) {
            var distChannels = [];
            if (addedDistChanCds.length > 0) {
                distChannels = getLabelValueObj(addedDistChanCds);
            } else {
                distChannels = getLabelValueObj(previousChannelCds);
            }
        }
        /**
        * This method creates the create or update form details request.
        */
        function createOrUpdateFormDtlsRequest(optionType, isFormReadyForPromote) {
            //Retrive all values from the form
                    //preparing the input request for saving form.

            var formsInputDetails = {}, formSource = {}, formNum,
                formRvnDt, docDesc, classtnCd, subclassificationCd, docFormTypeCd, docTitl, docUsageInu, tmgReqCd, tmgCds,
                stateTypeValue, docFormUseDt, stAprvlDt, stEffDt, stExprtnDt, nppiPciDesignations, docCntTypeCd,
                pgCntNum, lunarDocTypeNm, busFunCd, lifeEffDt, lifeExprtnDt, promoImplnDt, documakerImplnDt, rtrnToHomeOffcInd,
                transitionalInd, ofeSigInd, allChannelSelected = {}, stateTypeCode = null, areSaveMandFieldsPrsnt = true,
                statesStr, saveValidationComps = [], docFormType = {}, refTimingReqrmnt = {}, timingCds = [], stateTypeLocObj = [],
                resdncType, totalVal, stateType = {}, nppiPciDesignationsLocal = [], docContentType = {}, businessFunction = {},
                returnToHIArray = [], tranIndArray = [], logoIndArray = [], ofeSigIndArray = [], elem = null, states = [], products = [],
                mseProdCd = null, logoInd, effDtTm = {}, endDtTm = {}, crtdDtTm = {}, crtdByUsrId = {}, secLvlCodeStr = {};

            formNum = formNumComp.get('value');
            formRvnDt = formRevComp.get('value');
            docDesc = docDecComp.get('value');
            classtnCd = classftnObj.get('value');
            subclassificationCd = subClassftnObj.get('value');
            docFormTypeCd = docFormTypeObj.get('value');
            docTitl = docTitleComp.get('value');
            docUsageInu = docUsageInuComp.get('value');
            statesStr = stateObj.get('value');
            tmgReqCd = tmgReqObj.get('value');
            tmgCds = tmgCdObj.get('value');
            //Global variable : selectedChannels
            selectedChannels = distChnlObj.get('value');
            // End
            stateTypeValue = stateTypeObj.get('value');
            docFormUseDt = formUseDtComp.get('value');
            stAprvlDt = stApprDtComp.get('value');
            stEffDt = stEffDtComp.get('value');
            stExprtnDt = stExpDateComp.get('value');
            stExpDateComp.set("disabled", true);
            nppiPciDesignations = nppiPciDesnObj.get('value');
            docCntTypeCd = docCntTypeObj.get('value');
            pgCntNum = pageCntComp.get('value');
            lunarDocTypeNm = lunarDocTpComp.get('value');
            busFunCd = busFunObj.get('value');
            lifeEffDt = lifeEffDtComp.get('value');
            lifeExprtnDt = lifeExpDtComp.get('value');
            lifeExpDtComp.set("disabled", true);
            //promoImplnDt = promImplDtComp.get('value');
            documakerImplnDt = docMakerImplDtComp.get('value');
            //TBD
            //commonAttrChange = true;
            formNumComp.focus();
            formNumComp.set("required", true);
            if (!formNum) {
                //formNumComp.set('missingMessage', 'Form Number should not be empty');
                domStyle.set(dojo.query("label[for=formnum_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(formNumComp);

            }
            formsInputDetails.formNum = formNum;

            if (!formRevComp.validate()) {
                domStyle.set(dojo.query("label[for=revDate_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(docDecComp);
            } else {
                if (formRvnDt) {
                    formsInputDetails.formRvnDt = formRvnDt;
                }
            }
            if (isFormReadyForPromote) {
                if (!docDesc) {
                    //docDecComp.set('missingMessage', 'Form Desc should not be empty');
                    domStyle.set(dojo.query("label[for=formDesc_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(docDecComp);
                } else {
					formsInputDetails.docDesc = docDesc;
				}
            } else if (docDesc) {
				formsInputDetails.docDesc = docDesc;
			}

            classftnObj.focus();
            classftnObj.set("required", true);
            if (!classftnObj.validate()) {
                //classftnObj.set('missingMessage', 'Classification should not be empty');
                domStyle.set(query("label[for=clasftn_createOrViewMdfyForm]")[0],
                    { color: "red",  fontWeight: "bold", fontStyle: "italic"});
                saveValidationComps.push(classftnObj);
            }
            formsInputDetails.classtnCd =  classtnCd;

            subClassftnObj.focus();
            subClassftnObj.set("required", true);
            if (!subClassftnObj.validate()) {
                domStyle.set(query("label[for=subClasftn_createOrViewMdfyForm]")[0],
                    { color: "red",  fontWeight: "bold", fontStyle: "italic"});
                saveValidationComps.push(subClassftnObj);
            }
            formsInputDetails.subclassificationCd = subclassificationCd;

            docFormTypeObj.focus();
            docFormTypeObj.set("required", true);
            if (!docFormTypeObj.validate()) {
                domStyle.set(query("label[for=formType_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(docFormTypeObj);
            } else {
                docFormType.cd = docFormTypeCd;
                formsInputDetails.docFormType = docFormType;
				formsInputDetails.docTypeCd = docFormTypeCd;
            }
			formsInputDetails.recIdxNum = ricTxtCompObj.get('value');
			
			
            if (!pageCntComp.validate()) {
                pageCntComp.focus();
                domStyle.set(query("label[for=noOfPages_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(docFormTypeObj);
            }
            if (!isFormReadyForPromote) {
                array.forEach(saveValidationComps, function (comp) {
                    throw "Mandatory fields missing for Saving the form..";
                });
            }
            /* if (isFormReadyForPromote) {
                docTitleComp.focus();
                if (!docTitl) {
                    domStyle.set(query("label[for=formTitle_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(docTitleComp);
                }
            } */

            if (!Function.isEmpty(docTitl)) {
                formsInputDetails.docTitl = docTitl;
            }

            if (docUsageInu !== null && docUsageInu.length > 0) {
                formsInputDetails.docUsageInu = docUsageInu;
            }
            if (isFormReadyForPromote) {
                tmgReqObj.set("required", true);
                tmgReqObj.focus();
                if (!tmgReqObj.validate()) {
                    domStyle.set(query("label[for=tmgreq_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(tmgReqObj);
                }
            } else {
                tmgReqObj.set("required", false);
            }
            if (tmgReqCd) {
                refTimingReqrmnt.cd = tmgReqCd;
                formsInputDetails.refTimingReqrmnt = refTimingReqrmnt;
				formsInputDetails.timingReqrmntCd = tmgReqCd;
            }
			if (((optionType === FORM_CREATE &&  isFormReadyForPromote) && tmgCds.length === 0)
					|| (optionType === FORM_VIEW_OR_EDIT &&  isFormReadyForPromote) && tmgCds.length === 0) {
            //if (isFormReadyForPromote) {
                tmgCdObj.set("required", true);
                tmgCdObj.focus();
                tmgCdObj.validate();
                if (!tmgCdObj.isValid()) {
                    domStyle.set(dojo.query("label[for=tmgCd_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(tmgCdObj);
                }
            } else {
				tmgCdObj.validate(false);
                tmgCdObj.set("focused", false);
                tmgCdObj.set("required", false);
            }
            if (tmgCds.length > 0) {
                array.forEach(tmgCds, function (result, i) {
                    labelValueObj.cd = result;
                    timingCds.push(labelValueObj);
                    labelValueObj = {};
                });
                formsInputDetails.timingCds = timingCds;
            }
            if (isFormReadyForPromote) {
                if (selectedSts.length > 0) {
                    stateTypeObj.set("disabled", false);
                } else {
                    stateTypeObj.set("disabled", true);
                }
                resdncTypeObj.set("disabled", true);
            }
            if (!Function.isEmpty(stateTypeValue)) {
                resdncTypeObj.set("disabled", false);
                if (stateTypeValue === 'Resident') {
                    if (!resdncTypeObj.validate()) {
                        resdncTypeObj.focus();
                        saveValidationComps.push(resdncTypeObj);
                    } else {
                        resdncType = resdncTypeObj.get('value');
                        totalVal = resdncType + " " + stateTypeValue;
                        stateTypeLocObj = stateTypeMemStore.query({targetDescription: totalVal});
                    }
                } else {
                    stateTypeLocObj = stateTypeMemStore.query({targetDescription: stateTypeValue});
                }
                stateTypeCode = stateTypeLocObj[0].sourceCode;
                if (stateTypeCode !==  null  || stateTypeCode !== "undefined") {
                    stateType.cd = stateTypeCode;
                    formsInputDetails.stateType = stateType;
					formsInputDetails.stTypeCd = stateTypeCode;
                }
            }

            //Form Dates
            if (docFormUseDt) {
                formsInputDetails.docFormUseDt = docFormUseDt;
            }
            if (stAprvlDt) {
                formsInputDetails.stAprvlDt = stAprvlDt;
            }
            if (stEffDt) {
                formsInputDetails.stEffDt = stEffDt;
            }
            if (stExprtnDt) {
                formsInputDetails.stExprtnDt = stExprtnDt;
            } else {
                stExpDateComp.set("disabled", true);
            }
			if (((optionType === FORM_CREATE &&  isFormReadyForPromote) && nppiPciDesignations.length === 0)
					|| (optionType === FORM_VIEW_OR_EDIT &&  isFormReadyForPromote) && nppiPciDesignations.length === 0) {
            //if (isFormReadyForPromote) {
                nppiPciDesnObj.set('required', true);
                nppiPciDesnObj.focus();
                if (!nppiPciDesnObj.validate()) {

                    domStyle.set(dojo.query("label[for=nppiPciDesn_createOrViewMdfyForm]")[0],
                            errorStyleClass);
                    saveValidationComps.push(tmgCdObj);
                }
            } else {
				nppiPciDesnObj.validate(false);
                nppiPciDesnObj.set('required', false);
                nppiPciDesnObj.set("focused", false);
            }
            secLvlCodeStr = "";
            if (nppiPciDesignations.length > 0) {
                array.forEach(nppiPciDesignations, function (result, i) {
                    if (result !== notApplicable) {
                        labelValueObj.cd = result.charAt(0);
                        nppiPciDesignationsLocal.push(labelValueObj);
                        labelValueObj = {};
                        secLvlCodeStr = secLvlCodeStr.concat(result.charAt(0));
                    } else {
                        labelValueObj.cd = result;
                        nppiPciDesignationsLocal.push(labelValueObj);
                        labelValueObj = {};
                        secLvlCodeStr = result;
                    }
                });
                formsInputDetails.nppiPciDesignations = nppiPciDesignationsLocal;
                formsInputDetails.secLvlCodeStr = secLvlCodeStr;
            }
			
            if (isFormReadyForPromote) {
                docCntTypeObj.set('required', true);
                docCntTypeObj.focus();
                if (!docCntTypeObj.validate()) {
                    domStyle.set(dojo.query("label[for=docContent_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(docCntTypeObj);
                }
            }
            if (!Function.isEmpty(docCntTypeCd)) {
                docContentType.cd = docCntTypeCd;
                formsInputDetails.docContentType = docContentType;
				formsInputDetails.cntntTypeCd = docCntTypeCd;
            }

            if (isFormReadyForPromote) {
                pageCntComp.set('required', true);
                pageCntComp.focus();
                if (!pageCntComp.validate()) {
                    domStyle.set(dojo.query("label[for=noOfPages_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(tmgCdObj);
                }
            }
            if (!Function.isEmpty(pgCntNum)) {
                formsInputDetails.pgCntNum = pgCntNum;
            }

            if (lunarDocTypeNm !== null && lunarDocTypeNm.length > 0) {
                formsInputDetails.lunarDocTypeNm = lunarDocTypeNm;
            }
            if (busFunCd !== null && busFunCd.length > 0) {
                businessFunction.cd = busFunCd;
                formsInputDetails.businessFunction = businessFunction;
				formsInputDetails.busFncCd = busFunCd;
            }
            //System dates
            if (isFormReadyForPromote) {
                lifeEffDtComp.set('required', true);
                lifeEffDtComp.focus();
                if (!lifeEffDtComp.validate()) {
                    domStyle.set(dojo.query("label[for=lifeEffDate_createOrViewMdfyForm]")[0],
                                errorStyleClass);
                    saveValidationComps.push(tmgCdObj);
                }
            }
            if (lifeEffDt !== null) {
                formsInputDetails.lifeEffDt = lifeEffDt;
            }
            //Life exp date
            if (lifeExprtnDt !== null) {
                formsInputDetails.lifeExprtnDt = lifeExprtnDt;
            } else {
                //Set high date
                formsInputDetails.lifeExprtnDt = "9999-12-31T00:00:00.000Z"; //TBD High date
            }
            //Promotion impl date
            if (isFormReadyForPromote  && promoImplnDt !== null) {
                formsInputDetails.promoImplnDt = new Date();
            }
            //Promotion impl date
            /* if (isFormReadyForPromote  && promImplDt !== null) {
                //promImplDtComp.set('value', new Date());
                formsInputDetails.promImplDt = promImplDt;
            } */
            //documaker impl date
            if (documakerImplnDt !== null) {
                formsInputDetails.documakerImplnDt = documakerImplnDt;
            }
            if (isFormReadyForPromote) {

                returnToHIArray = query("input[type=radio][name=returntoHO_createOrViewMdfyForm]");
                var isReturnToHome=false;
                var returnToHIArrayTemp = [];
                array.forEach(returnToHIArray, function (returnToHI) {
                    if (returnToHI.checked) {
                        isReturnToHome=true;
                    }else{
                        returnToHIArrayTemp.push(returnToHI);
                    }
                });
                if(!isReturnToHome){
                    domStyle.set(query("label[for=returntoHO_createOrViewMdfyForm]")[0],
                            errorStyleClass);
                    array.forEach(returnToHIArrayTemp, function (returnToHI) {
                        saveValidationComps.push(returnToHI);
                    });
                }

                tranIndArray = query("input[type=radio][name=tranInd_createOrViewMdfyForm]");
                var isTransactional=false;
                var tranIndArrayTemp = [];
                array.forEach(tranIndArray, function (tranInd) {
                    if (tranInd.checked) {
                        isTransactional=true;
                    }else{
                        tranIndArrayTemp.push(tranInd);
                    }
                });
                if (!isTransactional) {
                    domStyle.set(query("label[for=tranInd_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    array.forEach(tranIndArrayTemp, function (tranInd) {
                        saveValidationComps.push(tranInd);
                    });
                }

                logoIndArray = query("input[type=radio][name=logoInd_createOrViewMdfyForm]");
                var isLogo=false;
                var logoIndArrayTemp = [];
                array.forEach(logoIndArray, function (logoIndLocal) {
                    if (logoIndLocal.checked) {
                        isLogo=true;
                    }else{
                        logoIndArrayTemp.push(logoIndLocal);
                    }
                });
                if (!isLogo) {
                    domStyle.set(query("label[for=logoInd_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    array.forEach(logoIndArrayTemp, function (logoIndLocal) {
                        saveValidationComps.push(logoIndLocal);
                    });
                }

                ofeSigIndArray = query("input[type=radio][name=offSignInd_createOrViewMdfyForm]");
                var isOffSignature=false;
                var ofeSigIndArrayTemp = [];
                array.forEach(ofeSigIndArray, function (ofeSigInd) {
                     if (ofeSigInd.checked) {
                         isOffSignature=true;
                     }else{
                         ofeSigIndArrayTemp.push(ofeSigInd);
                     }

                });
                if (!isOffSignature) {
                    domStyle.set(query("label[for=offSignInd_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    array.forEach(ofeSigIndArrayTemp, function (ofeSigInd) {
                        saveValidationComps.push(ofeSigInd);
                   });
                }
            }
            array.forEach(formComp.elements, function (elem) {
                if (elem.type === "radio" && elem.checked) {
                    if (elem.name === "returntoHO_createOrViewMdfyForm") {
                        rtrnToHomeOffcInd = elem.value;
                        formsInputDetails.rtrnToHomeOffcInd = rtrnToHomeOffcInd;
                    } else if (elem.name === "tranInd_createOrViewMdfyForm") {
                        transitionalInd = elem.value;
                        formsInputDetails.transitionalInd = transitionalInd;
                    } else if (elem.name === "logoInd_createOrViewMdfyForm") {
                        logoInd = elem.value;
                        formsInputDetails.logoInd = logoInd;
                    } else if (elem.name === "offSignInd_createOrViewMdfyForm") {
                        ofeSigInd = elem.value;
                        formsInputDetails.ofeSigInd = ofeSigInd;
                    }
                }
            });
            // State Request Object Creation
            if ((optionType === FORM_CREATE && isFormReadyForPromote) && 
					selectedSts.length === 0){
                stateObj.focus();
                domStyle.set(dojo.query("label[for=states_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(stateObj);

            } else if ((optionType === FORM_VIEW_OR_EDIT && isFormReadyForPromote) && 
					selectedSts.length === 0){
                stateObj.focus();
                domStyle.set(dojo.query("label[for=states_createOrViewMdfyForm]")[0],
                    errorStyleClass);
                saveValidationComps.push(stateObj);

            } else {
                if (selectedSts.length > 0) {
                    formsInputDetails.states = getLabelValueObj(selectedSts);
                } else if (previousStateCds.length > 0) {
                    formsInputDetails.states = getLabelValueObj(previousStateCds);
                }
            }

            // Product Request Object Creation
            if ((optionType === FORM_CREATE &&  isFormReadyForPromote) && 
				selectedProdCds.length === 0) {
					//((optionType === FORM_VIEW_OR_EDIT && isFormReadyForPromote) && selectedProdCds.length === 0)) {
                console.debug('products are empty in create mode..');
                domStyle.set("edit_product_btn_createOrViewMdfyForm",
                    errorBtnStyleClass);
                saveValidationComps.push(editProdBtn);

            } else if ((optionType === FORM_VIEW_OR_EDIT &&  isFormReadyForPromote) && 
					selectedProdCds.length === 0) {
                console.debug('products are empty in view mode..');
                domStyle.set("edit_product_btn_createOrViewMdfyForm",
                    errorBtnStyleClass);
                saveValidationComps.push(editProdBtn);

            } else {
                if (selectedProdCds.length > 0) {
                    formsInputDetails.products = getLabelValueObjForProduct(selectedProdCds);
                } else if (previousProductCds.length > 0) {
                    formsInputDetails.products = getLabelValueObjForProduct(previousProductCds);
                }
            }
            //Channels object Creation
            if ( ((optionType === FORM_CREATE &&  isFormReadyForPromote) && selectedChannels.length === 0)
					|| (optionType === FORM_VIEW_OR_EDIT &&  isFormReadyForPromote) && selectedChannels.length === 0) {
			
                distChnlObj.set('required', true);
                distChnlObj.focus();
                if (!distChnlObj.validate()) {
                    domStyle.set(dojo.query("label[for=distChnl_createOrViewMdfyForm]")[0],
                        errorStyleClass);
                    saveValidationComps.push(distChnlObj);
                }
            } else {
				distChnlObj.validate(false);
                distChnlObj.set('required', false);
                distChnlObj.set('focused', false);
            }
            if (selectedChannels.length > 0) {
                formsInputDetails.distChannels = getLabelValueObj(selectedChannels);
                if (distChnlObj.options.length === selectedChannels.length) {
                    formsInputDetails.allChannelSelected = "true";
                } else {
                    formsInputDetails.allChannelSelected = "false";
                }

            } else if (previousChannelCds.length > 0) {
                formsInputDetails.distChannels = getLabelValueObj(previousChannelCds);
                if (distChnlObj.options.length === previousChannelCds.length) {
                    formsInputDetails.allChannelSelected = "true";
                } else {
                    formsInputDetails.allChannelSelected = "false";
                }
            }
            if (saveValidationComps.length > 0) {
                throw "Mandatory fields missing for Saving the form..";
            }
            formsInputDetails.extlRecInd = "0"; // Always Zero for forms
            formsInputDetails.formInd = "1";
            //formsInputDetails.effDtTm = new Date();
            //formsInputDetails.endDtTm = '9999-12-31T00:00:00.000Z';
            formsInputDetails.crtdByUsrId = SM_USER;
            //formsInputDetails.crtdDtTm = new Date();
            formsInputDetails.forceCommit = "false";
            if (!isFormReadyForPromote) {
                formsInputDetails.processType = "save";
            } else {
                formsInputDetails.processType = "promote";
            }
            //effDtTm, endDtTm, crtdByUsrId
            return formsInputDetails;
        }
        /**
         * Processing overlap forms.
         */
        function processOverlappedForms(jsonRestEndPoint, overlapForms, finalUpdateFormRequest,
            SM_USER, optionType, displayMsg, event){

            var transOpts = {}, params = {}, responseDeferred, formIdsStr = "", overlapMsgHtmlDiv, self = this;
            overlapMsgHtmlDiv = formCreateOrModifyModal.getOverlapMsgDiv(OVERLAP_ALERT, overlapForms);
            //if (confirm(OVERLAP_ALERT +':\n'+ overlapStr) == true) {
			//var anotherStr = OVERLAP_ALERT;
			var confDialog = Notice.showConfirmDialog({text:overlapMsgHtmlDiv, type: "warning", okBtnText: "Save",
				cancelBtnText: "Discard"});
			confDialog.on("execute", function (dialogEvent) {
				Notice.loading();
				finalUpdateFormRequest.commonAttributes.forceCommit = "true";
				var targetForPostOrPut = jsonRestEndPoint.target;
				//Notice.doneLoading();
				Function._setJsonRestEndpointTable(jsonRestEndPoint);
				responseDeferred = jsonRestEndPoint.put(finalUpdateFormRequest, {});
				//responseDeferred = Function.postXhrRequest(requestUrl, finalUpdateFormRequest, SM_USER);
				all({responseDeferred : responseDeferred}).then(function(results){
					var innerCreatedFormRes = results.responseDeferred.createdFormsRes;
					if(innerCreatedFormRes && innerCreatedFormRes.formIds) {
						array.forEach(innerCreatedFormRes.formIds, function (formId) {
								groupedFormIds.push(formId);
								formIdsStr = formIdsStr + formId + ',';
						});
					}
					displayMsg  = OVERLAP_FORM_SAVE_SUCCESS;
					params.type = optionType;
					params.displayMsg = displayMsg;
					params.path = fromCrtOrUpdFormToSearch;
					transOpts = {
						target : "formsSearch",
						data : params
					};
					console.debug('Trying to redirecting to the search screen..');
					localApp.transitionToView(event.target, transOpts);
					
				}, function (error) {
					
					console.error(OVERLAP_FORM_SAVE_FAILURE);
					//domClass.add(displayErrorDiv, 'error');
					//displayErrorDiv.innerHTML = displayMsg;
					Notice.showError(OVERLAP_FORM_SAVE_FAILURE);
					
				});
				jsonRestEndPoint.target = targetForPostOrPut;
				//self.transitionTo(event,"formsCreate", {});
			});
		}
        /**
        *This method is used to populate the form with details.
        */
        function populateFormWithDetails(recivedForm) {
            var stateShortDesc = "", tmgCdArray = [], retrivedTmgCds, distChannelCdArray = [],
                transIndObj, retunrHOIndObj, logInd, ofeSigInd, stateTypeArray, nppiPciDesngs, stEffDt = null,
                stExprtnDt = null, nppiPciDesns, nppiDescValues = [], nppiSplitValues = [], stateTypes = [],
                docFormUseDt = null, stAprvlDt = null, nppiPciDesc = null, nppiValue = null,
                lifeEffDt = null, lifeExprtnDt = null, promoImplnDt = null, documakerImplnDt = null;

            console.debug('Populating the form with the existing form detail');
            //Setting last argument to false as this will not trigger on change

            onPageLoad = false;
            //event when value is being set
            formNumComp.set("value", recivedForm.formNum, false);
            formRevComp.set("value", recivedForm.formRvnDt, false);
            docDecComp.set("value", recivedForm.docDesc, false);
            classftnObj.set("value", recivedForm.classtnCd, false);
            subClassftnObj.store = subClassMemStore;
            subClassftnObj.set("value", recivedForm.subclassificationCd, false);
            docFormTypeObj.set("value", recivedForm.docTypeCd, false);
            docTitleComp.set("value", recivedForm.docTitl, false);
            docUsageInuComp.set("value", recivedForm.docUsageInu, false);
            ricTxtCompObj.set("value", recivedForm.recIdxNum);
            //Rule elements
            if (previousStateCds.length > 0) {
                array.forEach(previousStateCds, function (stateCd) {
                    var selecteStObj, selStShrtDesc;
                    selecteStObj = (stateMemStore.query({"targetCode": stateCd}))[0];
                    if (selecteStObj) {
                        selStShrtDesc = selecteStObj.targetShortDescription;
                        if (selStShrtDesc !== null) {
                            stateShortDesc = stateShortDesc + selStShrtDesc + ',';
                        }
                    }
                });
                stateObj.set("value",  stateShortDesc.slice(0, (stateShortDesc.length - 1)), false);
            }

            tmgReqObj.set("value", recivedForm.timingReqrmntCd, false);

            retrivedTmgCds = recivedForm.timingCds;
            if (retrivedTmgCds !== null && retrivedTmgCds !== 'undefined') {
                array.forEach(recivedForm.timingCds, function (tmgCd) {
                    tmgCdArray.push(tmgCd.cd);
                });
                tmgCdObj.set('_onChangeActive', false);
                tmgCdObj.set('value', tmgCdArray);
                tmgCdObj.set('_onChangeActive', true);
            }
            if (previousChannelCds.length > 0) {
                array.forEach(previousChannelCds, function (channelCd) {
                    distChannelCdArray.push(channelCd);
                });
                distChnlObj.set('_onChangeActive', false);
                distChnlObj.set('value', distChannelCdArray);
                distChnlObj.set('_onChangeActive', true);
            }
            retunrHOIndObj = recivedForm.rtrnToHomeOffcInd;
            if (retunrHOIndObj) {
                if (retunrHOIndObj === "1") {
                    returnHOYIndComp.set('checked', true, false);
                } else if (retunrHOIndObj === "0") {
                    returnHONIndComp.set('checked', true, false);
                }
            }
            stateTypeArray = stateTypeMemStore.query({"targetCode": recivedForm.stTypeCd});
            if (stateTypeArray.length > 0) {
                stateTypes = stateTypeArray[0].targetDescription.split(" ");
                if (stateTypes.length > 0) {
                    stateTypeObj.set('value', stateTypes[1], false);
                    resdncTypeObj.set('value', stateTypes[0], false);
                } else {
                    stateTypeObj.set('value', stateTypes[0], false);
                }
            }

            transIndObj = recivedForm.transitionalInd;
            if (transIndObj) {
                if (transIndObj === "1") {
                    transYIndComp.set('checked', true, false);
                } else if (transIndObj === "0") {
                    transNIndComp.set('checked', true, false);
                }
            }
            //Form Dates

            docFormUseDt = recivedForm.docFormUseDt;
            if (docFormUseDt) {
                //formUseDtComp.set('value', new Date(docFormUseDt), false);
				formUseDtComp.set('value', Function._returnDateObj(docFormUseDt), false);
				
            }
            stAprvlDt = recivedForm.stAprvlDt;
            if (stAprvlDt) {
                //stApprDtComp.set('value', new Date(stAprvlDt), false);
				stApprDtComp.set('value', Function._returnDateObj(stAprvlDt), false);
            }
            stEffDt = recivedForm.stEffDt;
            if (stEffDt) {
                //stEffDtComp.set('value', new Date(stEffDt), false);
				stEffDtComp.set('value', Function._returnDateObj(stEffDt), false);
            } else {
                stExpDateComp.set("disabled", true);
            }

            stExprtnDt = recivedForm.stExprtnDt;
            if (stExprtnDt) {
                if (hasUserFormRWAccess) {
                    stExpDateComp.set("disabled", false);
                } else {
                    stExpDateComp.set("disabled", true);
                }
                //stExpDateComp.set('value', new Date(stExprtnDt), false);
				stExpDateComp.set('value', Function._returnDateObj(stExprtnDt), false);
            } else {
                stExpDateComp.set("disabled", true);
            }

            //Form Information elements
            nppiPciDesns = secLvlCdMemStore.query({"targetCode": recivedForm.secLvlCd});
            if (nppiPciDesns.length > 0) {
                nppiPciDesc = nppiPciDesns[0].targetShortDescription;
                if (nppiPciDesc !== null && nppiPciDesc !== 'undefined') {
                    nppiSplitValues = nppiPciDesc.split(" ");
                    if (nppiSplitValues.length > 0) {
                        array.forEach(nppiSplitValues, function (nppiSplitValue) {
                            if (nppiSplitValue !== notApplicable) {
                                nppiDescValues.push(nppiSplitValue.charAt(0));
                            } else {
                                nppiDescValues.push(nppiSplitValue);
                            }
                        });
                    } else {
                        nppiValue = nppiSplitValues[0];
                        if (nppiValue !== notApplicable) {
                            nppiDescValues.push(nppiValue.charAt(0));
                        } else {
                            nppiDescValues.push(nppiValue);
                        }
                    }
                }
            }
            nppiPciDesnObj.set('_onChangeActive', false);
            nppiPciDesnObj.set('value', nppiDescValues);
            nppiPciDesnObj.set('_onChangeActive', true);

            docCntTypeObj.set("value", recivedForm.cntntTypeCd, false);
            pageCntComp.set("value", recivedForm.pgCntNum, false);
            logInd = recivedForm.logoInd;
            if (logInd) {
                if (logInd === '1') {
                    logoYIndComp.set('checked', true, false);
                } else if (logInd === '0') {
                    logoYIndComp.set('checked', true, false);
                }
            }
            ofeSigInd = recivedForm.ofeSigInd;
            if (ofeSigInd) {
                if (ofeSigInd === '1') {
                    offSignYIndComp.set('checked', true, false);
                } else if (ofeSigInd === '0') {
                    offSignNIndComp.set('checked', true, false);
                }
            }
            lunarDocTpComp.set("value", recivedForm.lunarDocTypeNm, false);
            busFunObj.set("value", recivedForm.busFncCd, false);

            //System dates
            lifeEffDt = recivedForm.lifeEffDt;
            lifeExprtnDt = recivedForm.lifeExprtnDt;

            if (lifeEffDt) {
                //lifeEffDtComp.set('value', new Date(lifeEffDt), false);
            	console.debug('lifeEffDt-->', lifeEffDt);
				lifeEffDtComp.set('value', Function._returnDateObj(lifeEffDt), false);
				if (hasUserFormRWAccess) {
                    associtate_to_pack_form_btn.set('disabled', false);
                } else {
                    associtate_to_pack_form_btn.set('disabled', true);
                }
            } else {
            	if(!hasUserFormRWAccess) {
                	lifeEffDtComp.set('disabled', true);
                } else {
                	lifeEffDtComp.set('disabled', false);
                }
                associtate_to_pack_form_btn.set('disabled', true);
            }

            if (lifeExprtnDt) {
            	console.debug('lifeExprtnDt-->', lifeExprtnDt);
                if (hasUserFormRWAccess) {
                    lifeExpDtComp.set("disabled", false);
                } else {
                    lifeExpDtComp.set("disabled", true);
                }
                if (lifeEffDt) {
                    //lifeExpDtComp.set('value', new Date(lifeExprtnDt), false);
					lifeExpDtComp.set('value', Function._returnDateObj(lifeExprtnDt), false);
                }
            } else {
                lifeExpDtComp.set("disabled", true);
            }
            promoImplnDt = recivedForm.promoImplnDt;
            if (promoImplnDt) {
                //promImplDtComp.set('value', new Date(promoImplnDt), false);
				promImplDtComp.set('value', Function._returnDateObj(promoImplnDt), false);
            }
            documakerImplnDt = recivedForm.documakerImplnDt;
            if (documakerImplnDt) {
                //docMakerImplDtComp.set('value', new Date(documakerImplnDt), false);
				docMakerImplDtComp.set('value', Function._returnDateObj(documakerImplnDt), false);
            }
            
            save_form_btn.set("disabled", true);
            console.debug('Populating the form with the existing form detail is completed...');
        }

       function validateForPromote(isChecked) { // need to pass in "event" must be from button TODO
          
            isFormReadyForPromote = isChecked;

            if (isFormReadyForPromote) {
                try {
                    createOrUpdateFormDtlsRequest(optionType, isFormReadyForPromote);
                } catch (err) {
					distChnlObj.reset();
					nppiPciDesnObj.reset();
					tmgCdObj.reset();
					var confDialog = Notice.showDialog({text:MINIMUM_DATA_REQUIRED, 
						type: "error", cancelBtnText: "Discard", style: "width:auto; height:auto"});
						confDialog.on("execute", function (dialogEvent) { 
							self.transitionTo(event, "formsCreate", {});
						});
				}
                console.debug('Validation  of form is successful for promotion..');
            } else {
                //Removing the focus
                query(".notFocusClass").forEach(function (node, index, arr) {
                    dijit.byNode(node).set("required", false);
                });
                query(".promotionIndClass label").forEach(function (node, index, arr) {
                    domAttr.remove(node, "style");
                });
                domAttr.remove("edit_product_btn_createOrViewMdfyForm", "style");
                //displayErrorDiv.innerText = "";
                //displayInfoDiv.innerText = "";
                //domClass.remove(displayErrorDiv, 'error');
                //domClass.remove(displayInfoDiv, 'info');
				distChnlObj.reset();
				nppiPciDesnObj.reset();
				tmgCdObj.reset();
				
				
            }
       }

        return {

            init: function () {

                var stateTypes = [], stateTypesHash = {}, residenceTypes = [],
                    nppiPcciData = [], nppiPcciDesgnsHash = {}, nppiPcciDesgns = [],
                    nppiPcciValues = [], nppiNAValue = null, tgtShrtDescCd = null, arrLength, arrValue;
				self = this;
                emptyStore = new ObjectStore({
                    objectStore : new Memory({
                        data : []
                    })
                });
                //store for saving form elements
                localApp = this.app;
                formCreationMemStore = localApp.loadedStores.formCreationMemory;
                jsonRestEndPoint = localApp.loadedStores.jsonRestEndPoint;

                // Getting Form elements
                formDetailMemStore = localApp.loadedStores.formDetailMemory;
                jsonRestFormDetailsStore = localApp.loadedStores.jsonRestFormDetails;

                array.forEach(stateTypeMemStore.data, function (stateType) {
                    var stTypeValues = (stateType.targetDescription).split(" ");
                    if (stTypeValues.length > 1) {
                        array.forEach(stTypeValues, function (stTypeValue) {
                            if (!stateTypesHash[stTypeValue]) {
                                if (stTypeValue === 'Resident') {
                                    labelValueObj.label = stTypeValue;
                                    labelValueObj.value = stTypeValue;
                                    stateTypes.push(labelValueObj);
                                    stateTypesHash[stTypeValue] = stTypeValue;
                                    labelValueObj = {};
                                }
                            }
                        });
                    } else {

                        labelValueObj.label = stTypeValues[0];
                        labelValueObj.value = stTypeValues[0];
                        stateTypes.push(labelValueObj);
                        labelValueObj = {};
                    }
                });

                stateTypeLocalMemStore = new Memory({
                    data : stateTypes,
                    idProperty : "value"
                });
                array.forEach(stateTypeMemStore.data, function (stateType) {

                    var freeAttributeValue =  stateType.freeAttribute1;
                    if (freeAttributeValue !== null) {
                        labelValueObj.label = freeAttributeValue;
                        labelValueObj.value = freeAttributeValue;
                        residenceTypes.push(labelValueObj);
                        labelValueObj = {};
                    }

                });
                resdncTypeLocalMemStore = new Memory({
                    data : residenceTypes,
                    idProperty : "value"
                });
                
                array.forEach(secLvlCdMemStore.data, function (nppiPcci) {
                    var nppiValue, j, targetCode = nppiPcci.targetCode,
                        nppiPcciDesgnsArray = nppiPcci.targetShortDescription.split(" ");
                    if(nppiPcciDesgnsArray.length == 1 && nppiPcci.targetShortDescription === 'N/A') {
                        labelValueObj.label = nppiPcci.targetShortDescription;
                        labelValueObj.value = nppiPcci.targetShortDescription;
                        nppiPcciDesgns.push(labelValueObj);
                        labelValueObj = {};
                    } else if(arrLength == null) {
                        arrLength = nppiPcciDesgnsArray.length;
                        arrValue = nppiPcci.targetShortDescription;
                    } else if (arrLength < nppiPcciDesgnsArray.length) {
                        arrLength = nppiPcciDesgnsArray.length;
                        arrValue = nppiPcci.targetShortDescription;
                    }
                 });

                if(arrValue !== undefined) {
                    var nppiPcciDesgnsArray = arrValue.split(" "), nppiValue;
                    for (var j = 0; j < nppiPcciDesgnsArray.length; j++) {
                         nppiValue = nppiPcciDesgnsArray[j];
                         labelValueObj.label = nppiValue;
                         labelValueObj.value = nppiValue.charAt(0);
                         nppiPcciDesgns.push(labelValueObj);
                         labelValueObj = {};
                   }
                   nppiPciDesnMemStore.setData(nppiPcciDesgns);
                }

                //Default data
                formComp = dojo.byId("form_createOrViewMdfyForm");

                formNumComp = dijit.byId("formnum_createOrViewMdfyForm");
                componentArray.push(formNumComp);
                formRevComp = dijit.byId("revDate_createOrViewMdfyForm");
                componentArray.push(formRevComp);
                docDecComp = dijit.byId("formDesc_createOrViewMdfyForm");
                componentArray.push(docDecComp);

                classftnObj = dijit.byId("clasftn_createOrViewMdfyForm");
                classftnObj.set("searchAttr", "targetDescription");
                classftnObj.set("placeHolder", "--Select--");
                classftnObj.set("fetchProperties", sortObj);
                componentArray.push(classftnObj);

                subClassftnObj = dijit.byId("subClasftn_createOrViewMdfyForm");
                subClassftnObj.set("searchAttr", "targetDescription");
                subClassftnObj.set("placeHolder", "--Select--");
                subClassftnObj.set("fetchProperties", sortObj);
                componentArray.push(subClassftnObj);

                docFormTypeObj = dijit.byId("formType_createOrViewMdfyForm");
                docFormTypeObj.set("searchAttr", "targetDescription");
                docFormTypeObj.set("placeHolder", "--Select--");
                docFormTypeObj.set("fetchProperties", sortObj);
                componentArray.push(docFormTypeObj);

                ricTxtCompObj = dijit.byId("ric_createOrViewMdfyForm");

                docTitleComp = dijit.byId("formTitle_createOrViewMdfyForm");
                componentArray.push(docTitleComp);

                docUsageInuComp = dijit.byId("formUsageIns_createOrViewMdfyForm");
                componentArray.push(docUsageInuComp);

                stateObj = registry.byId("states_createOrViewMdfyForm");
                componentArray.push(stateObj);

                tmgReqObj = dijit.byId("tmgreq_createOrViewMdfyForm");
                tmgReqObj.set("searchAttr", "targetDescription");
                tmgReqObj.set("placeHolder", "--Select--");
                componentArray.push(tmgReqObj);


                tmgCdObj = registry.byId("tmgCd_createOrViewMdfyForm");
                tmgCdObj.set("labelAttr", "targetDescription");
                componentArray.push(tmgCdObj);

                distChnlObj = registry.byId("distChnl_createOrViewMdfyForm");
                distChnlObj.set("labelAttr", "targetDescription");
                componentArray.push(distChnlObj);

                returnHOYIndComp = dijit.byId("rtrnHOIndYes_createOrViewMdfyForm");
                componentArray.push(returnHOYIndComp);
                returnHONIndComp = dijit.byId("rtrnHOIndNo_createOrViewMdfyForm");
                componentArray.push(returnHONIndComp);

                stateTypeObj = dijit.byId("stType_createOrViewMdfyForm");
                stateTypeObj.set("searchAttr", "label");
                stateTypeObj.set("placeHolder", "--Select--");
                componentArray.push(stateTypeObj);

                resdncTypeObj = dijit.byId("resdncType_createOrViewMdfyForm");
                resdncTypeObj.set("searchAttr", "label");
                resdncTypeObj.set("placeHolder", "--Select--");
                componentArray.push(resdncTypeObj);

                transYIndComp = dijit.byId("transIndYes_createOrViewMdfyForm");
                componentArray.push(transYIndComp);
                transNIndComp = dijit.byId("transIndNo_createOrViewMdfyForm");
                componentArray.push(transNIndComp);

                formUseDtComp = dijit.byId("formUseDate_createOrViewMdfyForm");
                componentArray.push(formUseDtComp);
                stApprDtComp = dijit.byId("stApprDate_createOrViewMdfyForm");

                //Setting the state approval date which must be on or before the current date.
                stApprDtComp.constraints.max = new Date();
                componentArray.push(stApprDtComp);
                stEffDtComp = dijit.byId("stEffDate_createOrViewMdfyForm");
                componentArray.push(stEffDtComp);
                stExpDateComp = dijit.byId("stExpDate_createOrViewMdfyForm");
                componentArray.push(stExpDateComp);

                nppiPciDesnObj = registry.byId("nppiPciDesn_createOrViewMdfyForm");
                nppiPciDesnObj.set("labelAttr", "label");
                nppiPciDesnObj.set("sortByLabel", false);
                componentArray.push(nppiPciDesnObj);

                docCntTypeObj = dijit.byId("docContent_createOrViewMdfyForm");
                docCntTypeObj.set("searchAttr", "targetDescription");
                docCntTypeObj.set("placeHolder", "--Select--");
                componentArray.push(docCntTypeObj);

                pageCntComp = dijit.byId("noOfPages_createOrViewMdfyForm");
                componentArray.push(pageCntComp);

                logoYIndComp = dijit.byId("logoInd_Y_createOrViewMdfyForm");
                componentArray.push(logoYIndComp);
                logoNIndComp = dijit.byId("logoInd_N_createOrViewMdfyForm");
                componentArray.push(logoNIndComp);

                offSignYIndComp = dijit.byId("offSignInd_Y_createOrViewMdfyForm");
                componentArray.push(offSignYIndComp);
                offSignNIndComp = dijit.byId("offSignInd_N_createOrViewMdfyForm");
                componentArray.push(offSignNIndComp);

                lunarDocTpComp = dijit.byId("lunarDocType_createOrViewMdfyForm");
                componentArray.push(lunarDocTpComp);

                busFunObj = dijit.byId("busFun_createOrViewMdfyForm");
                busFunObj.set("searchAttr", "targetDescription");
                busFunObj.set("placeHolder", "--Select--");
                componentArray.push(busFunObj);

                lifeEffDtComp = dijit.byId("lifeEffDate_createOrViewMdfyForm");
                componentArray.push(lifeEffDtComp);

                lifeExpDtComp = dijit.byId("lifeExpDate_createOrViewMdfyForm");
                componentArray.push(lifeExpDtComp);

                promImplDtComp = dijit.byId("promImplDate_createOrViewMdfyForm");
                componentArray.push(promImplDtComp);

                docMakerImplDtComp = dijit.byId("docMakerImplDate_createOrViewMdfyForm");
                componentArray.push(docMakerImplDtComp);

                editProdBtn = dijit.byId("edit_product_btn_createOrViewMdfyForm");

                //These buttons should get disabled if user is not authorized.
                clone_form_btn = dijit.byId("btnClone_createOrViewMdfyForm");
                componentArray.push(clone_form_btn);

                extract_st_form_btn = dijit.byId("btnExtractSt_createOrViewMdfyForm");
                componentArray.push(extract_st_form_btn);

                associtate_to_pack_form_btn = dijit.byId("btnAssToPkg_createOrViewMdfyForm");
                componentArray.push(associtate_to_pack_form_btn);

                promotion_form_btn = dijit.byId("btnPromotion_createOrViewMdfyForm");
                componentArray.push(promotion_form_btn);

                save_form_btn = dijit.byId("btnSave_createOrViewMdfyForm");
                componentArray.push(save_form_btn);

                exStateDialogCM = registry.byId("exStsCMSelect_createOrViewMdfyForm");
                inStateDialogCM = registry.byId("inStCMSelect_createOrViewMdfyForm");

                avaliableStateDialogCM = registry.byId("inStCMSelect_ViewMdfyForm");


                editStBtn = dijit.byId("editStsBtn_createOrViewMdfyForm");
                includeStBtn = dijit.byId("btnIn_editSt_createOrViewMdfyForm");
                excludeStBtn = dijit.byId("btnEx_editSt_createOrViewMdfyForm");
                removeStBtn = dijit.byId("removeStates_ViewMdfyForm");
                saveExtractBtn=dijit.byId("saveStates_ViewMdfyForm");
				cancelExtractBtn=dijit.byId("cancelStates_ViewMdfyForm");
                includeAllStsBtn = dijit.byId("btnInAll_editSt_createOrViewMdfyForm");
                excludeAllStsBtn = dijit.byId("btnExAll_editSt_createOrViewMdfyForm");
                acceptStsBtn = dijit.byId("acceptStates_createOrViewMdfyForm");
                //resetRemovedStsBtn = dijit.byId("resetRemovedStsBtn_createOrViewMdfyForm");
                historyBtn = dijit.byId("btnHistory_createOrViewMdfyForm");
                commentsBtn = dijit.byId("btnComments_createOrViewMdfyForm");
                formCancelBtn = dijit.byId("btnCancel_createOrViewMdfyForm");
                templatesBtn = dijit.byId("btnTemplates_createOrViewMdfyForm");
                //templatesBtn = dijit.byId("btnTemplates_createOrViewMdfyForm");



                //displayErrorDiv = dom.byId("displayErrorMsg_createOrViewMdfyForm");
                //displayInfoDiv = dom.byId("displayInfoMsg_createOrViewMdfyForm");
                //displayWarnDiv = dom.byId("displayWarnMsg_createOrViewMdfyForm");
				displayNameComp = dom.byId("displayName_createOrViewMdfyForm");

                //Setting all store data to the components
                classftnObj.store = clasftnMemStore;
                subClassftnObj.store = subClassMemStore;
                docFormTypeObj.store = docFormTpMemStore;
                tmgReqObj.store = timingReqMemStore;
                tmgCdObj.setStore(timingCdMemStore);
                distChnlObj.setStore(distChanMemStore);
                nppiPciDesnObj.setStore(nppiPciDesnMemStore);
                docCntTypeObj.store = docContentTypeMemStore;
                busFunObj.store = businessFunMemStore;
                stateTypeObj.store = stateTypeLocalMemStore;
                resdncTypeObj.store = resdncTypeLocalMemStore;
                inStateDialogCM.setStore(emptyStore);

                //Viewing states event
                on(editStBtn, "click", function () {
                    var componentArray = [], statesTobeRemoved = [], stateLocalData = [], stateStoreTempData,
                        stateLocalDataMemStore, selOptions, statesTobeIncluded = [], includeStStore;
                    //Retrive all values from the form
                    exStateDialogCM.set("labelAttr", "label");
                    componentArray.push(exStateDialogCM);
                    componentArray.push(dijit.byId("btnIn_editSt_createOrViewMdfyForm"));
                    componentArray.push(dijit.byId("btnEx_editSt_createOrViewMdfyForm"));
                    componentArray.push(dijit.byId("btnInAll_editSt_createOrViewMdfyForm"));
                    componentArray.push(dijit.byId("btnExAll_editSt_createOrViewMdfyForm"));
                    componentArray.push(inStateDialogCM);
                    componentArray.push(dijit.byId("acceptStates_createOrViewMdfyForm"));
                    //componentArray.push(resetRemovedStsBtn);
                    //currentUserMemStore = data.currentUserMemStore;
                    //hasUserFormRWAccess = currentUserMemStore.data.formsWriteIndicator === "1";
                    if (!hasUserFormRWAccess) {
                        array.forEach(componentArray, function (component) {
                            component.set("disabled", true);
                        });
                    }
                    stateStoreTempData = JSON.parse(JSON.stringify(stateMemStore.data));
                    array.forEach(stateStoreTempData, function (data) {
                        labelValueObj.value = data.targetCode;
                        labelValueObj.label = data.targetDescription;
                        stateLocalData.push(labelValueObj);
                        labelValueObj = {};
                    });
                    stateLocalDataMemStore = new Memory({
                        data: stateLocalData,
                        idProperty: "value"
                    });
                    //inStateDialogCM = registry.byId("inStCMSelect_createOrViewMdfyForm");
                    if (optionType === "FORM_CREATE" && inStateDialogCM) {
                    	selectedSts = [];
                        /* selOptions = inStateDialogCM.getOptions();
                        array.forEach(selOptions, function (selOption) {
                            stateLocalDataMemStore.remove(selOption.value);
                        });
                        exStateDialogCM.setStore(stateLocalDataMemStore); */
                        exStateDialogCM.setStore(stateLocalDataMemStore);
                        inStateDialogCM.setStore(emptyStore);
                    } else if (optionType === "FORM_VIEW_OR_EDIT" || previousStateCds.length > 0) {
                        array.forEach(previousStateCds, function (stateCd) {
                            stateLocalDataMemStore.remove(stateCd);
                        });
                        exStateDialogCM.setStore(stateLocalDataMemStore);
                        array.forEach(previousStateCds, function (stateCd) {
                            var stObjArray = stateMemStore.query({'targetCode': stateCd});
                            labelValueObj.value = stObjArray[0].targetCode;
                            labelValueObj.label = stObjArray[0].targetDescription;
                            statesTobeIncluded.push(labelValueObj);
                            labelValueObj = {};
                        });
                        includeStStore = new Memory({data: statesTobeIncluded, idProperty: "value"});
                        inStateDialogCM.set("labelAttr", "label");
                        inStateDialogCM.setStore(includeStStore);
                    }
                    dijit.byId("formNum_stateAddOrRemoveDialog").set('value', formNumComp.get('value'));
                    dijit.byId("revDate_stateAddOrRemoveDialog").set('value', formRevComp.get('value'));
                    dijit.byId("formDesc_stateAddOrRemoveDialog").set('value', docDecComp.get('value'));
                    registry.byId("stateDialogId_createOrViewMdfyForm").show();
                });
                //Extract States
                on(extract_st_form_btn, "click", function () {

                     var  statesTobeIncluded = [], includeStStore;

                    dijit.byId("formNum_extractStateRemoveDialog").set('value', formNumComp.get('value'));
                    dijit.byId("revDate_extractStateRemoveDialog").set('value', formRevComp.get('value'));
                    dijit.byId("formDesc_extractStateRemoveDialog").set('value', docDecComp.get('value'));

                    if (optionType === "FORM_VIEW_OR_EDIT" || selectedSts.length > 0) {

                      if(expirationDtSetSts.length > 0){

                        array.forEach(selectedSts, function (stateCd) {
                            if(!isRemovedStateCode(stateCd)){
                                var stObjArray = stateMemStore.query({'targetCode': stateCd});
                                labelValueObj.value = stObjArray[0].targetCode;
                                labelValueObj.label = stObjArray[0].targetDescription;
                                statesTobeIncluded.push(labelValueObj);
                                labelValueObj = {};
                            }
                        });
					    dojo.style(dojo.byId('dateSetGridForRemovedItems_ViewMdfyForm'), "display", "block");
					    dojo.style(dojo.byId('buttonPanel'), "display", "block");
                    } else{
                        array.forEach(selectedSts, function (stateCd) {
                            var stObjArray = stateMemStore.query({'targetCode': stateCd});
                            labelValueObj.value = stObjArray[0].targetCode;
                            labelValueObj.label = stObjArray[0].targetDescription;
                            statesTobeIncluded.push(labelValueObj);
                            labelValueObj = {};
                        });
                        dojo.style(dojo.byId('dateSetGridForRemovedItems_ViewMdfyForm'), "display", "none");
                        dojo.style(dojo.byId('buttonPanel'), "display", "none");
                    }
                        includeStStore = new Memory({data: statesTobeIncluded, idProperty: "value"});
                        avaliableStateDialogCM.set("labelAttr", "label");
                        avaliableStateDialogCM.setStore(includeStStore);
                    }
                    registry.byId("extractStateDialog_ViewMdfyForm").show();
                    /*if(expirationDtSetSts.length>0){
                        expirationDtSetSts.splice(0,expirationDtSetSts.length);
                    }*/
				});
				function isRemovedStateCode(stateCode){
							var flag=false;
							array.forEach(expirationDtSetSts, function (stateObject){
								if(stateObject.value == stateCode ){
									flag=true;
								}
							});
						return flag;
				};
			
				function formatDate(datum,rowIdx, cell){
					console.debug("column name ::"+cell.name);
					if(datum!=""){
					var d = dojo.date.stamp.fromISOString(datum);
							cell.name='Expiry Date';
							cell.view.update();
						return dojo.date.locale.format(d, {selector: 'date', formatLength: 'long'});
					}else{
						cell.name='<font color="red">Expiry Date</font>';
						cell.view.update();
					return  datum;

					}
				};
				function getDateValue(){
							return dojo.date.stamp.toISOString(this.widget.get('value'));
				};

				var expDtSetlayout = [
					{
						field: 'label',
						name: 'State Name',
						width : '50%'
					},
					{
						field: 'expirationDate',
						name: 'Expiry Date',
						formatter: formatDate,
						type: dojox.grid.cells.DateTextBox,
						getValue: getDateValue,
						constraint: {formatLength: 'long',min: new Date()}, 
						editable: true,
						width : '50%'
					}
				];


                on(removeStBtn, "click", function () {
                    var avaliableStates= avaliableStateDialogCM.getOptions(),expDtSetStsObjStore;
                    dojo.style(dojo.byId('dateSetGridForRemovedItems_ViewMdfyForm'), "display", "block");
                    dojo.style(dojo.byId('buttonPanel'), "display", "block");
                    if(avaliableStates.length > 0) {
                        selectedSts = [];
                        array.forEach(avaliableStates, function (option) {
                            if (option.selected) {
                                option.selected = false;
                                avaliableStateDialogCM.removeOption(option);
                                option.expirationDate = '';
                                expirationDtSetSts.push(option);
                            }
                        });
                    }
                    if (expirationDtSetSts.length > 0) {
                        expDtSetStsObjStore = new ObjectStore({
                            objectStore : new Memory({
                                data : expirationDtSetSts,
                                idProperty : 'value'
                            })
                        });

                        if(dijit.byId("statesGrid")!=null){
                            dijit.byId('statesGrid').destroy();
                        }
                        var grid = new dojox.grid.EnhancedGrid({
                            id: 'statesGrid',
                            store: expDtSetStsObjStore,
                            structure: expDtSetlayout,
                            autoHeight: true,
                          });
                        grid.placeAt("dateSetGridForRemovedItems_ViewMdfyForm");
                        grid.startup();

                    }
                });

				on(cancelExtractBtn, "click", function () {
					expirationDtSetSts = [];
					remStatesWithExpDates = [];
					registry.byId("extractStateDialog_ViewMdfyForm").hide();
				});
                on(saveExtractBtn, "click", function () {
                    var inCMOptions, selectedStateStr = '', hideWindow = false,
						inCMOptions =  avaliableStateDialogCM.getOptions(), localStateCdsHash = {},
						remStateObj, stateCode, stateExpiryDate, statesGrid;
                    if(remStatesWithExpDates.length>0){
                        remStatesWithExpDates.splice(0,remStatesWithExpDates.length);
                    }
                    if(inCMOptions.length > 0) {
						selectedSts = [];
						array.forEach(inCMOptions, function (option) {
                            var obj, stShrtDesc = "";
                            obj = stateMemStore.query({"targetCode": option.value});
                            stShrtDesc = obj[0].targetShortDescription;
                            selectedStateStr += stShrtDesc + ',';
                            if (!localStateCdsHash[option.value]) {
                                selectedSts.push(option.value);
                                localStateCdsHash[option.value] = option.value;
                            }
                        });
                    }
                    dojo.byId("states_createOrViewMdfyForm").value = selectedStateStr.slice(0, (selectedStateStr.length - 1));
					statesGrid = dijit.byId("statesGrid");
					for (var i=0; i < statesGrid.rowCount; i++) {
						remStateObj = {};
						stateCode = statesGrid.store.getValues(statesGrid.getItem(i), "value");
						stateExpiryDate=statesGrid.store.getValues(statesGrid.getItem(i), "expirationDate");
						console.debug("stateCode: " + stateCode[0] + ", stateExpiryDate: " + stateExpiryDate[0]);

						if (stateExpiryDate[0]) {
							hideWindow=true;
							remStateObj.stCd = stateCode;
							remStateObj.lifeExprtnDt = stateExpiryDate;
							remStatesWithExpDates.push(remStateObj);
							save_form_btn.set("disabled", false);
							clone_form_btn.set("disabled", true);
						} else {
							hideWindow=false;
							break;
						}
					}
					if (hideWindow){
						registry.byId("extractStateDialog_ViewMdfyForm").hide();
					}
                });
                // Include States
                on(includeStBtn, "click", function () {
                    //Retrive all values from the form
                    var excludeCMOptions =  exStateDialogCM.getOptions(), options = [];
                    array.forEach(excludeCMOptions, function (option) {
                        if (option.selected) {
                            option.selected = false;
                            options.push(option);
                            exStateDialogCM.removeOption(option);
                            save_form_btn.set("disabled", false);
                        }
                    });
                    inStateDialogCM.addOption(options);
                    //End
                });
                //Exclude States
                on(excludeStBtn, "click", function () {
                    //Retrive all values from the form
                    //domStyle.set(dom.byId("dateSetGridForRemovedItems_ViewMdfyForm").domNode, 'visibility', 'visible');
					dojo.style(dojo.byId('dateSetGridForRemovedItems_ViewMdfyForm'), "visibility", "visible");
                    var stateLocalData = [], inCMOptions =  inStateDialogCM.getOptions(),
                        statesToBeExcluded = [], stateLocalDataMemStore, expirationDtSetSts = [],
                        expirationDate = {}, expDtSetStsObjStore, expDtSetlayout, expDateSetGrid;
                    array.forEach(stateMemStore.data, function (data) {
                        labelValueObj.value = data.targetCode;
                        labelValueObj.label = data.targetDescription;
                        stateLocalData.push(labelValueObj);
                        labelValueObj = {};
                    });
                    stateLocalDataMemStore = new Memory({
                        data: stateLocalData,
                        idProperty: "value"
                    });
                    if(inCMOptions.length > 0) {
                        //selectedSts = [];
						
                        array.forEach(inCMOptions, function (option) {
                            if (option.selected) {
								array.forEach(selectedSts, function (cd, i) {
									if(cd === option.value) selectedSts.splice(i, 1);
								});
                                option.selected = false;
                                inStateDialogCM.removeOption(option);
                                option.expirationDate = '';
                                expirationDtSetSts.push(option);
                                save_form_btn.set("disabled", false);
                            } else {
                                stateLocalDataMemStore.remove(option.value);
                            }
                        });
                    }
                    exStateDialogCM.set("labelAttr", "label");
                    exStateDialogCM.setStore(stateLocalDataMemStore);

                    console.debug('States to be removed is-->', expirationDtSetSts);
                    
                });
                
                //Include all
                on(includeAllStsBtn, "click", function () {

                    inStateDialogCM.set('labelAttr', 'targetDescription');
                    inStateDialogCM.setStore(stateMemStore);
                    exStateDialogCM.setStore(emptyStore);

                });
                //Exclude all
                on(excludeAllStsBtn, "click", function () {

                    exStateDialogCM.set('labelAttr', 'targetDescription');
                    exStateDialogCM.setStore(stateMemStore);
                    inStateDialogCM.setStore(emptyStore);

                });
                //Accept Selected States
                on(acceptStsBtn, "click", function () {
                    //Retrive all values from the form
                    var inCMOptions, selectedStateStr = '';
                    inCMOptions =  inStateDialogCM.getOptions();
                    if(inCMOptions.length > 0) {
						grpdStateCdsHash = {};
                        array.forEach(inCMOptions, function (option) {
                            var obj, stShrtDesc = "";
                            obj = stateMemStore.query({"targetCode": option.value});
                            stShrtDesc = obj[0].targetShortDescription;
                            selectedStateStr += stShrtDesc + ',';
							if (!grpdStateCdsHash[option.value]) {
                                selectedSts.push(option.value);
                                grpdStateCdsHash[option.value] = option.value;
                            }
                        });
                    }
                    dojo.byId("states_createOrViewMdfyForm").value = selectedStateStr
                            .slice(0, (selectedStateStr.length - 1));

                    if (isFormReadyForPromote && selectedSts.length > 0) {
                        stateTypeObj.set("disabled", false);
                        stateTypeObj.set("required", true);
                        stateTypeObj.focus();
                        stateTypeObj.set('missingMessage', 'State type should not be empty');
                        domStyle.set(dojo.query("label[for=stType_createOrViewMdfyForm]")[0],
                                errorStyleClass);
                    }

                    if (selectedSts.length > 0 || previousStateCds.length > 0){
                        selectedSts.sort();
                        if(!selectedSts.equals(previousStateCds)){
                            domAttr.remove(query("label[for=states_createOrViewMdfyForm]")[0], "style");
                            stateTypeObj.set("disabled", false);
                            save_form_btn.set("disabled", false);
                            clone_form_btn.set("disabled", true);
                        }
                    } else if(isFormReadyForPromote){
                    	 domStyle.set(query("label[for=states_createOrViewMdfyForm]")[0], errorStyleClass);
                    }
                    /*if (selectedSts.length > 0) {
                        domAttr.remove(query("label[for=states_createOrViewMdfyForm]")[0], "style");
                        stateTypeObj.set("disabled", false);
                        save_form_btn.set("disabled", false);
                    }*/
                    registry.byId("stateDialogId_createOrViewMdfyForm").hide();
                    //End
                });
                //Save event
                on(save_form_btn, "click", lang.hitch(this, function (event) {
                    var createFormRequest = {}, formsTobeCrtd = [], formsTobeUpdtd = [], formsInputDetails,
                        removedStCds = [], removedProdCds = [], removedDistChanCds = [], addedStCds = [],
                        addedProdCds = [], addedDistChanCds = [], distChannels = [],
                        tempFormsInputDetails, orgnlDocId, jsonString, formCommentReq = {}, areCommentsPresent,
                        cmntTxt = {}, formIds = {}, responseDeferred = {}, displayMsg = {}, cmntCreateRes = {}, key = {},
                        totalStates = [], totalProducts = [], totalChannels = [], params = {}, type = {},
                        transOpts, path = {}, cmmnAttrChange = null, groupedFormStPrChMapStore, finalUpdateFormRequest;

                    //displayErrorDiv.innerHTML = "";
                    //displayInfoDiv.innerHTML = "";
					
                    Notice.loading();
                    try {
                        formsInputDetails = createOrUpdateFormDtlsRequest(optionType, isFormReadyForPromote);
                    } catch (error) {
                        Notice.doneLoading();
						classftnObj.set("required", false);
						subClassftnObj.set("required", false);
						docFormTypeObj.set("required", false);
						distChnlObj.reset();
						nppiPciDesnObj.reset();
						tmgCdObj.reset();
						var confDialog = Notice.showDialog({text:MINIMUM_DATA_REQUIRED, 
							type: "error", cancelBtnText: "Discard", style: "width:auto; height:auto"});
							confDialog.on("execute", function (dialogEvent) { 
								var transOpts = {
									target : "formsCreate",
									params : null
								};
								localApp.transitionToView(event.target, transOpts);
						});
						return false;
                    }
                    //Invoking the modal to get the final update request.
                    console.debug('Trying to create or update the request...');
                    selectedSts = selectedSts.sort();
					console.debug('SelectedSts are -->', selectedSts);
                    selectedProdCds = selectedProdCds.sort();
                    selectedChannels = selectedChannels.sort();
					isInit = false;
                    groupedFormStPrChMapStore = new Memory({data: groupedFormStPrChMapObj, idProperty: "id"});
					console.debug('expirationDtSetSts-->', expirationDtSetSts);
					finalUpdateFormRequest = formCreateOrModifyModal.getFormRequest(groupedFormStPrChMapStore, formsInputDetails, previousStateCds,
                        selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
                        optionType, true, expirationDtSetSts);

                    console.debug("Final UpdateFormRequest :: ", finalUpdateFormRequest);
                    console.debug("-----------------------------------------------------");
                    console.debug('CREATE OR UPDATE REQUEST URL::', jsonRestEndPoint.target);
//                    var requestUrl = JSON.parse(JSON.stringify(jsonRestEndPoint.target));
					//console.debug('Create/Update form request URL:', requestUrl);
					var targetForPostOrPut = jsonRestEndPoint.target;
					Function._setJsonRestEndpointTable(jsonRestEndPoint);
					responseDeferred = jsonRestEndPoint.put(finalUpdateFormRequest, {});
					var successOrFailureResObj = {}, key = {}, displayMsg = "", cmntCreateRes = {};
                    all ({responseDeferred : responseDeferred}).then(function(results) {
                        var groupedFormIds = [], target,
                            jsonString, jsonObj, commentResponse, xhrCommentInput, jsonRequest, response,
                            formIds = {}, createdFormListObj = null, formIdsStr = "",
                            updatedFormRes = null, transOpts, createdFormRes = {}, olformNum = {},
                            olRevDate = {}, olLifeEffDt = {},olLifeExpDt = {}, isUpdate = false, isCreate = false,
							targetForPostOrPut, deferredCmntRes, removedFormsRes;
						console.debug('Successfull create or update response.', results.responseDeferred);
						if (!(results.responseDeferred.frmsSrvcStatusCd === "VALIDATION_EXCEPTION")) {
							createdFormRes = results.responseDeferred.createdFormsRes;
							if(createdFormRes){
								isCreate = true;
								var overlapForms = createdFormRes.overlappedForms;
								if(overlapForms) {
									Notice.doneLoading();
									processOverlappedForms(jsonRestEndPoint, overlapForms, finalUpdateFormRequest, SM_USER,
										optionType, SUCCESS_FORM_DTLS_CRT, event);
								} else {
									if(createdFormRes.formIds) {
										array.forEach(createdFormRes.formIds, function (formId) {
												groupedFormIds.push(formId);
												formIdsStr = formIdsStr + formId + ',';
										});
										formIdsStr = formIdsStr.substring(0, formIdsStr.length - 1);
										//domClass.add(displayInfoDiv, 'info');
										//displayInfoDiv.innerHTML = 'Successful Creation. Created Form Ids are ::' + formIdsStr;
										displayMsg = displayMsg + SUCCESS_FORM_DTLS_CRT;
										console.debug(SUCCESS_FORM_DTLS_CRT);
									}
								}
							}
							updatedFormRes = results.responseDeferred.updatedFormsRes;
							if(updatedFormRes) {
								isUpdate = true;
								var overlapForms = updatedFormRes.overlappedForms;
								if(overlapForms) {
									
									processOverlappedForms(jsonRestEndPoint,
										overlapForms, finalUpdateFormRequest, SM_USER, optionType, SUCCESSFUL_FORM_UPDT, event) ;
								} else {
									if(updatedFormRes.formIds) {
										array.forEach(updatedFormRes.formIds, function (formId, i) {
											groupedFormIds.push(formId);
											formIdsStr = formIdsStr + formId + ',';
										});
										displayMsg = displayMsg + SUCCESSFUL_FORM_UPDT;
										console.debug(SUCCESSFUL_FORM_UPDT);
									}
								}
								
							}
							removedFormsRes = results.responseDeferred.removedFormsRes;
							if(removedFormsRes && removedFormsRes.frmsSrvcStatusCd) {
								Notice.doneLoading();
								displayMsg = removedFormsRes.statusDetailMsg;
								console.debug('Trying to redirecting to the search screen.');
								params.type = optionType;
								params.displayMsg = displayMsg;
								//params.cmntCreateRes = response.cmntCreateRes;
								params.path = fromCrtOrUpdFormToSearch;
								transOpts = {
									target : "formsSearch",
									data : params
								};
								//Notice.doneLoading();
								console.debug('Trying to redirecting to the search screen is almost done..');
								localApp.transitionToView(event.target, transOpts);
							}
							if (groupedFormIds.length > 0) {
								if (createCmntReq && createCmntReq.comments) {
									console.debug('Created comment request is-->', createCmntReq);
									console.debug("Trying to save the form comments...");
									
									createCmntReq.docIds = groupedFormIds;
									console.debug('FORM COMEMNT REQUEST URL::', jsonRestEndPoint.target + "/" + groupedFormIds[0] + "/comments");
									//requestUrl = requestUrl + "/" + groupedFormIds[0] + "/comments"
									//var deferredCmntRes = Function.postXhrRequest (requestUrl, createCmntReq, SM_USER) ;
									targetForPostOrPut = jsonRestEndPoint.target;
									Function._setJsonRestEndpointTable(jsonRestEndPoint);
									jsonRestEndPoint.target = jsonRestEndPoint.target + "/" + groupedFormIds[0] + "/comments";
									deferredCmntRes = jsonRestEndPoint.put(createCmntReq, {});
									//var deferred = saveFormCommentsService(jsonRestEndPoint, groupedFormIds[0], createCmntReq);
									all({deferredCmntRes : deferredCmntRes}).then(function (results) {
										if (deferredCmntRes.isResolved()) {
											deferredCmntRes.then(function (results) {
												console.info('Successful in saving the comments.');
												console.debug(SUCCESS_FORM_CMNT_SAVE);
												cmntCreateRes = SUCCESS_FORM_CMNT_SAVE;

											}, function (err) {
												console.error('Exception occured while saving the comments.');
												console.debug(EXCEPTION_IN_CMNT_SAVE);
												cmntCreateRes = EXCEPTION_IN_CMNT_SAVE;
											});
										}
									});
									jsonRestEndPoint.target = targetForPostOrPut;
								} else {
									cmntCreateRes = NO_CMNTS_CRTD;
									console.debug(NO_CMNTS_CRTD);
								}
								console.debug('Trying to redirecting to the search screen.');
								params.type = optionType;
								params.displayMsg = displayMsg;
								//params.cmntCreateRes = response.cmntCreateRes;
								params.path = fromCrtOrUpdFormToSearch;
								transOpts = {
									target : "formsSearch",
									data : params
								};
								//Notice.doneLoading();
								console.debug('Trying to redirecting to the search screen is almost done..');
								localApp.transitionToView(event.target, transOpts);
							} else {
								console.debug("There are no grouped forms.");
							}
							
							
						} else {
							//domClass.add(displayErrorDiv, 'error');
							//displayErrorDiv.innerHTML = REQUIRED_FIELDS_MISSING;
							Notice.showError(REQUIRED_FIELDS_MISSING);
						}
						
                    }, function (error) {
						Notice.doneLoading();
                        var errorMsg, commonErrMsg = EXCEPTION_IN_FORM_DTLS_CRT + CONTACT_SYS_ADMIN;
                        console.debug('status-->', error.status);
                        switch (error.status) {
						case 403:
                            //domClass.add(displayErrorDiv, 'error');
                            if(error.responseText) {
                                errorMsg = JSON.parse(error.responseText).statusDetailMsg;
                            }
                            if (optionType === FORM_CREATE) {
								Notice.showError(EXCEPTION_IN_FORM_DTLS_CRT + errorMsg);
                                //displayErrorDiv.innerHTML = EXCEPTION_IN_FORM_DTLS_CRT + errorMsg;
                            } else {
								Notice.showError(EXCEPTION_IN_FORM_UPDT + errorMsg);
                                //displayErrorDiv.innerHTML = EXCEPTION_IN_FORM_UPDT + errorMsg;
							}
                            break;
						case 409:
							if(error.responseText) {
                                errorMsg = JSON.parse(error.responseText).statusDetailMsg;
								//alert(errorMsg);
								var confDialog = Notice.showDialog({text:errorMsg, type: "error", 
									cancelBtnText: DISMISS});
								confDialog.on("execute", function (dialogEvent) {
									var transOpts = {
										target : "formsCreate",
										params : null
									};
									localApp.transitionToView(event.target, transOpts);
									
								});
							}
                            //displayErrorDiv.innerHTML = errorMsg;
                            break;
                        case 415:
							if(error.responseText) {
                                errorMsg = JSON.parse(error.responseText).statusDetailMsg;
                            }
                            //domClass.add(displayErrorDiv, 'error');
                            if (optionType === FORM_CREATE) {
								Notice.showError(EXCEPTION_IN_FORM_DTLS_CRT + errorMsg);
                                //displayErrorDiv.innerHTML = EXCEPTION_IN_FORM_DTLS_CRT + errorMsg;
                            } else {
								Notice.showError(EXCEPTION_IN_FORM_UPDT + errorMsg);
                                //displayErrorDiv.innerHTML = EXCEPTION_IN_FORM_UPDT + errorMsg;
                            }
                            break;
                        /*case 409:
                            //domClass.add(displayErrorDiv, 'error');
                            errorMsg = JSON.parse(error.responseText).statusDetailMsg;
                            //displayErrorDiv.innerHTML = errorMsg;
							Notice.showError(errorMsg);
                            break;*/
                        case 404:
                        case 500:
                            //domClass.add(displayErrorDiv, 'error');
                            if (optionType === FORM_CREATE) {
                                //displayErrorDiv.innerHTML = commonErrMsg;
								displayMsg = EXCEPTION_IN_FORM_DTLS_CRT ;
								
                            } else {
                                //displayErrorDiv.innerHTML = commonErrMsg;
								Notice.showError(commonErrMsg);
                            }
                            break;
                        default:
                            //domClass.add(displayErrorDiv, 'error');
							Notice.showError(commonErrMsg);
                            //displayErrorDiv.innerHTML = commonErrMsg;
                            break;
                        }
                        
                    });
					jsonRestEndPoint.target  = targetForPostOrPut;
                }));
                //Edit Product button event
                on(editProdBtn, "click", lang.hitch(this, function (e) {
                    var params = {}, type = {}, transOpts, 
                        formNum , docDesc, formRvnDt;
                    params.previousProductCds = previousProductCds;
                    params.type = optionType;
					Notice.loading();
					
                    if(optionType == FORM_CREATE) {
                    	selectedProdCds = [];
                        params.formNum = formNumComp.get('value');;
                        params.docDesc = formRevComp.get('value');
                        params.formRvnDt = docDecComp.get('value');

                    } else {

                        params.formNum = recivedForm.formNum;
                        params.docDesc = recivedForm.docDesc;
                        params.formRvnDt = recivedForm.formRvnDt;
                    }
                    params.isFormCloned = isFormCloned;
                    transOpts = {
                        target : "products",
                        data : params
                    };
                    localApp.transitionToView(e.target, transOpts);
                }));
                //Button history event
                on(historyBtn, "click", lang.hitch(this, function (e) {

                    var data = {}, formNum = {}, createdBy = {}, createDate = {},
                        transOpts = null;
					Notice.loading();
                    if (groupedFormStore) {
                        //formId = formdata.id;
                        console.debug('form id in form create method is-->', formId);
                        //selectedFormObj = (groupedFormStore.query({"id": formId}))[0];
                        if (recivedForm) {
                            data.formId = recivedForm.id;
                            data.formNum = recivedForm.formNum;
                            data.createdBy = recivedForm.crtdByUsrId;
                            data.createDate = recivedForm.crtdDtTm;
                            data.optionType = optionType;
                            transOpts = {
                                target : "formHistory",
                                data : data
                            };
                            setTimeout(function () {
                                localApp.transitionToView(e.target, transOpts);
                            }, 500);
                        }
                    }

                }));
                //form comments
                on(commentsBtn, "click", lang.hitch(this, function (e) {
                    console.debug('moving to form comments section..');
                    console.debug('groupedFormIds are..', groupedFormIds);
                    var params = {}, type = {}, transOpts;
                    console.debug('form comments optionType-->', optionType);
                    console.debug('form comments formid is -->', formId);
					Notice.loading();
                    if (isFormCloned) {
                        optionType = FORM_CREATE;
                    }
                    if (optionType === FORM_CREATE) {
                        params.formNum = formNumComp.get('value');
                        params.formRvnDt = formRevComp.get('value');
                        params.docDesc = docDecComp.get('value');
                        params.optionType = optionType;
                        transOpts = {};
                        transOpts = {
                            target : "formComments",
                            data : params
                        };
                        localApp.transitionToView(e.target, transOpts);
                        params = {};
                    } else if (optionType === FORM_VIEW_OR_EDIT) {
                        //selectedFormObj = (groupedFormStore.query({"id": formId}))[0];
                        if (recivedForm) {
                            params.formId = recivedForm.id;
                            params.groupedFormIds = groupedFormIds;
                            params.formNum = recivedForm.formNum;
                            params.docDesc = recivedForm.docDesc;
                            params.formRvnDt = recivedForm.formRvnDt;
                            params.optionType = optionType;
                            transOpts = {};
                            transOpts = {
                                target : "formComments",
                                data : params
                            };
                            localApp.transitionToView(e.target, transOpts);
                            params = {};
                        }
                    }
                }));
                //Cloning event
                on(clone_form_btn, "click", lang.hitch(this, function (e) {
					
					var confDialog = Notice.showConfirmDialog({text:"Do you want to clone the form ?", type: "warning",
						okBtnText:"Ok"});
					confDialog.on("execute", function (dialogEvent) {
						if (recivedForm) {
							console.debug('Cloning the form details....');
							populateFormWithDetails(recivedForm);
							isFormCloned = true;
							console.debug('Cloning the form details is done.');
							domStyle.set(registry.byId("btnHistory_createOrViewMdfyForm").domNode, 'display', 'none');
							domStyle.set(extract_st_form_btn.domNode, 'display', 'none');
							domStyle.set(templatesBtn.domNode, 'display', 'none');
							domStyle.set(associtate_to_pack_form_btn.domNode, 'display', 'none');
							domStyle.set(registry.byId("btnFormModData_createOrViewMdfyForm").domNode, 'display', 'none');
							formNumComp.set('disabled', false);
							save_form_btn.set("disabled", false);
							clone_form_btn.set("disabled", true);
							ricTxtCompObj.set("value", '');
							optionType = FORM_CREATE;
							createCmntReq = {};

						} else {
							console.debug('Error while cloning the form details.');
						}
					});
					
                }));
                //Cancel button navigation
                on(formCancelBtn, "click", function (e) {
					if (commonFormAttrChangedFlag) {
                        var confDialog = Notice.showConfirmDialog({text:ALERT_FOR_UNSAVED_CHANGES, type: "warning"});
                        confDialog.on("execute", function (dialogEvent) {
							self.transitionTo(e, "formsSearch", {});
                        });
                    } else {
						self.transitionTo(e, "formsSearch", {});
					}
                });
                // Event for promotion validation check
                on(promotion_form_btn, "change", function (isChecked) {
                	isFormPromoted = isChecked;
                    validateForPromote(isChecked);
                });
                //Templates event
                on(templatesBtn, "click", lang.hitch(this, function (e) {
                    console.debug('Trying to associate templates section..');
                    var data = {}, formNum = {}, createdBy = {}, createDate = {},
                        transOpts = null, revDate = null, formDesc = null, recIndxNum = {};
                    if (recivedForm) {
                        data.optionType = optionType;
                        data.formId = recivedForm.id;
                        data.formNum = recivedForm.formNum;
                        data.revDate = recivedForm.formRvnDt;
                        data.formDesc = recivedForm.formDesc;
                        data.recIndxNum = recivedForm.recIdxNum;

                        transOpts = {
                            target : "formTemplates",
                            data : data
                        };
                        localApp.transitionToView(e.target, transOpts);
                    }

                }));
                //Associate to package event
                on(associtate_to_pack_form_btn, "click", lang.hitch(this, function (e) {
                    console.debug('Trying to associate the given form to packages ');
                    var data = {}, formNum = {}, createdBy = {}, createDate = {},
                        transOpts = null, revDate = null, formDesc = null, orgnlDocId = {},
                        formLifeEffDt = {}, formLifeExpDt, groupedFormIds;
                    if (recivedForm) {
                        data.optionType = optionType;
                        //data.formId = recivedForm.id;
                        idAndOrgnlMapArray.sort(function(a, b){return  (parseInt(a.id) - parseInt(b.id)).toString()});
                        console.debug('idAndOrgnlMapArray-->', idAndOrgnlMapArray);
                        data.idAndOrgnlMapArray = idAndOrgnlMapArray;
                        data.formOrgnlDocId = recivedForm.orgnlDocId;
                        data.formLifeEffDt = recivedForm.lifeEffDt;
                        console.debug('recivedForm.lifeEffDt-->', recivedForm.lifeEffDt);
                        data.formLifeExpDt = recivedForm.lifeExprtnDt;
                        data.formNum = recivedForm.formNum;
                        data.revDate = recivedForm.formRvnDt;
                        data.formDesc = recivedForm.formDesc;
                        transOpts = {
                            target : "formAssociationToPackage",
                            data : data
                        };
                        localApp.transitionToView(e.target, transOpts);
                    }
                }));
                //End
            },
            beforeActivate: function (previousView, data) {
                console.debug('Entering into beforeActivate method..');
                //var previousStateCds = [], previousProductCds = [], previousChannelCds = [];
                var grpdProductCdHash = {}, grpdChannelCdHash = {}, isDataPresent = false, xhrArgs,
                    groupedStoreDeferredObj, path, promotion;
                 
				//isInit = data.isInit;
                //displayErrorDiv.innerText = "";
                //domClass.remove(displayErrorDiv, 'error');
                //displayInfoDiv.innerText = "";
                //domClass.remove(displayInfoDiv, 'info');
				
                if (data) {
                    isInit = data.isInit;
                    optionType = data.type;
                    isDataPresent = true;
                    path = data.path;
                } else if(this.params.id && this.params.promotion) {                     
                    formId = this.params.id;  
                    optionType = FORM_VIEW_OR_EDIT;
                    promoteValidation = true; 
                    isDataPresent = true;
                    path = FROM_SEARCH_ROW_TO_FORM_CRT_EDT;                       
                    promotion = true;
                }
                //save_form_btn.set("disabled", true);
                stExpDateComp.set("disabled", true);
                lifeExpDtComp.set("disabled", true);

                domStyle.set(registry.byId("btnHistory_createOrViewMdfyForm").domNode, 'display', 'inline');

                if (optionType === "FORM_VIEW_OR_EDIT"){
                    domStyle.set(extract_st_form_btn.domNode, 'display', 'inline');
                    domStyle.set(associtate_to_pack_form_btn.domNode, 'display', 'inline');
					html.set(displayNameComp, "<b><h3>"+VIEW_MODIFY_FORM_DISPLAY_MSG +"</b></h3>");
					
                } else if (optionType === "FORM_CREATE"){
                    domStyle.set(extract_st_form_btn.domNode, 'display', 'none');
                    domStyle.set(associtate_to_pack_form_btn.domNode, 'display', 'none');
					html.set(displayNameComp, "<b><h3>"+CREATE_FORM_DISPLAY_MSG +"</b></h3>");
                }
                if (isDataPresent && path && path === NAVIGATION_LINK_PATH) {
                    console.debug('Navigated from-->', NAVIGATION_LINK_PATH);
                    //clear all the values if user navigated from the left frame link
                    formComp.reset(false);
                    formNumComp.set('disabled', false);
                    initializationCleanUp();

                } else if (isDataPresent && path && path === FROM_SEARCH_ROW_TO_FORM_CRT_EDT) {
                    formNumComp.set('disabled', true);
                    formComp.reset(false);
                    initializationCleanUp();

                } else if (isDataPresent && path && path === pathFromprodToFormCrtorUpd) {
                    console.debug('Navigated from-->', pathFromprodToFormCrtorUpd);
                    selectedProdCds = data.selectedProdCds;
                    console.debug('selected products are ->', selectedProdCds);
                    optionType = data.type;
                    if (selectedProdCds.length > 0 || previousProductCds.length >0 ) {
                        editProdBtn.set("disabled", false);
                        domAttr.remove("edit_product_btn_createOrViewMdfyForm", "style");
                        save_form_btn.set("disabled", false);
                        clone_form_btn.set("disabled", true);
                    } else if(isFormPromoted){
                    	domStyle.set("edit_product_btn_createOrViewMdfyForm",
                                errorBtnStyleClass);
                    }
                } else if (isDataPresent && optionType === FORM_CREATE && path && path === pathfromCmntToFormCrtOrUpd) {
                    console.debug('Navigated from-->', pathfromCmntToFormCrtOrUpd);
                    createCmntReq  = data.createCmntReq;
                    save_form_btn.set("disabled", false);
                } else if (isDataPresent && path && path === FROM_HISTSCRN_TO_FORMCRTORUPD) {
                    //save_form_btn.set("disabled", true);
                }
                //New Form
                if (isDataPresent && optionType === FORM_CREATE) {

                    console.debug('Navigated from-->', FORM_CREATE);
                    save_form_btn.set("disabled", false);

                    console.debug("Trying to Create form...");
                    isFormCloned = false;
                    //Making disable clone and history buttons in case of create form.
                    domStyle.set(clone_form_btn.domNode, 'display', 'none');
                    domStyle.set(registry.byId("btnHistory_createOrViewMdfyForm").domNode, 'display', 'none');
                    domStyle.set(templatesBtn.domNode, 'display', 'none');

                } else if (isDataPresent && optionType === FORM_VIEW_OR_EDIT) {

                    console.debug('Navigated from-->', FORM_VIEW_OR_EDIT);
                    domStyle.set(dom.byId("riclbl_createOrViewMdfyForm"), 'display', 'inline');
                    domStyle.set(clone_form_btn.domNode, 'display', 'inline');
                    domStyle.set(templatesBtn.domNode, 'display', 'inline');
					domStyle.set(associtate_to_pack_form_btn.domNode, 'display', 'inline');
					//Existing form
                    console.debug("Trying to editing the form...");

                    if (groupedFormStore === null) {
                        if(data) {
                            formId = data.id;
                        } else if(this.params.id) {                        
                            formId = this.params.id;
                        }
                        console.debug('Retrieved form id is..', formId);
                        //displayErrorDiv.innerText = "";
                        //displayInfoDiv.innerText = "";
                        Function._setJsonRestEndpointTable(jsonRestFormDetailsStore);
                        console.debug("Trying to get the grouped form details...");
                        Notice.loading();
                        jsonRestFormDetailsStore.query(formId + '/grouplist').then(function (results) {
                            var groupedForms;
                            try {
                                if (results) {
                                    groupedForms = results.groupedForms;
                                    array.forEach(groupedForms, function (form) {
                                        //Removing duplicates of states and products and channels.
                                        var stateCd, prodCd, distChanCd, id = {}, formIdAndOrgnlIdObj = {}, orgnlDocId = {}, stPrdChnlMapObj = {};
                                        groupedFormIds.push(form.id);

                                        formIdAndOrgnlIdObj.id = form.id;
                                        formIdAndOrgnlIdObj.orgnlDocId = form.orgnlDocId;
                                        idAndOrgnlMapArray.push(formIdAndOrgnlIdObj);

                                        stateCd = form.stCd;
                                        if (stateCd !== null && (!grpdStateCdsHash[stateCd])) {
                                            previousStateCds.push(stateCd);
                                            grpdStateCdsHash[stateCd] = stateCd;
                                        }

                                        prodCd = form.mseProdCd;
                                        if (prodCd !== null && (!grpdProductCdHash[prodCd])) {
                                            previousProductCds.push(prodCd);
                                            grpdProductCdHash[prodCd] = prodCd;
                                        }
                                        distChanCd = form.distChanCd;
                                        if (distChanCd !== null && (!grpdChannelCdHash[distChanCd])) {
                                            previousChannelCds.push(distChanCd);
                                            grpdChannelCdHash[distChanCd] = distChanCd;
                                        }

                                        //Creating the existing state, product and channel map - for form update process
                                        stPrdChnlMapObj = formCreateOrModifyModal.getPreparedObject(form.id, form.orgnlDocId, stateCd, prodCd, distChanCd, "1");
                                        groupedFormStPrChMapObj.push(stPrdChnlMapObj);
										var jsonString = JSON.stringify(groupedFormStPrChMapObj);
										console.debug("Grouped form data::", jsonString);
                                        //End-Creating the existing state, product and channel map - for form update process
                                    });
                                    groupedFormStore = new Memory({data: groupedForms, idProperty: "id"});
                                    previousStateCds.sort();
                                    console.debug("Previous Grouped State codes are -->", previousStateCds);
                                    previousProductCds.sort();
                                    console.debug("Previous Grouped product codes are -->", previousProductCds);
                                    previousChannelCds.sort();
                                    console.debug("Previous Grouped Channel codes are -->", previousChannelCds);
                                    recivedForm = groupedForms[0];

                                    // Assigning all initial data to selected states/products/channels.
                                    selectedSts = selectedSts.concat(previousStateCds);
									if (selectedSts.length === 0) {
										extract_st_form_btn.set('disabled', true);
									} else {
										extract_st_form_btn.set('disabled', false);
									}
                                    selectedProdCds = selectedProdCds.concat(previousProductCds);
                                    selectedChannels = selectedChannels.concat(previousChannelCds);
                                    commonFormAttrChangedFlag = false;  
                                } else {
                                    throw "Error while retrieving the grouped forms..";
                                }
                                //Checking the user whether the user has write access or not.
                                if (!hasUserFormRWAccess) {
                                    array.forEach(componentArray, function (component) {
                                        component.set("disabled", true);
                                    });
                                }
                                populateFormWithDetails(recivedForm);
								Notice.showSuccess(SUCCESS_IN_FETCHING_FORM_DTLS);
                                //Notice.doneLoading();
                            } catch (error) {
								console.error('Error while retrieving the form details--> ', error);
                                Notice.showError(EXCEPTION_IN_FETCHING_FORM_DTLS + CONTACT_SYS_ADMIN);
                                //domClass.add(displayErrorDiv, 'error');
                                //displayErrorDiv.innerHTML = EXCEPTION_IN_FETCHING_FORM_DTLS
                                //    + CONTACT_SYS_ADMIN;
                                
                            }
                            if(promotion) {
                                 validateForPromote(true);
                            }
                            Notice.doneLoading();
                        }, function (error) {
                            console.error(EXCEPTION_IN_FETCHING_FORM_DTLS, error);
							Notice.showError(EXCEPTION_IN_FETCHING_FORM_DTLS + CONTACT_SYS_ADMIN);
                            //domClass.add(displayErrorDiv, 'error');
                            //displayErrorDiv.innerHTML = EXCEPTION_IN_FETCHING_FORM_DTLS
                             //   + CONTACT_SYS_ADMIN;

                        });
                    }
					
                }
            },
            afterActivate: function (previousView, formdata) {
                var optionType, localApp;
                
                commonFormAttrChangedFlag = false;
                localApp = this.app;
                if(formdata) {
                    optionType = formdata.type;
                }
				onPageLoad = true;
                console.debug('Entering into after activate method..');
                if(promoteValidation && !this.params.promotion) {
                    validateForPromote(true);
                }
                //ON_CHANGE_EVENTS
                //Form Num
                formNumEvntHndlr = on(formNumComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(formNumComp,false);
                    }else{
                        isCommonFormAttrChanged(formNumComp,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=formnum_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(formNumEvntHndlr);
                //Form Revision date
                formRevEvntHndlr =  on(formRevComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(formRevComp,false);
                    }else{
                        isCommonFormAttrChanged(formRevComp,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=revDate_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(formRevEvntHndlr);
                //Form desc
                docDecEvntHndlr =  on(docDecComp, "change", lang.hitch(docDecComp, function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(docDecComp,false);
                    }else{
                        isCommonFormAttrChanged(docDecComp,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=formDesc_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                }));
                formEvents.push(docDecEvntHndlr);
                //Classification
                classftnEvntHndlr = on(classftnObj, "change", function (selectedVal) {
                    var subclassiftnResults = null, subClsftnsWRTClsftnArray = [];
                    //subClassftnObj.reset();
                    if (selectedVal) {
                        subclassiftnResults = subClassMemStore.query({parentCode: selectedVal});
                        if (subclassiftnResults) {
                            array.forEach(subclassiftnResults, function (subclasftn) {
                                subClsftnsWRTClsftnArray.push(subclasftn);
                            });
                            subClsWRTClsStore = new Memory({
                                data: subClsftnsWRTClsftnArray,
                                idProperty : 'targetCode'
                            });
                            subClassftnObj.store = subClsWRTClsStore;
                            subClassftnObj.set("searchAttr", "targetDescription");
                            subClassftnObj.set("placeHolder", "--Select--");
                            subClassftnObj.set("required", true);
                        } else {
                            console.debug('There are no subclassifications for the selected classification..');
                        }
                    }
                   if(onPageLoad){
                        isCommonFormAttrChanged(classftnObj,false);
                    }else{
                        isCommonFormAttrChanged(classftnObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=clasftn_createOrViewMdfyForm]");

                });
                formEvents.push(classftnEvntHndlr);
                //Subclassification
                subClassftnEvntHndlr = on(subClassftnObj, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(subClassftnObj,false);
                    }else{
                        isCommonFormAttrChanged(subClassftnObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=subClasftn_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(subClassftnEvntHndlr);
                //Doc form type
                docFormTypeEvntHndlr = on(docFormTypeObj, "change", function (selectedVal) {
                    console.debug('Selected document type value is-->', selectedVal);
                    //filedCd,nonFiledCd,adminCd,correspondenceCd are
                    //global variables across the application.
                    if (isFormReadyForPromote) {
                        var returnToHomeInd = null;
                        switch (selectedVal) {
                        case filedCd:
                        case nonFiledCd:
                            stEffDtComp.focus();
                            stEffDtComp.set('missingMessage', 'Please select state effective date.');
                            domStyle.set(dojo.query("label[for=stEffDate_createOrViewMdfyForm]")[0],
                                errorStyleClass);
                            stEffDtComp.set("required", true);

                            if (selectedSts.length > 0) {
                                stateTypeObj.set("required", true);
                                stateTypeObj.focus();
                                if (!stateTypeObj.validate()) {
                                    stateTypeObj.set("disabled", false);
                                    stateTypeObj.set('missingMessage', 'State type should not be empty');
                                    domStyle.set(stateTypeObj,
                                        errorStyleClass);
                                }
                            }

                            stApprDtComp.set("disabled", false);
                            stExpDateComp.set("disabled", false);
                            resdncTypeObj.set("disabled", true);

                            returnToHomeInd = query("input[type=radio][name=returntoHO_createOrViewMdfyForm]");
                            returnToHomeInd.forEach(function (node, index, arr) {
                                domAttr.remove(node, "disabled");
                            });
                            returnHONIndComp.set("checked", false);
                            break;

                        case adminCd:
                            stApprDtComp.set("disabled", true);
                            stExpDateComp.set("disabled", true);

                            if (selectedSts.length > 0) {
                                stateTypeObj.set("required", true);
                                stateTypeObj.focus();
                                stateTypeObj.set("disabled", false);
                                stateTypeObj.set('missingMessage', 'Select State type');
                                domStyle.set(stateTypeObj,
                                    errorStyleClass);
                            }
                            resdncTypeObj.set("disabled", false);
                            returnToHomeInd = query("input[type=radio][name=returntoHO_createOrViewMdfyForm]");
                            returnToHomeInd.forEach(function (node, index, arr) {
                                domAttr.remove(node, "disabled");
                            });
                            returnHONIndComp.set("checked", false);
                            domAttr.remove(dojo.query("label[for=stEffDate_createOrViewMdfyForm]")[0], "style");
                            break;

                        case correspondenceCd:
                            stApprDtComp.set("disabled", true);
                            stExpDateComp.set("disabled", true);
                            stateTypeObj.set("disabled", true);
                            resdncTypeObj.set("disabled", true);
                            returnToHomeInd = query("input[type=radio][name=returntoHO_createOrViewMdfyForm]");
                            returnToHomeInd.forEach(function (node, index, arr) {
                                domAttr.set(node, "disabled", "disabled");
                            });
                            returnHONIndComp.set("checked", true);
                            domAttr.remove(dojo.query("label[for=stEffDate_createOrViewMdfyForm]")[0], "style");
                            domAttr.remove(dojo.query("label[for=stType_createOrViewMdfyForm]")[0], "style");
                            break;
                        }

                    }
                   if(onPageLoad){
                        isCommonFormAttrChanged(docFormTypeObj,false);
                    }else{
                        isCommonFormAttrChanged(docFormTypeObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=formType_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(docFormTypeEvntHndlr);
                //Form title
                docTitleEvntHndlr = on(docTitleComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(docTitleComp,false);
                    }else{
                        isCommonFormAttrChanged(docTitleComp,true);
                    }
                });
                formEvents.push(docTitleEvntHndlr);
                //Form doc usage instructions
                docUsageInuEvntHndlr = on(docUsageInuComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(docUsageInuComp,false);
                    }else{
                        isCommonFormAttrChanged(docUsageInuComp,true);
                    }
                });
                formEvents.push(docUsageInuEvntHndlr);
                //State change
                on(stateObj, "change", function (selectedVal) {
                    //isCommonFormAttrChanged(stateObj, selectedVal);
                });
                //Timing requirement
                tmgReqEvntHndlr = on(tmgReqObj, "change", function (selectedVal) {

                    if(onPageLoad){
                        isCommonFormAttrChanged(tmgReqObj,false);
                    }else{
                        isCommonFormAttrChanged(tmgReqObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=tmgreq_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(tmgReqEvntHndlr);
                //Timing code
                tmgCdEvntHndlr = on(tmgCdObj, "change", function (selectedVal) {
                    console.debug('Changing the timing code values', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(tmgCdObj,false);
                    }else{
                        isCommonFormAttrChanged(tmgCdObj,true);
                    }
                    disableOrEnableErrMsgForCMSelect(selectedVal, "label[for=tmgCd_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(tmgCdEvntHndlr);
                //Distribution channel and this is part of common attribute
                distChnlEvntHndlr = on(distChnlObj, "change", function (selectedVal) {
                    save_form_btn.set("disabled", false);
                    clone_form_btn.set("disabled", true);
                    disableOrEnableErrMsgForCMSelect(selectedVal, "label[for=distChnl_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(distChnlEvntHndlr);
                //Return to home office YES indicator
                returnHOYIndEvntHndlr = on(returnHOYIndComp, "change", function (selectedVal) {
                    console.debug('selectedVal is at returnHOYIndComp', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(returnHOYIndComp,false);
                    }else{
                        isCommonFormAttrChanged(returnHOYIndComp,true);
                    }
                    domAttr.remove(query("label[for=returntoHO_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(returnHOYIndEvntHndlr);
                //Return to home office NO indicator
                returnHONIndEvntHndlr = on(returnHONIndComp, "change", function (selectedVal) {
                    console.debug('selectedVal is at returnHONIndComp', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(returnHONIndComp,false);
                    }else{
                        isCommonFormAttrChanged(returnHONIndComp,true);
                    }
                    domAttr.remove(query("label[for=returntoHO_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(returnHONIndEvntHndlr);
                //State type
                stateTypeEvntHndlr = on(stateTypeObj, 'change', function (selectedVal) {
                    if (selectedVal  ===  'Issue') {
                        resdncTypeObj.store = emptyStore;
                        resdncTypeObj.set("disabled", true);
                        domAttr.remove(query("label[for=resdncType_createOrViewMdfyForm]")[0], "style");
                    } else if (selectedVal  ===  'Resident') {
                        resdncTypeObj.store = resdncTypeLocalMemStore;
                        resdncTypeObj.focus();
                        resdncTypeObj.set("required", true);
                        resdncTypeObj.set('missingMessage', 'State type should not be empty');
                        resdncTypeObj.set("disabled", false);
                        domStyle.set(dojo.query("label[for=resdncType_createOrViewMdfyForm]")[0],
                                errorStyleClass);
                    }
                   if(onPageLoad){
                        isCommonFormAttrChanged(stateTypeObj,false);
                    }else{
                        isCommonFormAttrChanged(stateTypeObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=stType_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(stateTypeEvntHndlr);
                //Residence type
                resdncTypeEvntHndlr = on(resdncTypeObj, "change", function (selectedVal) {
                   if(onPageLoad){
                        isCommonFormAttrChanged(resdncTypeObj,false);
                    }else{
                        isCommonFormAttrChanged(resdncTypeObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=resdncType_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(resdncTypeEvntHndlr);

                //Transitional Yes indicator
                transYIndEvntHndlr = on(transYIndComp, "change", function (selectedVal) {
                    console.debug('selected  value is at transYIndComp', selectedVal);
                   if(onPageLoad){
                        isCommonFormAttrChanged(transYIndComp,false);
                    }else{
                        isCommonFormAttrChanged(transYIndComp,true);
                    }
                    domAttr.remove(query("label[for=tranInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(transYIndEvntHndlr);
                //Transitional No indicator
                transNIndEvntHndlr = on(transNIndComp, "change", function (selectedVal) {
                    console.debug('selectedVal is at transNIndComp', selectedVal);
                   if(onPageLoad){
                        isCommonFormAttrChanged(transNIndComp,false);
                    }else{
                        isCommonFormAttrChanged(transNIndComp,true);
                    }
                    domAttr.remove(query("label[for=tranInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(transNIndEvntHndlr);
                //Form use date
                formUseDtEvntHndlr = on(formUseDtComp, "change", function (e) {
                    var formUseDt = formUseDtComp.get('value');
                    if (formUseDt) {
                        lifeEffDtComp.constraints.max = formUseDtComp.get('value');
                    }
                    if(onPageLoad){
                        isCommonFormAttrChanged(formUseDtComp,false);
                    }else{
                        isCommonFormAttrChanged(formUseDtComp,true);
                    }
                });
                formEvents.push(formUseDtEvntHndlr);
                //State Approval date
                stApprDtEvntHndlr = on(stApprDtComp, "change", function (selectedVal) {
                    stApprDtComp.constraints.max = new Date();
                    if(onPageLoad){
                        isCommonFormAttrChanged(stApprDtComp,false);
                    }else{
                        isCommonFormAttrChanged(stApprDtComp,true);
                    }

                });
                formEvents.push(stApprDtEvntHndlr);
                //State Effective date
                stEffDtEvntHndlr = on(stEffDtComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(stEffDtComp,false);
                    }else{
                        isCommonFormAttrChanged(stEffDtComp,true);
                    }
                    stExpDateComp.set("disabled", false);
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=stEffDate_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                    var stEffDt = stEffDtComp.get('value');
                    if (stEffDt) {
                        stExpDateComp.constraints.min = stEffDt;
                    }

                });
                formEvents.push(stEffDtEvntHndlr);
                //State Exp Date
                on(stExpDateComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(stExpDateComp,false);
                    }else{
                        isCommonFormAttrChanged(stExpDateComp,true);
                    }
                    if (selectedVal) {
                        stEffDtComp.constraints.max = selectedVal;
                    }
                });
                formEvents.push(stEffDtEvntHndlr);
                //Nppi Pci destination
                on(nppiPciDesnObj, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(nppiPciDesnObj,false);
                    }else{
                        isCommonFormAttrChanged(nppiPciDesnObj,true);
                    }
                    disableOrEnableErrMsgForCMSelect(selectedVal, "label[for=nppiPciDesn_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(stEffDtEvntHndlr);
                //Document Content type
                on(docCntTypeObj, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(docCntTypeObj,false);
                    }else{
                        isCommonFormAttrChanged(docCntTypeObj,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=docContent_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(stEffDtEvntHndlr);
                //PageCount
                pageCntEvntHndlr = on(pageCntComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(pageCntComp,false);
                    }else{
                        isCommonFormAttrChanged(pageCntComp,true);
                    }
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=noOfPages_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                });
                formEvents.push(pageCntEvntHndlr);
                //Logo yes
                logoYIndEvntHndlr = on(logoYIndComp, "change", function (selectedVal) {
                    console.debug('logoYIndComp -- selectedVal -- ', selectedVal);
                     if(onPageLoad){
                        isCommonFormAttrChanged(logoYIndComp,false);
                    }else{
                        isCommonFormAttrChanged(logoYIndComp,true);
                    }
                    domAttr.remove(query("label[for=logoInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(logoYIndEvntHndlr);
                //Logo No
                logoNIndEvntHndlr = on(logoNIndComp, "change", function (selectedVal) {
                    console.debug('logoNIndComp -- selectedVal -- ', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(logoNIndComp,false);
                    }else{
                        isCommonFormAttrChanged(logoNIndComp,true);
                    }
                    domAttr.remove(query("label[for=logoInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(logoNIndEvntHndlr);
                //Officer Signature Yes
                offSignYIndEvntHndlr = on(offSignYIndComp, "change", function (selectedVal) {
                    console.debug('offSignYIndComp -- selectedVal -- ', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(offSignYIndComp,false);
                    }else{
                        isCommonFormAttrChanged(offSignYIndComp,true);
                    }
                    domAttr.remove(query("label[for=offSignInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(offSignYIndEvntHndlr);
                //Officer Signature No
                offSignNIndEvntHndlr = on(offSignNIndComp, "change", function (selectedVal) {
                    console.debug('offSignNIndComp -- selectedVal -- ', selectedVal);
                    if(onPageLoad){
                        isCommonFormAttrChanged(offSignNIndComp,false);
                    }else{
                        isCommonFormAttrChanged(offSignNIndComp,true);
                    }
                    domAttr.remove(query("label[for=offSignInd_createOrViewMdfyForm]")[0], "style");
                });
                formEvents.push(offSignNIndEvntHndlr);
                //Document Type
                lunarDocTpEvntHndlr = on(lunarDocTpComp, "change", function (selectedVal) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(lunarDocTpComp,false);
                    }else{
                        isCommonFormAttrChanged(lunarDocTpComp,true);
                    }
                });
                formEvents.push(lunarDocTpEvntHndlr);
                //Business Function
                busFunEvntHndlr = on(busFunObj, "change", function (e) {
                    if(onPageLoad){
                        isCommonFormAttrChanged(busFunObj,false);
                    }else{
                        isCommonFormAttrChanged(busFunObj,true);
                    }
                });
                formEvents.push(busFunEvntHndlr);
                //Life effective date
                lifeEffDtEvntHndlr = on(lifeEffDtComp, "change", function (selectedVal) {
                    var lifeEffDt = lifeEffDtComp.get('value');
                    if (lifeEffDt) {
                        lifeExpDtComp.constraints.min = dojoDate.add(lifeEffDt, "day", -1);
                        associtate_to_pack_form_btn.set('disabled', false);
                    } else {
                        associtate_to_pack_form_btn.set('disabled', true);
                    }
                    lifeExpDtComp.set("disabled", false);
                    disableOrEnableErrMsgForSelect(selectedVal, "label[for=lifeEffDate_createOrViewMdfyForm]",
                        isFormReadyForPromote);
                    if(onPageLoad){
                        isCommonFormAttrChanged(lifeEffDtComp,false);
                    }else{
                        isCommonFormAttrChanged(lifeEffDtComp,true);
                    }

                });
                formEvents.push(lifeEffDtEvntHndlr);
                //Life Expiration Date
                lifeExpDtEvntHndlr = on(lifeExpDtComp, "change", function (e) {
                    var lifeExpDate = lifeExpDtComp.get('value');
                    if (lifeExpDate) {
                        lifeEffDtComp.constraints.max = lifeExpDate;
                    }
                    if(onPageLoad){
                        isCommonFormAttrChanged(lifeExpDtComp,false);
                    }else{
                        isCommonFormAttrChanged(lifeExpDtComp,true);
                    }
                });
                formEvents.push(lifeExpDtEvntHndlr);
                //Documaker Impl. Date
                docMakerImplDtEvntHndlr = on(docMakerImplDtComp, "change", function (e) {
                   if(onPageLoad){
                        isCommonFormAttrChanged(docMakerImplDtComp,false);
                    }else{
                        isCommonFormAttrChanged(docMakerImplDtComp,true);
                    }
                });
                formEvents.push(docMakerImplDtEvntHndlr);
                //End of on change events.
                //clone_form_btn.set("disabled", false);
                //TBR-save_form_btn.set("disabled", false);
                console.debug('end of after activate..');
            },
            transitionTo: function (e, targetView, myParams) {
                var transOpts = {
                    target : targetView,
                    params : myParams
                };
                localApp.transitionToView(e.target, transOpts);
            }

        };




    });