//Predefined tokens
/*global define, console, dijit, dojox, dojo, alert : true*/

/**
 * This model will have all the operations related to form association to package.
 */
define(["dojo/store/Memory",  "controllers/widgets/functions.js", "dojo/promise/all",
    "dojo/_base/array", "dojo/date", "dojo/Deferred", "dojo/data/ObjectStore", "dojo/dom",
	"dojo/dom-construct", "dojo/dom-attr", "dojo/dom-style", "dojo/domReady!"],
    function (Memory, Functions, all, array, dojoDate, Deferred, ObjectStore, dom, domConstruct, domAttr,
		domStyle, domReady) {
        "use strict";
        var Function = new Functions();

        return {
            getFormRequest: function (groupedFormStore, commonAttributes, previousStateCds, selectedSts,
                previousProductCds, selectedProdCds, previousChannelCds, selectedChannelCds,
                            optionType, commonAttrChangedFlag, removedStLifeEffDtMapArray) {

                var addedStCds = [], addedProdCds = [], addedDistChanCds = [], removedStCds = [], removedProdCds = [],
                    removedDistChanCds = [], stPrChAttrChangedFlag = false, localScopeObj = this, totalStCds = [], totalProdCds = [], 
					totaldistChanCds = [], formRequest = {}, formsToBeRemoved = [], formsToBeUpdated = [], formsToBeCreated = [], allFormsToBeAdded = [],
                    formsToBeAdded = [], tempRemainStCds = [], tempRemainProdCds = [], tempRemaindistChanCds = [], jsonString = {};

				//The below code is used to get the added and removed states
                if (previousStateCds.length === 0) {
					addedStCds = selectedSts;
				} else	if (previousStateCds.length > 0 || selectedSts.length > 0) {
                    array.forEach(selectedSts, function (selState) {
                        //Checking if saved product present in the selected products list
                        if (!(previousStateCds.indexOf(selState) >= 0)) {
                            addedStCds.push(selState);
                        }
                    });
                    array.forEach(previousStateCds, function (previousStCd) {
                        //Checking if previous product present in the saved products list
                        if (!(selectedSts.indexOf(previousStCd) >= 0)) {
                            removedStCds.push(previousStCd);
                        }
                    });

                }

                console.debug("Previous State Codes are -->", previousStateCds);
                console.debug("Selected State Codes are -->", selectedSts);
                console.debug("Added State codes are -->", addedStCds);
                console.debug("Removed State codes are -->", removedStCds);

                //The below code is used to get the added and removed products
				if(previousProductCds.length === 0) {
					addedProdCds = selectedProdCds;
                } else if (previousProductCds.length > 0 || selectedProdCds.length > 0) {
                    array.forEach(selectedProdCds, function (selProd) {
                        //Checking if saved product present in the selected products list
                        if (!(previousProductCds.indexOf(selProd) >= 0)) {
                            addedProdCds.push(selProd);
                        }
                    });
                    array.forEach(previousProductCds, function (previousProd) {
                        //Checking if selected product present in the saved products list
                        if (!(selectedProdCds.indexOf(previousProd) >= 0)) {
                            removedProdCds.push(previousProd);
                        }
                    });

                }
                console.debug("Previous Product Codes are -->", previousProductCds);
                console.debug("Selected Product Codes are -->", selectedProdCds);
                console.debug("Added products are -->", addedProdCds);
                console.debug("Removed products are -->", removedProdCds);

                //The below code is used to get the added and removed distribution channels
                if(previousChannelCds.length === 0) {
					addedDistChanCds = selectedChannelCds;
				} else if (previousChannelCds.length > 0 || selectedChannelCds.length > 0) {
                    array.forEach(selectedChannelCds, function (selChannel) {
                        //Checking if saved channel present in the selected channels list
                        if (!(previousChannelCds.indexOf(selChannel) >= 0)) {
                            addedDistChanCds.push(selChannel);
                        }
                    });
                    array.forEach(previousChannelCds, function (previousChannel) {
                        //Checking if selected channels present in the saved channels list
                        if (!(selectedChannelCds.indexOf(previousChannel) >= 0)) {
                            removedDistChanCds.push(previousChannel);
                        }
                    });

                }
                console.debug("Previous distribution channels codes are -->", previousChannelCds);
                console.debug("Selected distribution channels codes are -->", selectedChannelCds);
                console.debug("Added distribution channels are -->", addedDistChanCds);
                console.debug("Removed distribution channels are -->", removedDistChanCds);

                formRequest.commonAttributes = commonAttributes;

                formRequest.formsToBeRemoved = formsToBeRemoved;
                formRequest.formsToBeUpdated = formsToBeUpdated;
                formRequest.formsToBeCreated = formsToBeCreated;

                if (optionType === "FORM_CREATE") {

                    totalStCds = addedStCds;
                    totalProdCds = addedProdCds;
                    totaldistChanCds = addedDistChanCds;

                    formsToBeCreated = localScopeObj.prepareAndGetFormRequest(null, totalStCds, totalProdCds, totaldistChanCds, "0", localScopeObj);
                    formRequest.formsToBeCreated = formsToBeCreated;
                    jsonString = JSON.stringify(formRequest);
                    console.debug('Input form create request:',  jsonString);


                } else if (optionType === "FORM_VIEW_OR_EDIT") {
					var areAddedStPrChls = addedStCds.length > 0 || addedProdCds.length > 0 || addedDistChanCds.length > 0;
					var areRmvdStPrChls = removedStCds.length > 0 || removedProdCds.length > 0 || removedDistChanCds.length > 0;
                    if (areRmvdStPrChls) {
						var tempFormsToBeRemoved = [];
                        formsToBeRemoved = localScopeObj.getFormUpdateRequest(groupedFormStore, removedStCds, removedProdCds,
                            removedDistChanCds);
						// TBD : Need to provide logic to set life exp date.
                        if (removedStLifeEffDtMapArray.length) {
                            array.forEach(removedStLifeEffDtMapArray, function (removedStLifeEffMapObj, outerIndex) {
                                array.forEach(formsToBeRemoved, function (removedStRow, innerIndex) {
                                    if (removedStLifeEffMapObj.value === removedStRow.stCd) {
                                    	//console.debug("removedStLifeEffMapObj.expirationDate-->", removedStLifeEffMapObj.expirationDate);
                                    	removedStRow.lifeExprtnDt =  removedStLifeEffMapObj.expirationDate;
                                        //formsToBeRemoved = formsToBeRemoved.splice(innerIndex, 0);
                                        tempFormsToBeRemoved.push(removedStRow);
                                    } else {
										tempFormsToBeRemoved.push(removedStRow);
									}
                                });
                            });
							formsToBeRemoved = tempFormsToBeRemoved;
                        } 
                        // TBD :
                        console.debug("Trying to execute the case for removing any existing states, products and channels. ");
                        formRequest.formsToBeRemoved = formsToBeRemoved;
                        
						console.info('Trying to create the form update request...');
						var formData = groupedFormStore.data;
						if(formData && formData.length >= 1) {
						
							tempRemainStCds = [];
							tempRemainProdCds = [];
							tempRemaindistChanCds = [];
							
							tempRemainStCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousStateCds, removedStCds);
							console.debug('Remaining existing state codes are -->', tempRemainStCds);
							tempRemainProdCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousProductCds, removedProdCds);
							console.debug('Remaining existing product codes are -->', tempRemainProdCds);
							tempRemaindistChanCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousChannelCds, removedDistChanCds);
							console.debug('Remaining existing dist channel codes are -->', tempRemaindistChanCds);
							
							if(tempRemainStCds.length === 0 || tempRemainProdCds.length === 0 ||
								tempRemaindistChanCds.length ===0 ){
								formsToBeUpdated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, tempRemainStCds, tempRemainProdCds,
									tempRemaindistChanCds, "0", localScopeObj);
							} else {
								formsToBeUpdated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, tempRemainStCds, tempRemainProdCds,
									tempRemaindistChanCds, "1", localScopeObj);
								if (areAddedStPrChls) {
									formRequest.formsToBeUpdated = formsToBeUpdated;
								}
							}
							
							formRequest.formsToBeCreated = formsToBeUpdated; 
						} 
						if (areAddedStPrChls) {
							if(previousStateCds.length !== 0) {
								totalStCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousStateCds, 
									removedStCds).concat(addedStCds);
								console.debug('Final state codes after manipulation of removed and added -->', totalStCds);
								previousStateCds = totalStCds;
							} else {
								previousStateCds = addedStCds;
							}
							if (previousProductCds.length !== 0) {
								totalProdCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousProductCds, 
									removedProdCds).concat(addedProdCds);
								console.debug('Final prod codes after manipulation of removed and added -->', totalProdCds);
								previousProductCds = totalProdCds;
							} else {
								previousProductCds = addedProdCds;
							}
							if (previousChannelCds.length !== 0) {
								totaldistChanCds = localScopeObj.getRemaingElelementArrayAfterRemove(previousChannelCds, 
									removedDistChanCds).concat(addedDistChanCds);
								console.debug('Final dist channel codes after manipulation of removed and added -->', totaldistChanCds);
								previousChannelCds = totaldistChanCds;
							} else {
								previousChannelCds = addedDistChanCds;
							}
							if(previousStateCds.length === 0 || previousProductCds.length === 0 ||
								previousChannelCds.length ===0 ){
								formsToBeCreated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, previousStateCds, previousProductCds,
										previousChannelCds, "0", localScopeObj);
							} else {
								formsToBeCreated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, previousStateCds, previousProductCds,
										previousChannelCds, "1", localScopeObj);
							}
							//formsToBeCreated = localScopeObj.getDistinctFormObjects(formsToBeRemoved, formsToBeCreated);
							formRequest.formsToBeCreated = formsToBeCreated; 
						}
                        
                        //formRequest.formsToBeCreated = [];
                    } else if (areAddedStPrChls) {
						
                        console.debug("Trying to execute the case if newly added states and products and channels present ");
						var formData = groupedFormStore.data;
						if(formData && formData.length >= 1) {
							formsToBeUpdated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, previousStateCds, previousProductCds,
								previousChannelCds, "1", localScopeObj);
							//formsToBeUpdated = localScopeObj.getDistinctFormObjects(formsToBeUpdated, formsToBeUpdated);
							console.debug("formsToBeUpdated--> ", formsToBeUpdated);
							formRequest.formsToBeUpdated = formsToBeUpdated;
						}
						if(previousStateCds.length !== 0) {
							totalStCds = previousStateCds.concat(addedStCds);
							previousStateCds = totalStCds;
						} else {
							previousStateCds = addedStCds;
						}
                        if (previousProductCds.length !== 0) {
							totalProdCds = previousProductCds.concat(addedProdCds);
							previousProductCds = totalProdCds;
						} else {
							previousProductCds = addedProdCds;
						}
                        if (previousChannelCds.length !== 0) {
							totaldistChanCds = previousChannelCds.concat(addedDistChanCds);
							previousChannelCds = totaldistChanCds;
						} else {
							previousChannelCds = addedDistChanCds;
						}
                        formsToBeCreated = localScopeObj.prepareAndGetFormRequest(groupedFormStore, previousStateCds, previousProductCds,
                                previousChannelCds, "1", localScopeObj);
						//formsToBeCreated = localScopeObj.getDistinctFormObjects(formsToBeUpdated, formsToBeCreated);
                        if (commonAttrChangedFlag) {
                            formRequest.formsToBeCreated = formsToBeCreated;
                            console.debug("formsToBeCreated--> ", formsToBeCreated);
                        }

                        //formRequest.formsToBeCreated = formsToBeCreated;

                    } else if (commonAttrChangedFlag) {
						//In case of sngle form the form update and create would be same.
                        formsToBeUpdated = [];
                        formsToBeUpdated = groupedFormStore.data;
                        formRequest.formsToBeUpdated = formsToBeUpdated;
						formRequest.formsToBeCreated = formsToBeUpdated;

                    }
                    jsonString = JSON.stringify(formRequest);
                    console.debug("Input form update request:", jsonString);
                }

                return formRequest;

            },
			/**
             * This function retrieves the array which has final forms to be updated.
             */
            getDistinctFormObjects : function (toBeUpdatedFormArray, toBeAddedFormArray) {
                var localFormsTobeUpdated = [], outerIndex, innerIndex, updateObject, newObject;
                localFormsTobeUpdated = JSON.parse(JSON.stringify(toBeAddedFormArray));
                for (outerIndex = 0; outerIndex < toBeUpdatedFormArray.length; outerIndex++) {
                    updateObject = toBeUpdatedFormArray[outerIndex];
                    for (innerIndex = 0; innerIndex < localFormsTobeUpdated.length; innerIndex++) {
                        newObject = localFormsTobeUpdated[innerIndex];
                        if (updateObject.stCd ===  newObject.stCd &&
                                updateObject.mseProdCd === newObject.mseProdCd &&
                                    updateObject.distChanCd ===  newObject.distChanCd) {
                            localFormsTobeUpdated.splice(innerIndex, 1);
                            break;
                        }
                    }
                }
                return localFormsTobeUpdated;
            },
			/**
             * This method gives the remaining states/products/channels after removing the states/products/channels from existing group.
             */
            getRemaingElelementArrayAfterRemove : function (previousDataArray, removedDataArray) {
                var tempRemainingArray = [];
                array.forEach(previousDataArray, function (previousElement) {
                    if (!(array.some(removedDataArray, function (removedElement) {
                            return previousElement ===  removedElement;
                        }))) {
                        tempRemainingArray.push(previousElement);
                    }
                });
                return tempRemainingArray;
            },
            /**
            * This method forms the remove request with removed states/products/channels
            *
            */
            getFormUpdateRequest: function (groupedFormStore, stateCds, prodCds, distChanCds) {
                var tempStPrChnlRemMapArray = [], tempStBasedArray = [], tempProdBasedArray = [], tempDistChnlBasedArray = [];
                if (stateCds.length > 0) {
                    console.debug("stateCds.length > 0");
                    array.forEach(stateCds, function (stCd) {
                        groupedFormStore.query({stCd: stCd}).forEach(function (mapObj) {
                            mapObj.markForUpdate = "1";
                            tempStBasedArray.push(mapObj);
                            tempStPrChnlRemMapArray.push(mapObj);
                        });
                    });
                }
                if (prodCds.length > 0) {
                    console.debug("prodCds.length > 0");
                    array.forEach(prodCds, function (mseProdCd) {
                        groupedFormStore.query({mseProdCd: mseProdCd}).forEach(function (mapObj) {
                            mapObj.markForUpdate = "1";
                            tempProdBasedArray.push(mapObj);
                        });
                    });
                    array.forEach(tempProdBasedArray, function (prdBasedObj, i) {
                        if (!(array.some(tempStPrChnlRemMapArray, function (stPrChBasedObj) {
                                return stPrChBasedObj.stCd === prdBasedObj.stCd && stPrChBasedObj.mseProdCd === prdBasedObj.mseProdCd &&
                                    stPrChBasedObj.distChanCd === prdBasedObj.distChanCd;
                            }))) {
                            tempStPrChnlRemMapArray.push(prdBasedObj);
                        }
                    });
                    //var jsonString = JSON.stringify(tempStPrChnlRemMapArray);
                    //console.debug('tempStPrChnlRemMapArray at products:',  jsonString);
                }
                if (distChanCds.length > 0) {
                    console.debug("distChanCds.length > 0");
                    array.forEach(distChanCds, function (distChanCd) {
                        groupedFormStore.query({distChanCd: distChanCd}).forEach(function (mapObj) {
                            mapObj.markForUpdate = "1";
                            tempDistChnlBasedArray.push(mapObj);
                        });
                    });
                    //var jsonString = JSON.stringify(tempDistChnlBasedArray);
                    //console.debug('tempDistChnlBasedArray at channels:',  jsonString);

                    array.forEach(tempDistChnlBasedArray, function (distChnlBasedObj) {
                        if (!(array.some(tempStPrChnlRemMapArray, function (stPrChBasedObj) {
                                return stPrChBasedObj.stCd === distChnlBasedObj.stCd && stPrChBasedObj.mseProdCd === distChnlBasedObj.mseProdCd &&
                                    stPrChBasedObj.distChanCd === distChnlBasedObj.distChanCd;
                            }))) {
                            tempStPrChnlRemMapArray.push(distChnlBasedObj);
                        }
                    });
                    //var jsonString = JSON.stringify(tempStPrChnlRemMapArray);
                    //console.debug('tempStPrChnlRemMapArray at channels:',  jsonString);
                }

                return tempStPrChnlRemMapArray;
            },
            /**
            * This method creates the state product channel map object.
            */
            getPreparedObject : function (id, orgnlDocId, stCd, mseProdCd, distChanCd, markForUpdate, lifeExprtnDt) {
                var stPrdChnlMapObj = {};
                stPrdChnlMapObj.id = id;
                stPrdChnlMapObj.orgnlDocId = orgnlDocId;
                stPrdChnlMapObj.stCd = stCd;
                stPrdChnlMapObj.mseProdCd = mseProdCd;
                stPrdChnlMapObj.distChanCd = distChanCd;
                stPrdChnlMapObj.markForUpdate = markForUpdate;
                stPrdChnlMapObj.lifeExprtnDt = lifeExprtnDt;

                return stPrdChnlMapObj;
            },

            /**
            * This method populates the form request with all combinations of state product channel map object.
            */
            prepareAndGetFormRequest :  function (groupedFormStore, totalStCds, totalProdCds, totaldistChanCds, markForUpdate, localScopeObj) {
                var formsToBeCreatedOrUpdated = [];
                //Case 1: If state, product, channel is present
                if (totalStCds.length > 0) {
					if (totalProdCds.length > 0) {
                        if (totaldistChanCds.length > 0) {
                            array.forEach(totalStCds, function (stCd) {
								//console.debug('stCd-->', stCd);
                                array.forEach(totalProdCds, function (mseProdCd) {
									//console.debug('mseProdCd-->', mseProdCd);
                                    array.forEach(totaldistChanCds, function (distChanCd) {
										//console.debug('distChanCd-->', distChanCd);
										if(groupedFormStore) {
											var formData = groupedFormStore.data;
											if (markForUpdate === "1") {
												if(formData && formData.length >= 1) {
													var formObjs = groupedFormStore.query({stCd: stCd, mseProdCd: mseProdCd, distChanCd: distChanCd});
													if(formObjs && formObjs.length > 0) {
														formObjs.forEach(function (mapObj){
															formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
																mapObj.stCd, mapObj.mseProdCd, mapObj.distChanCd, markForUpdate));
														});
													} else {
														formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
																stCd, mseProdCd, distChanCd, markForUpdate));
													
													}
												}
											} else {
												formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, 
													mseProdCd, distChanCd, markForUpdate));
											}
										} else {
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, 
													mseProdCd, distChanCd, markForUpdate));
										}
                                    });
                                });
                            });

                        } else {
                            array.forEach(totalStCds, function (stCd) {
                                array.forEach(totalProdCds, function (mseProdCd) {
									if(groupedFormStore) {
										var formData = groupedFormStore.data;
										if (markForUpdate === "1") {
											if(formData && formData.length >= 1) {
												var formObjs = groupedFormStore.query({stCd: stCd, mseProdCd: mseProdCd});
												if(formObjs && formObjs.length > 0) {
													formObjs.forEach(function (mapObj){
														formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
														mapObj.stCd, mapObj.mseProdCd, null, markForUpdate));
													});
												} else {
													formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
															stCd, mseProdCd, null, markForUpdate));
												}
											}
											
										} else {
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, mseProdCd, null, markForUpdate));
										}
									} else {
										formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, mseProdCd, null, markForUpdate));
									}
                                });
                            });
                        }
                    } else if (totaldistChanCds.length > 0) {
                        array.forEach(totalStCds, function (stCd) {
                            array.forEach(totaldistChanCds, function (distChanCd) {
								if(groupedFormStore) {
									var formData = groupedFormStore.data;
									if (markForUpdate === "1") {
										
										if(formData && formData.length >= 1) {
											var formObjs = groupedFormStore.query({stCd: stCd, distChanCd: distChanCd});
											if (formObjs && formObjs.length > 0) {
												formObjs.forEach(function (mapObj){
													formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
													mapObj.stCd, null, mapObj.distChanCd, markForUpdate));
												});
											} else {
												formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														stCd, null, distChanCd, markForUpdate));
											}
										}
									} else {
										formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, null, distChanCd, markForUpdate));
									}
								} else {
									formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, null, distChanCd, markForUpdate));
								}
                            });
                        });

                    } else {
                        array.forEach(totalStCds, function (stCd) {
							if(groupedFormStore) {
								var formData = groupedFormStore.data;
								if (markForUpdate !== "1") {
									formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, stCd, null, null, markForUpdate));
								} else if (groupedFormStore) {
									if(formData && formData.length >= 1) {
										var formObj = groupedFormStore.query({stCd:stCd});
										if(formObj && formObj.length > 0) {
											formObj.forEach(function (mapObj){
												formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
														mapObj.stCd, null, null, markForUpdate));
											});
										} else {
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														stCd, null, null, markForUpdate));
										}
									}
									
								}
							} else {
								formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														stCd, null, null, markForUpdate));
							
							}
                        });
                    }
                } else if (totalProdCds.length > 0) {
                    if (totaldistChanCds.length > 0) {
                        array.forEach(totalProdCds, function (mseProdCd) {
                            array.forEach(totaldistChanCds, function (distChanCd) {
								if(groupedFormStore) {
									var formData = groupedFormStore.data;
									if (markForUpdate === "1") {
										if(formData && formData.length >= 1) {
											var formObjs = groupedFormStore.query({mseProdCd: mseProdCd, distChanCd: distChanCd});
											if(formObjs && formObjs.length > 0) {
												formObjs.forEach(function (mapObj){
													formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, 
														mapObj.orgnlDocId, null, mapObj.mseProdCd, mapObj.distChanCd, markForUpdate));
												});
											} else {
												formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														null, mseProdCd, distChanCd, markForUpdate));
											}
										}
									} else {
										formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, 
											null, mseProdCd, distChanCd, markForUpdate));
									}
								} else {
									formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, null, mseProdCd, 
										distChanCd, markForUpdate));
								}
                            });
                        });
                    } else {
                        array.forEach(totalProdCds, function (mseProdCd) {
							if(groupedFormStore) {
							var formData = groupedFormStore.data;
								if (markForUpdate !== "1") {
									formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, null, mseProdCd, null, markForUpdate));
								} else if (groupedFormStore) {
									
									if(formData && formData.length >= 1) {
										var formObjs = groupedFormStore.query({mseProdCd:mseProdCd});
										if(formObjs && formObjs.length > 0) {
											formObjs.forEach(function (mapObj){
												formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
														null, mapObj.mseProdCd, null, markForUpdate));
											});
										} else {
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														null, mseProdCd, null, markForUpdate));
										}
									}
									
								}
							} else {
								formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
														null, mseProdCd, null, markForUpdate));
							}
                        });
                    }
                } else if (totaldistChanCds.length > 0) {
                    array.forEach(totaldistChanCds, function (distChanCd) {
						if(groupedFormStore) {
							var formData = groupedFormStore.data;
							if (markForUpdate !== "1") {
								formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null, null, null, distChanCd, 
									markForUpdate));
							} else if (groupedFormStore) {
								
								if(formData && formData.length >= 1) {
									var formObjs = groupedFormStore.query({distChanCd:distChanCd});
									if(formObjs && formObjs.length > 0) {
										formObjs.forEach(function (mapObj){
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(mapObj.id, mapObj.orgnlDocId,
													null, null, mapObj.distChanCd, markForUpdate));
										});
									} else {
											formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
													null, null, distChanCd, markForUpdate));
									}
								}
							}
						} else {
							formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
													null, null, distChanCd, markForUpdate));
						}
                    });
                } else {
					if(groupedFormStore) {
						var formData = groupedFormStore.data;
						if (formData && formData.length >= 1) {
							formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
										null, null, null, markForUpdate));
						}
					} else {
						formsToBeCreatedOrUpdated.push(localScopeObj.getPreparedObject(null, null,
										null, null, null, markForUpdate));
					}
				}
                return formsToBeCreatedOrUpdated;
            },
            getOverlapMsgDiv: function (overlapAlertMsg, overlapForms) {
                
				var overlapStr = "", overlapBufferStr = "", parentDiv, overLapMsgDiv, 
					overLapDiv, mainDiv;
				mainDiv = domConstruct.create("div");
				parentDiv = domConstruct.create("div");
				overLapMsgDiv = domConstruct.toDom('<div>'+overlapAlertMsg+'<br><br></div>');
				domStyle.set(overLapMsgDiv, 'font-weight', 'bold');
				domStyle.set(overLapMsgDiv, {fontSize:"14pt"});
				domConstruct.place(overLapMsgDiv,parentDiv);
				
				array.forEach(overlapForms, function (form) {
					overlapStr = '';
					var lifeEffDt ; 
					if (form.lifeEffectiveDate) {
						lifeEffDt = Function._isoDateFormatter(form.lifeEffectiveDate);
					} else {
						lifeEffDt = "  ";
					}
					overlapStr = overlapStr + '<b> Form #: </b>' + form.formNum + '<b> Rev Date: </b>' + (form.formRevDate ? form.formRevDate:"  ") +
							'<b> Life Effective Date:</b>' + lifeEffDt +' <b> Life Expiration Date:</b>' + Function._isoDateFormatter(form.lifeExpirationDate) +'<br>' ;
					overlapBufferStr = overlapBufferStr + overlapStr;
					
                });
				overLapDiv = domConstruct.toDom('<div>'+overlapBufferStr+'</div>');
				domStyle.set(overLapDiv, 'width', '800px');
				domStyle.set(overLapDiv, 'height', '400px');
				domStyle.set(overLapDiv, 'overflow-y', 'scroll');
				domConstruct.place(overLapDiv, parentDiv);
				domConstruct.place(parentDiv, mainDiv);
				
                return mainDiv;
            }
        };
    });
