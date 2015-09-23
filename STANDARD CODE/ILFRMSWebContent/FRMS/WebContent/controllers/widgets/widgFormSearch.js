/*global define:true,dijit:true,dojo:true,alert:true,console:true*/
define(["dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/promise/all", "dojo/_base/array",
    "dojo/store/Memory", "dojo/store/Cache", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr",
        
    "dijit/registry", "dijit/form/Button", "dijit/Dialog", "dijit/form/Form",
        
    "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
    "dojo/text!/frmsadmin/controllers/widgets/templates/widgFormSearch.html",
    ], function (
        on, dom, EnhancedGrid, lang, ObjectStore, all, array, Memory, Cache, domClass, domStyle, domAttr,
         registry, Button, Dialog, Form,
        declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin, template
    ){
    
        var exClsftnCMSelect, selIssueStMemStore, selResdncStMemStore, selClassMemStore, isClasftionsSelected, selClassftnMemStore, issueStTypeInput = [], resdncStTypeInput = [],
        subClasFullScrnDialog, subClsFulScrnDlgCMSel, subClsFulScrnDlgDSelBtn, subClsFulScrnDlgSaveBtn, subClsFulScrnBtn, labelValueObj = {};
    
        var Function = this.app.FunctionHelper;
        var Notice = this.app.NoticeHelper;
    
        return declare('app.FormSearch', [_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
           
            
            // DOESN"T FIRE -- possibly move it back up and out?
            beforeActivate: function (previousView, data) {
                var self = this;
                
                console.debug('Before activate of search..');
                if (data) {
                    if (data.path === NAVIGATION_LINK_PATH) {
                        self.form_formSearch.reset();
                        selIssueStMemStore = null;
                        selResdncStMemStore = null;
                        selClassMemStore = null;
                        //formSearchGrid.setStore();
                        Function.disableErrMsg(".noFocusClass", ".tempSearchFldClass", ".tempFormNumClass");
                        //displayErrorDiv.innerText = "";
                        //domClass.remove(displayErrorDiv, 'error');
                        //displayInfoDiv.innerText = "";
                        //domClass.remove(displayInfoDiv, 'info');
                    } else if (data.path === fromCrtOrUpdFormToSearch) {
                        self.form_formSearch.reset();
                        selIssueStMemStore = null;
                        selResdncStMemStore = null;
                        selClassMemStore = null;
                        //formSearchGrid.setStore();
                        Function.disableErrMsg(".noFocusClass", ".tempSearchFldClass", ".tempFormNumClass");
                        domClass.add(displayInfoDiv, 'info');
                        //displayInfoDiv.innerText = data.displayMsg + data.cmntCreateRes;
                        displayInfoDiv.innerText = data.displayMsg;
                    }
                }
            },
            
            clearFromFields: function(e){
                        this.form_formSearch.reset();
                
                        this.prodNames_formSearch.set('value',[]);
                        this.prodNames_formSearch._updateSelection();
                        
                        this.prodSeries_formSearch.set('value',[]);
                        this.prodSeries_formSearch._updateSelection();
                        
                        this.prodSeries_formSearch.set('value',[]);
                        this.prodSeries_formSearch._updateSelection();
                        
                        this.prodTypes_formSearch.set('value',[]);
                        this.prodTypes_formSearch._updateSelection();
                        
                        this.docFormType_formSearch.set('value',[]);
                        this.docFormType_formSearch._updateSelection();
                        
                        this.busnsFunctn_formSearch.set('value',[]);
                        this.busnsFunctn_formSearch._updateSelection();
                        this.subclassfnCd_formSearch.removeOption(this.subclassfnCd_formSearch.getOptions());
						//formSearchGrid.setStore(null);
                    
            },
            /**
             * form search setup 
             */
            postCreate: function(e) {
                var self = this;
               
                var prodNamesCM, prodSeriesCM, prodTypesCM, stringFormatter, stNmFormatter, stTypeNmFormatter,
                    detailFormatter, localApp = this.app, 
                    selectedSubClsftns = [];

                // moved from afterActiveate
                var exClsftnCMSelect, inClstnCMSelect,
                    inIssueStCMSelect, exIssueStCMSelect, inResdncStCMSelect, exResdncStCMSelect,
                    resdncStTxtArea, issueStTxtArea, tempStates = [], targetShortDescription = {},
                    tempStateStore, tempStCloneData;
                
                
                exClsftnCMSelect =  self.exClsftnsCMSelect_search;
                exClsftnCMSelect.set("sortByLabel", true);
                inClstnCMSelect = self.inClsftnsCMSelect_search;
                inClstnCMSelect.set("sortByLabel", true);

                inIssueStCMSelect =  self.inStCMSelect_formsearch;
                exIssueStCMSelect =  self.exStsCMSelect_formsearch;
                inResdncStCMSelect =  self.resdncInStCMSelect_formsearch;
                exResdncStCMSelect =  self.resdncExStsCMSelect_formsearch;
                resdncStTxtArea = self.resdncsts_formSearch;
                issueStTxtArea = self.issueSts_formSearch;
                // end of after activate move
                
                
                // from Init
                
                
                // For getting form search details. - MOVED TO MAIN.js
                //formSearchMemStore = localApp.loadedStores.formsSearchMemory;
                //jsonRestFormSearchStore = localApp.loadedStores.jsonRestFormList;
                prodNamesCM = self.prodNames_formSearch;
                prodNamesCM.set("labelAttr", "label");
                
                // TODO note, These promises should be in one ALL not several
                if (defferedProdNamesStore) {
                    all({defferedProdNamesStore : defferedProdNamesStore}).then(function (results) {
                        productNamesMemStore = results.defferedProdNamesStore;
                        console.debug('Received product names');
                        prodNamesCM.setStore(productNamesMemStore);
                    });
                }
                prodSeriesCM = self.prodSeries_formSearch;
                prodSeriesCM.set("labelAttr", "label");
				prodSeriesCM.set("minHeight", -1);
                
                if (defferedProdSeriesStore) {
                    all({defferedProdSeriesStore : defferedProdSeriesStore}).then(function (results) {
                        productSeriesMemStore = results.defferedProdSeriesStore;
                        console.debug('Received product series');
                        prodSeriesCM.setStore(productSeriesMemStore);
                    });
                }
                prodTypesCM = self.prodTypes_formSearch;
                prodTypesCM.set("labelAttr", "label");
                
                if (defferedProdTypeStore) {
                    all({defferedProdTypeStore : defferedProdTypeStore}).then(function (results) {
                        productTypesMemStore = results.defferedProdTypeStore;
                        console.debug('Received product types');
                        prodTypesCM.setStore(productTypesMemStore);
                    });
                }

                /*// Product Names
                if (productNamesMemStore.data.length > 0) {
                    prodNamesCM = self.prodNames_formSearch;
                    prodNamesCM.set("labelAttr", "label");
                    prodNamesCM.setStore(productNamesMemStore);
                }

                // Product Series
                prodSeriesCM = self.prodSeries_formSearch;
                prodSeriesCM.set("labelAttr", "label");
                prodSeriesCM.setStore(productSeriesMemStore);

                // Product Types
                prodTypesCM = self.prodTypes_formSearch;
                prodTypesCM.set("labelAttr", "label");
                prodTypesCM.setStore(productTypesMemStore);*/

                // Getting the Document Form Type elements.


                jsonDocFrmTpStore.query({}, {}).then(
                        function (docFormResultsObj) {
                            docFormTpMemStore.setData(docFormResultsObj.referenceData);
                            var docFormTypeCM = self.docFormType_formSearch;
                            docFormTypeCM.set("labelAttr", "targetDescription");
                            docFormTypeCM.setStore(docFormTpMemStore);
                            console.debug('Successful retrieval of document form type data..', docFormResultsObj.referenceData);
                        },
                        function (error) {
                            console.error('Error in retreving the document form type data..');
                        }
                    );
                // Getting Business Function elements.
                
                jsonBusFunStore.query({}, {})
                        .then(
                        function (busFunResultsObj) {
                            var busFunResults, busFunCM;
                            busFunResults = busFunResultsObj.referenceData;
                            businessFunMemStore.setData(busFunResults);
                            busFunCM = self.busnsFunctn_formSearch;
                            busFunCM.set('labelAttr', "targetDescription");
                            busFunCM.setStore(businessFunMemStore);
                            console.debug('Successful retrieval of business function data..', busFunResults);
                        },
                        function (error) {
                            console.error('Error in retreving the business function data..');
                        }
                    );

                // Getting state elements
                // NOTE DEFERED BREAKING SITE - moving to main.js
//                jsonStateStore.query({}, {}).then(function (stateResultsObj) {
//
//                    var stateResults = stateResultsObj.referenceData;
//                    stateMemStore.setData(stateResults);
//                    console.debug('Successful retrieval of state data..', stateResults);
//
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the states data..');
//                    }
//                });

                // Getting statetype elements
                jsonStateTypeStore
                    .query({}, {})
                        .then(
                        function (stateTypeResultsObj) {
                            var stateTypeResults = stateTypeResultsObj.referenceData;
                            issueStTypeInput = [];
                            resdncStTypeInput = [];
                            array.forEach(
                                stateTypeResults,
                                function (result, i) {
                                    var tgtDesc = result.targetDescription;
                                    if (tgtDesc.toLowerCase() === 'Issue'.toLowerCase()) {
                                        issueStTypeInput
                                                .push(result.targetCode);
                                    } else {
                                        resdncStTypeInput
                                                .push(result.targetCode);
                                    }
                                }
                            );
                            stateTypeMemStore.setData(stateTypeResults);
                            console.debug('Successful retrieval of state type data..', stateTypeResults);
                        },
                        function (error) {
                            if (error.status === 500
                                    || error.status === 404) {
                                console.error('Error in retreving state type data..');
                            }
                        }
                    );

                // Getting classification elements
                jsonClasftnStore
                    .query({}, {
                        start : 10,
                        count : 10,
                        sort : [{
                            attribute : "referenceData.targetCode",
                            ascending : true
                        }]
                    }).then(
                        function (clasftnResultsObj) {

                            var clasftnResults = clasftnResultsObj.referenceData;
                            clasftnMemStore.setData(clasftnResults);
                            exClsftnCMSelect = self.exClsftnsCMSelect_search;
                            exClsftnCMSelect.set("labelAttr", "targetDescription");
                            exClsftnCMSelect.setStore(clasftnMemStore);
                            console.debug('Successful retrieval of classification data..', clasftnResults);

                        },
                        function (error) {
                            if (error.status === 500
                                    || error.status === 404) {
                                console.error('Error in retreving classification data..');
                            }
                        }
                    );
                // Getting subclassification elements
                // sets the proper endpoints
                jsonSubClassStore
                    .query({}, {}).then(
                        function (subClassResultsObj) {
                            var subClassResults = subClassResultsObj.referenceData;
                            subClassMemStore.setData(subClassResults);
                            console.debug('Successful retrieval of sub classification data..', subClassResults);
                            
                            Notice.doneLoading(); // set from package form searc
                        },
                        function (error) {
                            console.error('Error in retreving the sub classification data..');
                        }
                    );

                //displayErrorDiv = dom.byId("displayErrorMsg_formSearch");
                //displayInfoDiv = dom.byId("displayInfoMsg_formSearch");
                //displayWarnDiv = dom.byId("displayWarnMsg_formSearch");

                subClsftnCMSelect =  self.subclassfnCd_formSearch;
                selectedSubClsftns = Function.getLabelValueObjs(subClassMemStore.data);
                subClsftnCMSelect.set("labelAttr", "label");
                subClsftnCMSelect.setStore(new Memory({data: selectedSubClsftns, idProperty: 'value'}));

                subClsFulScrnBtn = self.subClsFullScreenBtn_formSearch;

                subClasFullScrnDialog = self.subClasftnFullScreenDialog_search;
                subClsFulScrnDlgCMSel = self.subclassfnDlg_formSearch;
                subClsFulScrnDlgDSelBtn = self.deselectAllBtnDlg_formSearch;
                subClsFulScrnDlgSaveBtn = self.subClsDoneScrnBtnDlg_formSearch;




                // Event for deselect of Sub Classfication
                self.deselectAllBtn_formSearch.on( "click", function () {

                    subClsftnCMSelect.set("labelAttr", "label");
                    subClsftnCMSelect.setStore(new Memory({data: subClsftnCMSelect.getOptions(), idProperty: 'value'}));

                });
                // Event for fullscreen
                subClsFulScrnBtn.on("click", function () {
                    if (subClsftnCMSelect) {
                        console.debug('Selected sub class values presented in parent are  -->', subClsftnCMSelect.getOptions());
                        subClsFulScrnDlgCMSel.set("labelAttr", "label");
                        subClsFulScrnDlgCMSel.setStore(new Memory({data: subClsftnCMSelect.getOptions(), idProperty: 'value'}));
                    }
                    subClasFullScrnDialog.show();
                });
                //Sub classification full screen save button
                subClsFulScrnDlgSaveBtn.on("click", function () {
                    var selSubClassfns = subClsFulScrnDlgCMSel.get('value');
                    if (subClsftnCMSelect) {
                        subClsftnCMSelect.set('value', selSubClassfns);
                    }
                    subClasFullScrnDialog.hide();
                });

                subClsFulScrnDlgDSelBtn.on("click", function () {
                    subClsFulScrnDlgCMSel.set("labelAttr", "label");
                    if (subClsftnCMSelect) {
                        subClsFulScrnDlgCMSel.setStore(new Memory({data: subClsftnCMSelect.getOptions(), idProperty: 'value'}));
                    } else {
                        subClsFulScrnDlgCMSel.setStore(new Memory({data: []}));
                    }
                });
                // THIS METHOD IS USED TO POPULATE THE SUBCLASSFICATIONS
                /* on(dijit.byId("subClassTitlePane_formSearch"), "click", function () {
                    try {
                        var selectedSubClsftns = [], tempSubClasftnStore;
                        array.forEach(subClassMemStore.data, function (subclsftn) {
                            labelValueObj.label = subclsftn.targetDescription;
                            labelValueObj.value = subclsftn.targetCode;
                            selectedSubClsftns.push(labelValueObj);
                            labelValueObj = {};
                        });
                        tempSubClasftnStore = new Memory({data: selectedSubClsftns, idProperty: 'value'});
                        if (!isClasftionsSelected && (dojo.byId("classftns_formSearch").value.length === 0)) {
                            subClsftnCMSelect.set("labelAttr", "label");
                            subClsftnCMSelect.setStore(tempSubClasftnStore);
                        }
                        console.debug('End of subclassifications..');
                    } catch (err) {
                        console.error('Error in populating SubClassifications-->', err);
                    }

                }); */
                //End of sub class

                


                // THIS WAS IN AFTER ACTIVATE

                //ADD CLASSIFICATION EVENTS


                //stateMemStore.data;
                tempStCloneData = JSON.parse(JSON.stringify(stateMemStore.data));
                array.forEach(tempStCloneData, function (state) {
                    labelValueObj.value = state.targetCode;
                    labelValueObj.label = state.targetDescription;
                    labelValueObj.targetShortDescription = state.targetShortDescription;
                    tempStates.push(labelValueObj);
                    labelValueObj = {};
                });

                tempStateStore = new Memory({
                    data: tempStates,
                    idProperty: 'value'
                });
                
                //EDIT CLASSIFICATION EVENT
                self.editClassftnBtn_formSearch.on("click", function () {

                    var tempClasMemStore, tempClassData, clasftnTxtAreaVal, selectedClsData;
                    clasftnTxtAreaVal = self.classftnsTxtArea_formSearch.value;
                    tempClassData = JSON.parse(JSON.stringify(clasftnMemStore.data));
                    tempClasMemStore = new Memory({data: tempClassData, idProperty: 'targetCode'});
                    exClsftnCMSelect.set("labelAttr", "targetDescription");

                    if (clasftnTxtAreaVal.length === 0) {

                        exClsftnCMSelect.setStore(tempClasMemStore);
                        inClstnCMSelect.setStore(emptyStore);
                        selClassMemStore = null;

                    } else if (selClassMemStore) {

                        selectedClsData = selClassMemStore.data;
                        array.forEach(selectedClsData, function (clsData) {
                            tempClasMemStore.remove(clsData.value);
                        });
                        exClsftnCMSelect.setStore(tempClasMemStore);
                        inClstnCMSelect.setStore(selClassMemStore);
                    }
                    self.classftnDialog_search.show();

                });
                // INCLUDE BUTTON EVENT
                self.btnInclude_clsfn.on("click", function () {
                    var options = [], localClsMemStore;
                    //var exClsftnCMSelect =  registry.byId("exClsftnsCMSelect_search");
                    array.forEach(exClsftnCMSelect.getOptions(), function (option) {
                        if (option.selected) {
                            option.selected = false;
                            options.push(option);
                            exClsftnCMSelect.removeOption(option);
                        }
                    });
                    inClstnCMSelect.addOption(options);
                    localClsMemStore = new Memory({data: inClstnCMSelect.getOptions(),
                        idProperty: "value"});
                    inClstnCMSelect.set("labelAttr", "label");
                    inClstnCMSelect.setStore(localClsMemStore);

                });
                // EXCLUDE BUTTON EVENT
                self.btnExclude_clsfn.on("click", function () {
                    var tempClassStMemStore = null, tempClasftnData = [], inClsCMOptions = [];
                    tempClasftnData = JSON.parse(JSON.stringify(clasftnMemStore.data));
                    tempClassStMemStore = new Memory({data: tempClasftnData, idProperty: 'targetCode'});
                    inClsCMOptions = inClstnCMSelect.getOptions();
                    if (inClsCMOptions.length > 0) {
                        array.forEach(inClsCMOptions, function (option) {
                            if (option.selected) {
                                option.selected = false;
                                inClstnCMSelect.removeOption(option);
                            } else {
                                tempClassStMemStore.remove(option.value);
                            }
                        });
                    } else {
                        inClstnCMSelect.setStore(emptyStore);
                    }
                    exClsftnCMSelect.set("sortByLabel", true);
                    exClsftnCMSelect.setStore(tempClassStMemStore);

                });
                // For includeAll button
                self.btnIncludeAll_clsfn.on("click", function () {
                    inClstnCMSelect.set('labelAttr', 'targetDescription');
                    inClstnCMSelect.setStore(clasftnMemStore);
                    exClsftnCMSelect.setStore(emptyStore);
                });
                // For excludeAll button
                self.btnExcludeAll_clsfn.on("click", function () {
                    exClsftnCMSelect.set('labelAttr', 'targetDescription');
                    exClsftnCMSelect.setStore(clasftnMemStore);
                    inClstnCMSelect.setStore(emptyStore);
                });
                // For accepting selected classifications
                self.acceptClsftns_search.on("click", function () {
                    var addedClsftns = inClstnCMSelect.getOptions(), selectedClassStr = '',
                        classftnInput = [], selectedClasftns = null, selectedSubclsftns = [], subClassSelValMemStore;
                    if (addedClsftns !== null && addedClsftns.length > 0) {
                        selClassMemStore = new Memory({
                            data: addedClsftns,
                            idProperty : 'value'
                        });
                        inClstnCMSelect.set('labelAttr', 'label');
                        inClstnCMSelect.setStore(selClassMemStore);

                        selectedClasftns = selClassMemStore.data;
                        array.forEach(selectedClasftns, function (clasftn) {
                            var obj, clsShrtDesc;
                            classftnInput.push(clasftn.value);
                            obj = clasftnMemStore.query({"targetCode": clasftn.value});
                            clsShrtDesc = obj[0].targetDescription;
                            selectedClassStr += clsShrtDesc + ',';
                        });

                    } else {
                        selClassMemStore = new Memory({
                            data: []
                        });
                    }
                    self.classftnsTxtArea_formSearch.set( "value",selectedClassStr.slice(0, (selectedClassStr.length - 1)) );
                    if (classftnInput.length > 0) {
                        isClasftionsSelected = true;
                        selClassftnMemStore = new Memory({data: classftnInput});

                        array.forEach(classftnInput, function (clasftn) {
                            subClassMemStore.query({
                                parentCode : clasftn
                            }).forEach(function (subclassiftn) {
                                labelValueObj.label = subclassiftn.targetDescription;
                                labelValueObj.value = subclassiftn.targetCode;
                                selectedSubclsftns.push(labelValueObj);
                                labelValueObj = {};
                            });

                        });
                    }
                    subClsftnCMSelect.set("labelAttr", "label");
                    if (selectedSubclsftns && selectedSubclsftns.length > 0) {
                        subClsftnCMSelect.setStore(new Memory({ data : selectedSubclsftns, idProperty : 'value'}));
                    }
                    self.classftnDialog_search.hide();

                });
                // END OF CLASSIFICATION EVENTS

                //Start of adding issue and residence states
                //Add issue States / Edit
                self.edit_issueStBtn_formSearch.on("click", function (e) {
                    var tempIssueStMemStore, tempStData, selectedIssueStData = {};
                    tempStData = JSON.parse(JSON.stringify(tempStateStore.data));
                    tempIssueStMemStore = new Memory({data: tempStData, idProperty: 'value'});
                    exIssueStCMSelect.set("labelAttr", "label");
                    if (issueStTxtArea.value.length === 0) {

                        exIssueStCMSelect.setStore(tempIssueStMemStore);
                        inIssueStCMSelect.setStore(emptyStore);
                        selIssueStMemStore = null;

                    } else if (selIssueStMemStore !== null || selIssueStMemStore !== "undefined") {
                        selectedIssueStData = selIssueStMemStore.data;
                        array.forEach(selectedIssueStData, function (data) {
                            tempIssueStMemStore.remove(data.value);
                        });
                        exIssueStCMSelect.set("sortByLabel", true);
                        exIssueStCMSelect.setStore(tempIssueStMemStore);
                        inIssueStCMSelect.set("sortByLabel", true);
                        inIssueStCMSelect.setStore(selIssueStMemStore);
                    }
                    self.stateDialogId_formsearch.show();

                });
                //INCLUDE STATE EVENT
                self.btnIn_editSt_formsearch.on("click", function (e) {

                    var addedIsSts = [];
                    array.forEach(exIssueStCMSelect.getOptions(), function (option) {
                        if (option.selected) {
                            option.selected = false;
                            exIssueStCMSelect.removeOption(option);
                            addedIsSts.push(option);
                        }
                    });
                    if (selIssueStMemStore !== null && selIssueStMemStore !== "undefined") {
                        array.forEach(addedIsSts, function (state) {
                            selIssueStMemStore.put({label: state.label, value: state.value});
                        });

                    } else {
                        selIssueStMemStore = new Memory({
                            data: addedIsSts,
                            idProperty : 'value'
                        });
                    }
                    inIssueStCMSelect.set('labelAttr', 'label');
                    inIssueStCMSelect.setStore(selIssueStMemStore);

                });
                //EXCLUDE STATE EVENT
                self.btnEx_editSt_formsearch.on("click", function (e) {
                    var tempIssueStMemStore = null, tempStData = [], inIsStCMOptions = [];
                    tempStData = JSON.parse(JSON.stringify(tempStateStore.data));
                    tempIssueStMemStore = new Memory({data: tempStData, idProperty: 'value'});
                    inIsStCMOptions = inIssueStCMSelect.getOptions();
                    if (inIsStCMOptions.length > 0) {
                        array.forEach(inIsStCMOptions, function (option) {
                            if (option.selected) {
                                option.selected = false;
                                inIssueStCMSelect.removeOption(option);
                                //removedIssueSts.push(option);
                            } else {
                                tempIssueStMemStore.remove(option.value);
                            }
                        });
                    } else {
                        inIssueStCMSelect.setStore(emptyStore);
                    }
                    exIssueStCMSelect.set("sortByLabel", true);
                    exIssueStCMSelect.set('labelAttr', 'label');
                    exIssueStCMSelect.setStore(tempIssueStMemStore);

                });
                //INCLUDE ALL
                self.btnInAll_editSt_formsearch.on("click", function (e) {
                    inIssueStCMSelect.set('labelAttr', 'label');
                    inIssueStCMSelect.setStore(tempStateStore);
                    exIssueStCMSelect.setStore(emptyStore);
                    selIssueStMemStore = null;

                });
                //EXCLUDE ALL
                self.btnExAll_editSt_formsearch.on("click", function (e) {
                    exIssueStCMSelect.set('labelAttr', 'label');
                    exIssueStCMSelect.setStore(tempStateStore);
                    inIssueStCMSelect.setStore(emptyStore);
                });
                //ACCEPT ISSUE STATES
                self.acceptIssueStatesBtn_formsearch.on("click", function (e) {

                    var addedIssueSts = inIssueStCMSelect.getOptions(), selectedStateStr = '',
                        selectedIssueSts = null;
                    if (addedIssueSts !== null && addedIssueSts.length > 0) {
                        selIssueStMemStore = new Memory({
                            data: addedIssueSts,
                            idProperty : 'value'
                        });
                        inIssueStCMSelect.set('labelAttr', 'label');
                        inIssueStCMSelect.setStore(selIssueStMemStore);

                        selectedIssueSts = selIssueStMemStore.data;
                        array.forEach(selectedIssueSts, function (issueStOption) {
                            var obj, stShrtDesc;
                            obj = stateMemStore.query({"targetCode": issueStOption.value});
                            stShrtDesc = obj[0].targetShortDescription;
                            selectedStateStr += stShrtDesc + ',';
                            selectedStateStr.slice(0, (selectedStateStr.length - 1));
                        });

                    } else {
                        selIssueStMemStore = new Memory({
                            data: []
                        });
                    }
                    issueStTxtArea.set('value', selectedStateStr.slice(0, (selectedStateStr.length - 1)) );
                    self.stateDialogId_formsearch.hide();

                });

                //Adding Residence states.
                self.edit_residenseStBtn_formSearch.on("click",  function () {

                    var tempIssueStMemStore, tempStData, tempResdncStMemStore = null, selectedResStData = null;
                    tempStData = JSON.parse(JSON.stringify(tempStateStore.data));
                    tempResdncStMemStore = new Memory({data: tempStData, idProperty: 'value'});
                    exResdncStCMSelect.set("labelAttr", "label");

                    if (resdncStTxtArea.value.length === 0) {
                        exResdncStCMSelect.setStore(tempResdncStMemStore);
                        inResdncStCMSelect.setStore(emptyStore);
                        selResdncStMemStore = null;

                    } else if (selResdncStMemStore !== null || selResdncStMemStore !== "undefined") {
                        selectedResStData = selResdncStMemStore.data;
                        array.forEach(selectedResStData, function (data) {
                            tempResdncStMemStore.remove(data);
                        });
                        exResdncStCMSelect.set("sortByLabel", true);
                        exResdncStCMSelect.setStore(tempResdncStMemStore);
                        inResdncStCMSelect.set("sortByLabel", true);
                        inResdncStCMSelect.setStore(selResdncStMemStore);
                    }
                    self.resdncStateDialogId_formsearch.show();

                });
                //INCLUDE STATE EVENT - RESIDENT
                self.resdncBtn_include.on("click", function () {
                    var addedSts = [];
                    array.forEach(exResdncStCMSelect.getOptions(), function (option) {
                        if (option.selected) {
                            option.selected = false;
                            exResdncStCMSelect.removeOption(option);
                            addedSts.push(option);
                        }
                    });
                    if (selResdncStMemStore !== null && selResdncStMemStore !== "undefined") {
                        array.forEach(addedSts, function (state) {
                            selResdncStMemStore.put({label: state.label, value: state.value});
                        });

                    } else {
                        selResdncStMemStore = new Memory({
                            data: addedSts,
                            idProperty : 'value'
                        });
                    }
                    inResdncStCMSelect.set('sortByLabel', true);
                    inResdncStCMSelect.set('labelAttr', 'label');
                    inResdncStCMSelect.setStore(selResdncStMemStore);

                });
                //EXCLUDE STATE EVENT - RESIDENT
                self.resdncBtn_exclude.on("click", function () {
                    var tempIssueStMemStore = null, tempStData = [], inResStCMOptions = [];
                    tempStData = JSON.parse(JSON.stringify(tempStateStore.data));
                    tempIssueStMemStore = new Memory({data: tempStData, idProperty: 'value'});
                    inResStCMOptions = inResdncStCMSelect.getOptions();
                    if (inResStCMOptions.length > 0) {
                        array.forEach(inResStCMOptions, function (option) {
                            if (option.selected) {
                                option.selected = false;
                                inResdncStCMSelect.removeOption(option);
                                //removedIssueSts.push(option);
                            } else {
                                tempIssueStMemStore.remove(option.value);
                            }
                        });
                    } else {
                        inResdncStCMSelect.setStore(emptyStore);
                    }
                    exResdncStCMSelect.set("sortByLabel", true);
                    exResdncStCMSelect.set('labelAttr', 'label');
                    exResdncStCMSelect.setStore(tempIssueStMemStore);

                });
                //INCLUDE ALL - RESIDENT
                self.resdncBtn_include_all.on("click", function () {

                    inResdncStCMSelect.set('labelAttr', 'label');
                    inResdncStCMSelect.setStore(tempStateStore);
                    exResdncStCMSelect.setStore(emptyStore);
                    selResdncStMemStore = null;
                });
                //EXCLUDE ALL - RESIDENT
                self.resdncBtn_exclude_all.on("click", function () {
                    exResdncStCMSelect.set('labelAttr', 'label');
                    exResdncStCMSelect.setStore(tempStateStore);
                    inResdncStCMSelect.setStore(emptyStore);
                });
                //ACCEPT RESIDENCE STATES
                self.acceptResdncStatesBtn_formsearch.on("click", function () {
                    var addedResSts = inResdncStCMSelect.getOptions(), selectedStateStr = '',
                        selectedResSts = null;
                    if (addedResSts !== null && addedResSts.length > 0) {
                        selResdncStMemStore = new Memory({
                            data: addedResSts,
                            idProperty : 'value'
                        });
                        inResdncStCMSelect.set('labelAttr', 'label');
                        inResdncStCMSelect.setStore(selResdncStMemStore);

                        selectedResSts = selResdncStMemStore.data;
                        array.forEach(selectedResSts, function (issueStOption) {
                            var obj, stShrtDesc;
                            obj = stateMemStore.query({"targetCode": issueStOption.value});
                            stShrtDesc = obj[0].targetShortDescription;
                            selectedStateStr += stShrtDesc + ',';
                            selectedStateStr.slice(0, (selectedStateStr.length - 1));
                        });

                    } else {
                        selIssueStMemStore = new Memory({
                            data: []
                        });
                    }
                    resdncStTxtArea.set("value",selectedStateStr.slice(0, (selectedStateStr.length - 1)) );
                    self.resdncStateDialogId_formsearch.hide();
                });
                
            },
            
            // END Init
            
            btnSearchClick: function(e) {
                var self = this;
                
                var formNumComp, asOfDtComp, dateTypeComp, prodSeriesComp, displayErrors = [], isInvalid, defferedObj,
                        issueStates = [], issueStTypes = [], resdncStates = [], resdncStTypes = [], formSearchInput = {},
                        jsonObj, searchRequest = {}, formNum, asOfDate, dateType, prodNames, prodSeries, prodTypes, docFormTypesInput,
                        busnsFunctnsInput, subClassObj, subclassfnsInput = [], selectedIssueSts = null, selectedResSts = null,
                        issueStsInfo = {}, resdncStsInfo = {}, docFormTypes = [], businessFunctions = [], classftnInput = [],
                        classiftns = [], subClassiftns = [], jsonString;
                    self.formBtnSearch_formSearch.set('disabled', true);
                    //displayErrorDiv.innerText = "";
                    //displayInfoDiv.innerText = "";
                    //domClass.remove(displayErrorDiv, 'error');
                    //domClass.remove(displayInfoDiv, 'info');

                    formNumComp = self.formNum_formSearch;
                    formNum = formNumComp.value;
                    asOfDtComp = self.formAsOfDate_formSearch;
                    dateTypeComp = self.dateType_formSearch;
                    prodSeriesComp = self.prodSeries_formSearch;

                    isInvalid = false;
                    asOfDate = asOfDtComp.get("value");
                    dateType = dateTypeComp.get("value");
                    prodSeries = prodSeriesComp.get("value");
                    console.debug('Selected prodSeries values are-->', prodSeries);
                    prodNames = self.prodNames_formSearch.get("value");
                    console.debug('Selected prodNames values for -->', prodNames);
                    prodTypes = self.prodTypes_formSearch.get("value");
                    docFormTypesInput = self.docFormType_formSearch.get('value');
                    console.debug('Selected documetn form type values are-->', docFormTypesInput);
                    busnsFunctnsInput = self.busnsFunctn_formSearch.get('value');
                    console.debug('Selected business function values are-->', busnsFunctnsInput);

                    //subClassObj = registry.byId("subclassfnCd_formSearch");
                    //if (subClassObj !== null && subClassObj !== "undefined") {
                    if (subClsftnCMSelect) {
                        subclassfnsInput = subClsftnCMSelect.get("value");
                    }
                    console.debug('Selected subclassification values are-->', subclassfnsInput);
                    try {
                        if (formNum) {
                            if (formNum.length > 100) {
                                prodSeriesComp.set("invalidMessage", "Maximum length is 100 characters!");
                            }
                            searchRequest.formNum = formNum;
                        } else if (!asOfDate && !(dateType.length > 0) && !(prodSeries.length > 0)) {
                            domStyle.set(dojo.query("label[for=formNum_formSearch]")[0],
                                errorStyleClass);
                        }
                        if (!formNum) {
                            asOfDtComp.focus();
                            asOfDtComp.set("required", true);
                            if (!asOfDtComp.validate()) {
                                asOfDtComp.set("missingMesssage", "Enter As of Date!");
                                displayErrors.push(asOfDtComp);
                                domStyle.set(dojo.query("label[for=formAsOfDate_formSearch]")[0],
                                    errorStyleClass);
                                isInvalid = true;
                            }
                            dateTypeComp.focus();
                            dateTypeComp.set("required", true);
                            if (!dateTypeComp.validate()) {
                                dateTypeComp.set("missingMesssage", "Enter the Date Type!");
                                domStyle.set(dojo.query("label[for=dateType_formSearch]")[0],
                                    errorStyleClass);
                                displayErrors.push(dateTypeComp);
                                isInvalid = true;
                            }
                            prodSeriesComp.focus();
                            prodSeriesComp.set("required", true);
                            if (!prodSeriesComp.validate()) {
                                prodSeriesComp.set("missingMesssage ", "Please select any series!");
                                displayErrors.push(prodSeriesComp);
                                domStyle.set(dojo.query("label[for=prodSeries_formSearch]")[0],
                                    errorStyleClass);
                                isInvalid = true;
                            }
                            if (isInvalid) {
                                throw REQUIRED_FIELDS_MISSING;
                            }

                            if (selIssueStMemStore) {
                                if (selIssueStMemStore.data) {
                                    selectedIssueSts = selIssueStMemStore.data;
                                    console.debug('Selected issue states--', selectedIssueSts);
                                    if (selectedIssueSts !== null && selectedIssueSts.length > 0) {
                                        array.forEach(selectedIssueSts, function (result, i) {
                                            labelValueObj.cd = result.value;
                                            issueStates.push(labelValueObj);
                                            labelValueObj = {};
                                        });

                                        // var issueStTypes = [{"cd":"1043400002"}];
                                        if (issueStTypeInput !== null) {
                                            issueStTypes = Function.getCodeArrayObjs(issueStTypeInput);
                                        }
                                    }
                                }
                            }

                            if (selResdncStMemStore) {
                                selectedResSts = selResdncStMemStore.data;
                                console.debug('Selected residence states--', selectedResSts);
                                if (selectedResSts !== null && selectedResSts.length > 0) {
                                    array.forEach(selectedResSts, function (result, i) {
                                        labelValueObj.cd = result.value;
                                        resdncStates.push(labelValueObj);
                                        labelValueObj = {};
                                    });

                                    if (resdncStTypeInput !== null) {
                                        resdncStTypes = Function.getCodeArrayObjs(resdncStTypeInput);
                                    }
                                }
                            }

                            formSearchInput.asOfDate = asOfDate;
                            formSearchInput.dateType = dateType;
                            formSearchInput.prodSeries = prodSeries;
                            if (prodNames.length > 0) {
                                formSearchInput.prodNames = prodNames;
                            }
                            if (prodTypes.length > 0) {
                                formSearchInput.prodTypes = prodTypes;
                            }
                            if (issueStates.length > 0 && issueStTypes.length > 0) {
                                issueStsInfo.issueStates = issueStates;
                                issueStsInfo.stTypes = issueStTypes;

                                formSearchInput.issueStsInfo = issueStsInfo;
                            }
                            if (resdncStates.length > 0 && resdncStTypes.length > 0) {
                                resdncStsInfo.resdncStates = resdncStates;
                                resdncStsInfo.stTypes = resdncStTypes;
                                formSearchInput.resdncStsInfo = resdncStsInfo;
                            }
                            // DocFormType Object Creation
                            if (docFormTypesInput.length > 0) {
                                docFormTypes = Function.getCodeArrayObjs(docFormTypesInput);
                                formSearchInput.docFormTypes = docFormTypes;
                            }
                            if (busnsFunctnsInput.length > 0) {
                                // BusinessFunctions Object Creation
                                businessFunctions = Function.getCodeArrayObjs(busnsFunctnsInput);
                                formSearchInput.businessFunctions = businessFunctions;
                            }
                            if (selClassftnMemStore) {
                                classftnInput = selClassftnMemStore.data;
                                if (classftnInput.length > 0) {
                                    // Classification Object Creation
                                    classiftns = Function.getCodeArrayObjs(classftnInput);
                                    formSearchInput.classiftns = classiftns;
                                }
                            }
                            if (subclassfnsInput.length > 0) {
                                // SubClassification Object Creation
                                subClassiftns = Function.getCodeArrayObjs(subclassfnsInput);
                                formSearchInput.subClassiftns = subClassiftns;
                            }
                            searchRequest.formSearchInput = formSearchInput;
                        }
                        jsonString = JSON.stringify(searchRequest);
                        //alert('jsonString:'+jsonString);
                        console.debug('Search input request:', jsonString);
                        jsonObj = JSON.parse(jsonString);

                        //For Local testing
                        Function._setJsonRestEndpointTable(jsonRestFormSearchStore);
                        defferedObj = jsonRestFormSearchStore.put(jsonObj, {}).then(function (results) {
                            console.debug('Success in retriving the search results');
                            self.formBtnSearch_formSearch.set('disabled', false);
                            
                            if (results !== null) {
                                formSrchResultStore = new ObjectStore({
                                    objectStore : new Memory({
                                        data : results.formList
                                    })
                                });
                                
                                //domClass.add(displayInfoDiv, 'info');
                                //displayInfoDiv.innerHTML = FORM_SEARCH_SUCCESS_RESULTS;
                                Notice.showSuccess(FORM_SEARCH_SUCCESS_RESULTS);
                                console.debug('Successful retrieval of form search data.');
                                self.formBtnSearch_formSearch.set('disabled', false);
                                return formSrchResultStore;        
                            } else {
                                //domClass.add(displayInfoDiv, 'info');
                                //displayInfoDiv.innerHTML = '<div style="color: green;"><b>Request completed.No Matches found</b> </div>';
                                Notice.showInfo("Request completed. No Matches found");
                                //formSearchGrid.setStore(null);
                            }
                            
                        }, function (error) {
                            Function.handleError(error);
                            self.formBtnSearch_formSearch.set('disabled', false);
                        });
                    } catch (error) {
                        if (error === REQUIRED_FIELDS_MISSING) {
                            //domClass.add(displayErrorDiv, 'error');
                            //displayErrorDiv.innerHTML = '<div style="color: red;"><b>Please enter either '
                            //    + 'form num or other mandatory fields.</b> </div>';
                            Notice.showError("Please enter either form num or other mandatory fields.", {timeOut: 2000});
                        }
                        self.formBtnSearch_formSearch.set('disabled', false);
                        console.error("Error while searching!!", error);
                    }
                
                    return defferedObj;
            }
            
            
            
            
        });

});