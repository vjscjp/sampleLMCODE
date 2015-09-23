/*global define, console,  dijit : true*/
/*global prodMemoryStore, pathFromprodToFormCrtorUpd : true*/

/*global productNamesMemStore, productSeriesMemStore, productTypesMemStore, productLOBMemStore,
        productTypesMemStore, productSeriesMemStore, productCSOMTMemStore, productSubTypeMemStore,
        productMktNamesMemStore, FORM_VIEW_OR_EDIT, hasUserFormRWAccess, FORM_CREATE : true*/


define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array", "dojo/dom-style", "dojo/store/Memory"],
    function (dom, on, lang, registry, array, domStyle, Memory) {
        "use strict";
        var prodLobComp, prodTypeComp, prodSeriesNmComp, prodCSOMTComp, prodSubTypeComp, prodNmComp,
            prodMktNmComp, selectedProdCds, prodBtnCancel, prodBtnSave,
            prodBtnReset, prodLobTitlePaneComp, prodTypeTitlePaneComp, prodSeriesTitlePaneComp,
            prodCsoMtTitlePaneComp, prodSubtypeTitlePaneComp, prodNmTitlePaneComp, prodMktNmTitlePaneComp, prodFormComp,
            noRendercompArray = [], isAleadyViewed = false, optionType = null, prodNmSelAllComp, prodNmDSelAllComp, 
			prodMNSelComp, prodMNDSelComp, formNum = {}, docDesc = {}, formRvnDt = {},
			selectedPrdNms = [], selectedPrdMktNms = [];

        /**
        * This method is used to clean up the all global variables when navigation comes form
        * navigation frame.
        */
        function initializationCleanUp() {
            //console.debug('Cleaning up of all data..');
			//console.debug('Cleaning up of all data is done..');
        }
        return {

            init: function () {

                prodFormComp = dijit.byId("form_product");
                prodLobTitlePaneComp = dijit.byId("prod_lob_title");
                noRendercompArray.push(prodLobTitlePaneComp);
                prodTypeTitlePaneComp = dijit.byId("prod_type_title");
                noRendercompArray.push(prodTypeTitlePaneComp);
                prodSeriesTitlePaneComp = dijit.byId("prod_series_title");
                noRendercompArray.push(prodSeriesTitlePaneComp);
                prodCsoMtTitlePaneComp = dijit.byId("prod_CSO_MT_title");
                noRendercompArray.push(prodCsoMtTitlePaneComp);
                prodSubtypeTitlePaneComp = dijit.byId("prod_sub_type_title");
                noRendercompArray.push(prodSubtypeTitlePaneComp);


                prodNmSelAllComp = dijit.byId("prod_name_select_all");
                noRendercompArray.push(prodNmSelAllComp);
                prodNmDSelAllComp = dijit.byId("prod_name_deselect_all");
                noRendercompArray.push(prodNmDSelAllComp);
                prodMNSelComp = dijit.byId("prod_mrkt_nm_select_all");
                noRendercompArray.push(prodMNSelComp);
                prodMNDSelComp = dijit.byId("prod_mrkt_nm_deselect_all");
                noRendercompArray.push(prodMNDSelComp);
                prodBtnReset = dijit.byId("prod_reset");
                noRendercompArray.push(prodBtnReset);

                prodLobComp = registry.byId("prod_lob");
                prodLobComp.set("labelAttr", "label");
                prodLobComp.setStore(null);
                //noRendercompArray.push(prodLobComp);

                prodTypeComp = registry.byId("prod_type");
                prodTypeComp.set("labelAttr", "label");
                prodTypeComp.setStore(null);
                //noRendercompArray.push(prodTypeComp);

                prodSeriesNmComp = registry.byId("prod_series");
                prodSeriesNmComp.set("labelAttr", "label");
                prodSeriesNmComp.setStore(null);
                //noRendercompArray.push(prodSeriesNmComp);

                prodCSOMTComp = registry.byId("prod_CSO_MT");
                prodCSOMTComp.set("labelAttr", "label");
                prodCSOMTComp.setStore(null);
                //noRendercompArray.push(prodCSOMTComp);

                prodSubTypeComp = registry.byId("prod_sub_type");
                prodSubTypeComp.set("labelAttr", "label");
                prodSubTypeComp.setStore(null);
                //noRendercompArray.push(prodSubTypeComp);

                prodNmComp = registry.byId("prod_name");
                prodNmComp.set("labelAttr", "label");
                prodNmComp.setStore(null);
                //noRendercompArray.push(prodNmComp);

                prodMktNmComp = registry.byId("prod_mrkt_nm");
                prodMktNmComp.set("labelAttr", "label");
                prodMktNmComp.setStore(null);
                //noRendercompArray.push(prodMktNmComp);

                var selectedLOBs = [], selectedTypes = [], selectedSeriesNms = [],
                    selectedCSOMTs = [], selectedSubTypes = [], selectedNames = [], selectedMktNms = [],
                    productCdHash = {};

                prodBtnCancel = dijit.byId("prod_cancel");
                on(prodBtnCancel, "click", lang.hitch(this, function (e) {
                    var data = {}, transOpts;
                    data.type = optionType;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

                prodBtnSave = dijit.byId("prod_save");

                on(prodBtnSave, "click", lang.hitch(this, function (e) {

                    console.debug('Getting all selected product codes ..');
                    var localProductCodes = [], data = {}, transOpts;
                    productCdHash = {};
                    array.forEach(prodLobComp.getOptions(), function (lobOption) {
                        if (lobOption.selected) {
                            var lobOptionVal = lobOption.value;
                            selectedLOBs.push(lobOptionVal);
                            prodMemoryStore.query({lineOfBusinessName: lobOptionVal}).forEach(function (prodResult) {
                                //console.debug('prodResult LOB -->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });
                    productCdHash = {};
                    array.forEach(prodTypeComp.getOptions(), function (typeOption) {
                        if (typeOption.selected) {
                            var typeOptionValue = typeOption.value;
                            selectedTypes.push(typeOptionValue);
                            prodMemoryStore.query({typeName: typeOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult type -->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });
                    productCdHash = {};
                    array.forEach(prodSeriesNmComp.getOptions(), function (seriesOption) {
                        if (seriesOption.selected) {
                            var seriesOptionValue = seriesOption.value;
                            selectedSeriesNms.push(seriesOptionValue);
                            prodMemoryStore.query({seriesName: seriesOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult series -->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });
                    productCdHash = {};
                    array.forEach(prodCSOMTComp.getOptions(), function (csoMTOption) {
                        if (csoMTOption.selected) {
                            var csoMTOptionValue = csoMTOption.value;
                            selectedCSOMTs.push(csoMTOptionValue);
                            prodMemoryStore.query({cSOMortalityTableName: csoMTOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult cso mt-->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });
                    productCdHash = {};
                    array.forEach(prodSubTypeComp.getOptions(), function (subtypeOption) {
                        if (subtypeOption.selected) {
                            var subtypeOptionValue = subtypeOption.value;
                            selectedSubTypes.push(subtypeOptionValue);
                            prodMemoryStore.query({subTypeName: subtypeOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult sub type-->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });

                    array.forEach(prodNmComp.getOptions(), function (nameOption) {
                        if (nameOption.selected) {
                            var nameOptionValue = nameOption.value;
                            selectedNames.push(nameOptionValue);
                            prodMemoryStore.query({name: nameOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult name -->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });

                    array.forEach(prodMktNmComp.getOptions(), function (mktnmOption) {
                        if (mktnmOption.selected) {
                            var mktnmOptionValue = mktnmOption.value;
                            selectedMktNms.push(mktnmOptionValue);
                            prodMemoryStore.query({marketingName: mktnmOptionValue}).forEach(function (prodResult) {
                                //console.debug('prodResult mkt nm-->', prodResult);
                                var productCd = prodResult.masterProductCode;
                                if (!productCdHash[productCd]) {
                                    localProductCodes.push(productCd);
                                    productCdHash[productCd] = prodResult;
                                }
                            });
                        }
                    });
                    console.debug('The selected product codes are -->', localProductCodes);
                    data.selectedProdCds = localProductCodes.sort();
                    data.type = optionType;
                    data.path = pathFromprodToFormCrtorUpd;
                    transOpts = {
                        target : "forms",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

                //product dialog  when doing clone --- reset button event
                on(prodBtnReset, "click", function () {
                    //TBD
                    if (isAleadyViewed === true) {
                        domStyle.set(dom.byId("firstHalf"), "width", "50%");
                        //prodFormComp.reset();
                        array.forEach(noRendercompArray, function (component) {
                            domStyle.set(component.domNode, 'display', 'block');
                        });
                    }
                    prodLobComp.setStore(productLOBMemStore);
                    prodTypeComp.setStore(productTypesMemStore);
                    prodSeriesNmComp.setStore(productSeriesMemStore);
                    prodCSOMTComp.setStore(productCSOMTMemStore);
                    prodSubTypeComp.setStore(productSubTypeMemStore);
                    prodNmComp.setStore(productNamesMemStore);
                    prodMktNmComp.setStore(productMktNamesMemStore);
                    domStyle.set(prodBtnReset.domNode, 'display', 'none');
                });
				/* on(prodNmComp, "change", function (selectedValues) {
				    console.debug('Invoking product name on change function..');
					selectedPrdNms = [], selectedPrdMktNms = [];
					array.forEach(selectedValues, function (nameOptionValue) {
						prodMemoryStore.query({name: nameOptionValue}).forEach(function (prodResult) {
							//console.debug('prodResult name -->', prodResult);
							prodMemoryStore.query({
								"masterProductCode" : prodResult.masterProductCode
							}).forEach(function (prodObj) {
								selectedPrdNms.push(prodObj.name);
								selectedPrdMktNms.push(prodObj.marketingName);
							});
						});
					});
					prodNmComp.setStore(productNamesMemStore, selectedPrdNms, false);
                    prodMktNmComp.setStore(productMktNamesMemStore, selectedPrdMktNms, false);
				}); */

            },
            beforeActivate: function (previousView, data) {

                //Cleaning up of the productCdHash
                var formNumTxtComp, revDateTxtComp, formDescTxtComp, isFormCloned,
                    disableCompArray = [];
                optionType = data.type;
                isFormCloned = data.isFormCloned;
                formNum = data.formNum;
                docDesc = data.docDesc;
                formRvnDt = data.formRvnDt;

                console.debug('cloned form::' + isFormCloned);
                selectedProdCds = data.previousProductCds;
                if ((optionType === FORM_VIEW_OR_EDIT || isFormCloned) && selectedProdCds.length > 0) {
					selectedPrdNms = [], selectedPrdMktNms = [];
                    try {
                        array.forEach(selectedProdCds, function (msePrdCd) {
                            prodMemoryStore.query({
                                "masterProductCode" : msePrdCd
                            }).forEach(function (prodObj) {
                                selectedPrdNms.push(prodObj.name);
                                selectedPrdMktNms.push(prodObj.marketingName);
                            });
                        });

                        prodNmComp.setStore(productNamesMemStore, selectedPrdNms);
                        disableCompArray.push(prodNmComp);
                        prodNmTitlePaneComp = dijit.byId("prod_name_title");

                        prodMktNmComp.setStore(productMktNamesMemStore, selectedPrdMktNms);
                        disableCompArray.push(prodMktNmComp);
                        prodMktNmTitlePaneComp = dijit.byId("prod_mrkt_nm_title");

                        domStyle.set(dom.byId("firstHalf"), "width", "0%");
                        disableCompArray.push(prodBtnSave);
                        disableCompArray.push(prodBtnReset);
                        if (!hasUserFormRWAccess) {
                            array.forEach(disableCompArray, function (component) {
                                component.set("disabled", true);
                            });
                        }
                        array.forEach(noRendercompArray, function (component) {
                            domStyle.set(component.domNode, 'display', 'none');
                        });
                        domStyle.set(prodBtnReset.domNode, 'display', 'inline');
                        Notice.doneLoading();
                    } catch (error) {
                        Notice.doneLoading();
                        console.error('Exception occured in viewing products:' + error);
                    }
                    isAleadyViewed = true;
                } else if (optionType === FORM_CREATE) {

                    if (isAleadyViewed === true) {
                        domStyle.set(dom.byId("firstHalf"), "width", "50%");
                        //prodFormComp.reset();
                        array.forEach(noRendercompArray, function (component) {
                            domStyle.set(component.domNode, 'display', 'block');
                        });
                    }
					prodLobComp.setStore(productLOBMemStore);
                    prodTypeComp.setStore(productTypesMemStore);
                    prodSeriesNmComp.setStore(productSeriesMemStore);
                    prodCSOMTComp.setStore(productCSOMTMemStore);
                    prodSubTypeComp.setStore(productSubTypeMemStore);
                    prodNmComp.setStore(productNamesMemStore);
                    prodMktNmComp.setStore(productMktNamesMemStore);
                    domStyle.set(prodBtnReset.domNode, 'display', 'none');
                    Notice.doneLoading();
                } else {
					prodLobComp.setStore(productLOBMemStore);
                    prodTypeComp.setStore(productTypesMemStore);
                    prodSeriesNmComp.setStore(productSeriesMemStore);
                    prodCSOMTComp.setStore(productCSOMTMemStore);
                    prodSubTypeComp.setStore(productSubTypeMemStore);
                    prodNmComp.setStore(productNamesMemStore);
                    prodMktNmComp.setStore(productMktNamesMemStore);
                    domStyle.set(prodBtnReset.domNode, 'display', 'none');
                    Notice.doneLoading();
				}
                formNumTxtComp = dijit.byId("formNum_products");
                formNumTxtComp.set('value', data.formNum);
                formNumTxtComp.set('disabled', true);

                revDateTxtComp = dijit.byId("revDate_products");
                revDateTxtComp.set('value', data.formRvnDt);
                revDateTxtComp.set('disabled', true);

                formDescTxtComp = dijit.byId("formDesc_products");
                formDescTxtComp.set('value', data.docDesc);
                formDescTxtComp.set('disabled', true);
            },
            afterActivate: function (previousView, data) {


                on(registry.byId("prod_type_select_all"), "click", function () {
                    var prodTypeValues = [];
                    array.forEach(prodTypeComp.getOptions(), function (option) {
                        prodTypeValues.push(option.value);
                    });
                    prodTypeComp.set('value', prodTypeValues);
                });

                on(registry.byId("prod_type_deselect_all"), "click", function () {
                    prodTypeComp.setStore(productTypesMemStore);
                });

                on(registry.byId("prod_series_select_all"), "click", function () {

                    var prodSeriesValues = [];
                    array.forEach(prodSeriesNmComp.getOptions(), function (option) {
                        prodSeriesValues.push(option.value);
                    });
                    prodSeriesNmComp.set('value', prodSeriesValues);

                });

                on(registry.byId("prod_series_deselect_all"), "click", function () {
                    prodSeriesNmComp.setStore(productSeriesMemStore);
                });

                on(registry.byId("prod_sub_type_select_all"), "click", function () {
                    var prodSubTypeValues = [];
                    array.forEach(prodSubTypeComp.getOptions(), function (option) {
                        prodSubTypeValues.push(option.value);
                    });
                    prodSubTypeComp.set('value', prodSubTypeValues);
                });

                on(registry.byId("prod_sub_type_deselect_all"), "click", function () {
                    prodSubTypeComp.setStore(productSubTypeMemStore);
                });

                on(registry.byId("prod_name_select_all"), "click", function () {
                    var prodNameValues = [];
                    array.forEach(prodNmComp.getOptions(), function (option) {
                        prodNameValues.push(option.value);
                    });
                    prodNmComp.set('value', prodNameValues);
                });

                on(registry.byId("prod_name_deselect_all"), "click", function () {
                    prodNmComp.setStore(productNamesMemStore);
                });
                on(registry.byId("prod_mrkt_nm_select_all"), "click", function () {

                    var prodMktNameValues = [];
                    array.forEach(prodMktNmComp.getOptions(), function (option) {
                        prodMktNameValues.push(option.value);
                    });
                    prodMktNmComp.set('value', prodMktNameValues);

                });
                on(registry.byId("prod_mrkt_nm_deselect_all"), "click", function () {
                    prodMktNmComp.setStore(productMktNamesMemStore);
                });
            }
        };
    });