//Predefined tokens
/*global define, console, dijit, dojox, dojo, alert : true*/
//Custom Stores
/*global  cachePackagesStore: true*/
/**
 * This model will have all the operations related to form association to package.
 */
define(["dojo/store/Memory",  "controllers/widgets/functions.js", "dojo/promise/all",
    "dojo/_base/array", "dojo/date", "dojo/Deferred", "dojo/store/Cache"],
    function (Memory, Functions, all, array, dojoDate, Deferred, Cache) {
        "use strict";
        var Function = new Functions();

        return {
            getVersionsToBeUpdated: function (asstnEffDt, asstnExpDt, packageVersions, formDetailsArray) {

                console.debug('packageVersions-->', packageVersions);
                var localScopeObj, verLength, lastPkgVerPos, firstPkgVerStartDate, lastPkgVerStartDate,
                    lastPkgVerEndDate, selectedPkgCode, versionsToBeUpdated = [], updatedVersion = {},
                    effectiveDate = {}, expirationDate = {}, currentVersion = {}, documents = {},
                    lastPkgDocsDfrd = [],  defferedObj, isSingleVersion = false, previousVersion = {},
                    newVersion = {}, id = {}, isNewVersionfitInSameVer = false, deffered231Obj,
                    deffered232Obj, isAsstnExpDtNotEntered = false;

                localScopeObj = this;
                verLength = (packageVersions.length);
                lastPkgVerPos = verLength - 1;

                console.debug('Selected package asn eff date-->', asstnEffDt);
                console.debug('Selected package asn exp date-->', asstnExpDt);

                firstPkgVerStartDate =  new Date(packageVersions[0].effectiveDate);
                console.debug('firstPkgVerStartDate-->', firstPkgVerStartDate);

                lastPkgVerStartDate =  new Date(packageVersions[lastPkgVerPos].effectiveDate);
                console.debug('lastPkgVerStartDate-->', lastPkgVerStartDate);

                if (firstPkgVerStartDate.getTime() === lastPkgVerStartDate.getTime()) {
                    lastPkgVerStartDate = firstPkgVerStartDate;
                    isSingleVersion = true;
                }

                lastPkgVerEndDate =  new Date(packageVersions[lastPkgVerPos].expirationDate);
                console.debug('lastPkgVerEndDate-->', lastPkgVerEndDate);

                selectedPkgCode = packageVersions[0].pkgCd;
                console.debug('selectedPkgCode-->', selectedPkgCode);

                //Case 1 : if selected effective date is greater than the last version effective date.
                if (isSingleVersion) {

                    if ((asstnEffDt > lastPkgVerStartDate) &&
                            (asstnExpDt < lastPkgVerEndDate || asstnExpDt > lastPkgVerEndDate)) {

                        defferedObj = new Deferred();
                        //updatedVersion = {};
                        console.debug('case1 :if selected effective date is greater than or less than the last version effective date.');

                        //updatedVersion.effectiveDate = lastPkgVerStartDate;
                        //updatedVersion.expirationDate = dojoDate.add(asstnEffDt, "day", -1);


                        lastPkgDocsDfrd = localScopeObj.loadVersionDetails(selectedPkgCode, packageVersions[lastPkgVerPos].id);
                        all({ lastPkgDocsDfrd: lastPkgDocsDfrd}).then(function (results) {
                            var lastPkgDocs, changeInd, sequence, jsonString, lastPkgDocsCopied, pkgDocuments = {},
                                currentVersion = {}, newVersion = {};

                            lastPkgDocs = localScopeObj.getDocsWithRequiredInput(results.lastPkgDocsDfrd.pkgListDocuments);

                            if (lastPkgDocs.length) {

                                sequence = lastPkgDocs[lastPkgDocs.length - 1].seqNum;
                                //updatedVersion.pkgDocuments = lastPkgDocs;
                                //versionsToBeUpdated.push(updatedVersion);

                                currentVersion.effectiveDate = asstnEffDt;
                                if (!asstnExpDt) {
                                    currentVersion.expirationDate = lastPkgVerEndDate;
                                } else {
                                    currentVersion.expirationDate = asstnExpDt;
                                }
                                currentVersion.pkgDocuments = localScopeObj.getDocsWithFormDetails(formDetailsArray, sequence, lastPkgDocs);
                                versionsToBeUpdated.push(currentVersion);

                                /* newVersion.effectiveDate = dojoDate.add(asstnExpDt, "day", 1);
                                newVersion.expirationDate = lastPkgVerEndDate;
                                newVersion.pkgDocuments = lastPkgDocs;

                                versionsToBeUpdated.push(newVersion */
                                defferedObj.resolve(versionsToBeUpdated);
                            }

                        });
                        return defferedObj;
                    }

                } else {
                    //Case 2: If selected dates are spawns over the package effective and end dates.
                    effectiveDate = {};
                    expirationDate = {};

                    defferedObj = new Deferred();

                    if (!asstnExpDt) {
                        asstnExpDt = lastPkgVerEndDate;
                        isAsstnExpDtNotEntered = true;
                    }
                    array.forEach(packageVersions, function (version) {

                        console.debug('version-->', version);
                        var versionStartDate, versionEndDate, case1deferredObj, case2deferredObj, case231deferredObj,
                            case232ResultObj;
                        versionStartDate = new Date(version.effectiveDate);
                        versionEndDate = new Date(version.expirationDate);

                        //Case 2.1 : if selected association start date and end date exactly matches the version
                        if ((asstnEffDt.getTime() === versionStartDate.getTime()) &&
                                (asstnExpDt.getTime() === versionEndDate.getTime())) {

                            defferedObj = new Deferred();
                            console.debug('Case 2.1 :selected association start date and end date exactly matches the version');
                            currentVersion.effectiveDate = asstnEffDt;
                            currentVersion.expirationDate = asstnExpDt;

                            case1deferredObj = localScopeObj.loadVersionDetails(selectedPkgCode, version.id);
                            if (case1deferredObj) {
                                all({ case1deferredObj: case1deferredObj}).then(function (results) {
                                    var retrievedPkgDocs = [], tempPkgDocs = [], sequence, pkgDocuments = {};
                                    retrievedPkgDocs = localScopeObj.getDocsWithRequiredInput(results.case1deferredObj.pkgListDocuments);
                                    sequence = retrievedPkgDocs[retrievedPkgDocs.length - 1].seqNum;
                                    currentVersion.pkgDocuments = localScopeObj.getDocsWithFormDetails(formDetailsArray, sequence, retrievedPkgDocs);
                                    versionsToBeUpdated.push(currentVersion);
                                    defferedObj.resolve(versionsToBeUpdated);
                                });
                            }

                        //Case 2.2 : if selected association start date and end date spawns in a single version.
                        } else if ((asstnEffDt.getTime() > versionStartDate.getTime()) &&
                                (asstnExpDt.getTime() <= versionEndDate.getTime())) {

                            defferedObj = new Deferred();
                            console.debug('Case 2.2 : if selected association start date and end date spawns in a single version.');

                            //previousVersion.effectiveDate = versionStartDate;
                            //previousVersion.expirationDate =  dojoDate.add(asstnEffDt, "day", -1);

                            currentVersion.effectiveDate = asstnEffDt;
                            currentVersion.expirationDate = asstnExpDt;

                            /* if (!isAsstnExpDtNotEntered) {
                                newVersion.effectiveDate = dojoDate.add(asstnExpDt, "day", 1);
                                newVersion.expirationDate = versionEndDate;
                            } */
                            case2deferredObj = localScopeObj.loadVersionDetails(selectedPkgCode, version.id);
                            if (case2deferredObj) {
                                all({ case2deferredObj: case2deferredObj}).then(function (results) {
                                    var pkgDocs, sequence, pkgDocuments = {};

                                    pkgDocs = localScopeObj.getDocsWithRequiredInput(results.case2deferredObj.pkgListDocuments);
                                    console.debug('version results for adding new version within the same version..',
                                        pkgDocs);

                                    previousVersion.pkgDocuments = pkgDocs;
                                    sequence = pkgDocs[pkgDocs.length - 1].seqNum;
                                    console.debug('pkgDocs-->', pkgDocs);
                                    currentVersion.pkgDocuments = localScopeObj.getDocsWithFormDetails(formDetailsArray, sequence, pkgDocs);
                                    //newVersion.pkgDocuments = pkgDocs;

                                    //versionsToBeUpdated.push(previousVersion);
                                    versionsToBeUpdated.push(currentVersion);
                                    /* if (!isAsstnExpDtNotEntered) {
                                        versionsToBeUpdated.push(newVersion);
                                    } */
                                    defferedObj.resolve(versionsToBeUpdated);
                                });
                            }

                            isNewVersionfitInSameVer = true;
                        }
                        //Case 2.3 : if selected association start date and end date spawns over multiple versions.
                        if (!isNewVersionfitInSameVer) {

                            if ((asstnEffDt.getTime() > versionStartDate.getTime()) &&
                                    (asstnEffDt.getTime() <= versionEndDate.getTime()) &&
                                    (asstnExpDt.getTime() >= versionEndDate.getTime())) {

                                deffered231Obj = new Deferred();

                                currentVersion.effectiveDate = asstnEffDt;
                                //previousVersion.effectiveDate = versionStartDate;
                                //previousVersion.expirationDate =  dojoDate.add(asstnEffDt, "day", -1);

                                case231deferredObj = localScopeObj.loadVersionDetails(selectedPkgCode, version.id);
                                if (case231deferredObj) {
                                    all({ case231deferredObj: case231deferredObj}).then(function (results) {
                                        var pkgDocs = localScopeObj.getDocsWithRequiredInput(results.case231deferredObj.pkgListDocuments);
                                        console.debug('selected association start date and end date spawns over multiple versions...',
                                            pkgDocs);
                                        deffered231Obj.resolve(pkgDocs);

                                    });
                                }
                            } else if ((asstnEffDt.getTime() < versionStartDate.getTime()) &&
                                    (asstnExpDt.getTime() > versionStartDate.getTime() &&
                                    asstnExpDt.getTime() <= versionEndDate.getTime())) {

                                //deffered232Obj = new Deferred();

                                currentVersion.expirationDate = asstnExpDt;
                                //newVersion.effectiveDate = dojoDate.add(asstnExpDt, "day", 1);;
                                //newVersion.expirationDate = versionEndDate;

                                /* case232ResultObj = localScopeObj.loadVersionDetails(selectedPkgCode, version.id);
                                if (case232ResultObj) {
                                    all({ case232ResultObj: case232ResultObj}).then(function (results) {
                                        var pkgDocs = localScopeObj.getDocsWithRequiredInput(results.case232ResultObj.pkgListDocuments);
                                        console.debug('selected association start date and end date spawns over multiple versions...',
                                            pkgDocs);

                                        deffered232Obj.resolve(pkgDocs);

                                    });
                                } */
                            }
                           
                        }
                    });
                    if (!isNewVersionfitInSameVer) {
                        all({

                            deffered231Obj: deffered231Obj,
                            //deffered232Obj: deffered232Obj

                        }).then(function (results) {

                            var pkgDocuments = [], preVerResSeq, prePkgDocs = [];

                            prePkgDocs = results.deffered231Obj;
							console.debug('prePkgDocs-->', prePkgDocs);
                            previousVersion.pkgDocuments = prePkgDocs;
                            preVerResSeq = prePkgDocs[prePkgDocs.length - 1].seqNum;
                            currentVersion.pkgDocuments = localScopeObj.getDocsWithFormDetails(formDetailsArray, preVerResSeq, prePkgDocs);
                            //newVersion.pkgDocuments = results.deffered232Obj;

                            //versionsToBeUpdated.push(previousVersion);
                            versionsToBeUpdated.push(currentVersion);
                            //versionsToBeUpdated.push(newVersion);

                            defferedObj.resolve(versionsToBeUpdated);

                        });
                    }
                    return defferedObj;
                }

            },
            /**
             * This method is used to load the selected package version details.
             */
            loadVersionDetails: function (code, id) {
                var returnDefered = null, tempTarget;
                tempTarget = cachePackagesStore.__proto__.target;
                returnDefered = cachePackagesStore.query(code + "/versions/" + id).then(function (results) {
                    return results;
                }, function (error) {
                    alert("Service not available");
                    console.log("ERROR: " + error.response.text);
                    console.log(error);
                });
                cachePackagesStore.__proto__.target = tempTarget;
                return returnDefered;
            },
			/**
			 *This method is used to load the package versions.
			 */
			loadPackageVersions: function(code){
				var loadedVersionsResults, tempTarget;

				tempTarget = cachePackagesStore.__proto__.target;
				//cachePackagesStore.__proto__.target = cachePackagesStore.__proto__.target + pkgCd + '/versions' ;
				loadedVersionsResults = cachePackagesStore.query(code + '/versions').then(function(results) {
					return results.pkgVersionHeaders;
				}, function(error){
					alert("Service not available");
					console.error("ERROR: " + error.response.text);
				});
				cachePackagesStore.__proto__.target = tempTarget;
				return loadedVersionsResults;
			},
			/**
			 * This method adds the selected forms details at package versions.
			 */
			getDocsWithFormDetails : function (formDetailsArray, sequence, pkgDocs) {
				//Adding new form details.
				var tempPkgDocs, tempSeq, seqNum = {};
				tempPkgDocs = JSON.parse(JSON.stringify(pkgDocs));
				tempSeq = parseInt(sequence);
				array.forEach(formDetailsArray , function(formDetails) {
					formDetails.changeInd = 'A';
					tempSeq = tempSeq + 1;
					formDetails.seqNum = tempSeq;
					tempPkgDocs.push(formDetails);
				});

				return tempPkgDocs;
			},
			/**
			 * Converting the retrieved packages documents in order to support the update functionality.
			 */
			getDocsWithRequiredInput : function (retrievedPkgDocs) {
				//Adding new form details
				//{"docId":"11201981","origDocId":"11201981", "dateTypeCd":null, "seqNum":"001", "changeInd": "C"},
				var tempPkgDocs = [], pkgDoc, docId = {}, origDocId = {}, dateTypeCd = {}, seqNum = {}, changeInd = {};
				array.forEach(retrievedPkgDocs , function(doc) {

					pkgDoc = {};
					pkgDoc.docId = doc.id;
					pkgDoc.origDocId = doc.origDocId;
					pkgDoc.dateTypeCd = doc.docDtTypeCd;
					pkgDoc.seqNum = doc.seqNum;
					pkgDoc.changeInd = "";

					tempPkgDocs.push(pkgDoc);
				});
				return tempPkgDocs;
			},
			/**
			 *  This method is used to update the forms association with the packages.
			 */
			savePkgVersionAndGetDeferredObj :function (pkgCd, updatePkgReqObj) {

				var tempTarget = null, msgObj = {}, status = {}, detailMsg = {}, defferedObj;

				defferedObj = new Deferred();
				console.debug('Trying to save the association of the selected forms and package .');
				tempTarget = cachePackagesStore.__proto__.target;
				cachePackagesStore.__proto__.target = cachePackagesStore.__proto__.target + pkgCd + '/versions' ;
				console.debug('cachePackagesStore.target', cachePackagesStore);

				cachePackagesStore.put(updatePkgReqObj, {})
					.then(function (saveResResultsObj) {

					console.debug('Successfully associated the selected forms to packages..', saveResResultsObj);
					msgObj.status = 'SUCCESS';
					msgObj.detailMsg = 'Successfully associated the selected forms to the package:';
					defferedObj.resolve(msgObj);
				},
				function (error) {
					console.debug(error.response.status);
					msgObj.status = 'FAILURE';
					switch (error.response.status) {
					case 400:
						msgObj.detailMsg = JSON.parse(error.responseText).statusDetailMsg;
						break;
					case 500:
						msgObj.detailMsg = 'Error in  associating the selected forms to the package:';
						break;
					default:
						msgObj.detailMsg = 'Error in  associating the selected forms to the package:';
						break;
					}
					console.error('Error in  associating the selected forms to packages....', error);
					defferedObj.resolve(msgObj);
				});
				cachePackagesStore.__proto__.target = tempTarget;
				return defferedObj;
			}

		};
});
