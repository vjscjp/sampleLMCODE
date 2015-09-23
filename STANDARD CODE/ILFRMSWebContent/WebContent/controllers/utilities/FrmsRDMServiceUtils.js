define([
    "dojo/_base/declare", "dojo/promise/all", "dojo/dom-class", "dojo/_base/array", "dojo/Deferred"
], function(
    declare, all, domClass, array, Deferred
){
		var _selfObject = this;
		return declare(null, {
			/**
			 * Constructor
			 */
		    constructor: function(){
		    	console.debug("FRMSRDMServiceUtils Constructor::");
		    	_selfObject = this;
		    	this.populateCurrentUserMemoryStore();
		    	this.populateProductMemoryStore();
		    	this.populateClassficationMemoryStore();
		    	this.populateSubClassficationMemoryStore();
		    	this.populateStateMemoryStore();
		    	this.populateStateTypeMemoryStore();
		    	this.populateTimingReqMemoryStore();
		    	this.populateTimingCdMemoryStore();
		    	this.populateDocContentTypeMemoryStore();
		    	this.populateDistChannelMemStote();
		    	this.populateSecurityLevelMemoryStore();
		    	this.populateDocFormTypeMemStore();
                this.populateBusinessFunMemStore();
		    },
	    
		    /**
		     * This method populates the current user memory store
		     */
		    populateCurrentUserMemoryStore: function () {
		    	var currentUserMemStore, currentUserJsonRestObj;
			    
		    	console.info("Trying to get logged in user details...");
			    currentUserMemStore = FRMS.loadedStores.currentUserMemory;
			    currentUserJsonRestObj = FRMS.loadedStores.jsonUserDetails;
			    FRMS.FrmsUtils.setJsonRestEndpointTable(currentUserJsonRestObj);
			    FRMS.defferedUserDetai = currentUserJsonRestObj.query('currentuser', {}).then(function (response) {
					if(response && response.user) {
						console.debug("response-->", response);
						var userDetails = response.user;
						console.debug('Successful in getting current user details..', userDetails);
			            currentUserMemStore.setData(userDetails);
			            SM_USER = currentUserMemStore.data.userIdentifier;
			            console.debug('The logged in user is::', SM_USER);
						HAS_USER_FORM_W_ACCESS = currentUserMemStore.data.formsWriteIndicator === "1";
			            HAS_USER_RECORD_W_ACCESS = currentUserMemStore.data.recordsWriteIndicator === "1";
			            HAS_USER_PKG_W_ACCESS = currentUserMemStore.data.packagesWriteIndicator === "1";                        
			            HAS_USER_PROMOTE_ACCESS = currentUserMemStore.data.frmsPromoteIndicator === "1";
			            HAS_USER_ADMIN_ACCESS = currentUserMemStore.data.userAdministratorIndicator === "1";
			            FRMS.loadedStores.currentUserMemStore = currentUserMemStore;
						//domClass.remove(dijit.byId("appTabs_tablist_UsersTab").domNode, "l_hidden"); 
			        }                    
			    }, function (error) {
			        if (error.status === 500 || error.status === 404) {
						console.error("Error in retrieving the user details data..");
			        }
			        HAS_USER_FORM_W_ACCESS = false;
			        HAS_USER_RECORD_W_ACCESS = false;
			        HAS_USER_PKG_W_ACCESS= false;                        
			        HAS_USER_PROMOTE_ACCESS = false;
			        HAS_USER_ADMIN_ACCESS = false;
					domClass.add(dijit.byId("appTabs_tablist_UsersTab").domNode, "l_hidden");
			    });
			   
		    },
		    /**
		     * This method populates the products deferred object
		     */
		    populateProductMemoryStore : function (){
		    	
		    	var prodMemoryStore, jsonRestProdStore;
		    	
		        prodMemoryStore = FRMS.loadedStores.prodMemoryStore;
		        jsonRestProdStore = FRMS.loadedStores.jsonProdRestDetails;
		 	    FRMS.FrmsUtils.setJsonRestEndpointTable(jsonRestProdStore);
		 	    
		 	    FRMS.defferedProdMemoryStore = jsonRestProdStore.query({}, {}).then(function(results) { 
		 	    	var productResults = results;
		         	console.debug('Successful retrieval of products..', productResults);
		         	prodMemoryStore.setData(productResults);
		         	_selfObject._setAllProductStores(productResults);
		         	FRMS.loadedStores.prodMemoryStore = prodMemoryStore;
		 	    }, function (error) {
		 	    	 console.error('Error in retreving the products..');
		 	    });
		    	
		    },
		    /**
		     *  This method populates the classification deferred object
		     */
		    populateClassficationMemoryStore : function (){
		    	var jsonClassiftnStore, clasftnMemStore;
		    	jsonClassiftnStore = FRMS.loadedStores.jsonClassiftnRestDetails;
                clasftnMemStore = FRMS.loadedStores.clasftnMemStore;
			    FRMS.FrmsUtils.setJsonRestEndpointTable(jsonClassiftnStore);
			    FRMS.deferredClasftnMemStore = this._queryEndPoint(jsonClassiftnStore, clasftnMemStore);
			},
		    /**
		     * This method populates the sub classification deferred object
		     */
		    populateSubClassficationMemoryStore : function () {
		    	var jsonSubclassftnJsonStore, subClassMemStore;
			    // Getting subclassification elements
			    jsonSubclassftnStore = FRMS.loadedStores.jsonSubclassftnRestDetails;
                subClassMemStore = FRMS.loadedStores.subClassMemStore;
			    FRMS.FrmsUtils.setJsonRestEndpointTable(jsonSubclassftnStore);
			    FRMS.deferredSubClasftnMemStore = this._queryEndPoint(jsonSubclassftnStore, subClassMemStore);;
			   
		    },
		    /**
		     * This method populates the state elements deferred object
		     */
		    populateStateMemoryStore : function () {
		    	var jsonStateStore, stateMemStore;
		    	
		    	jsonStateStore = FRMS.loadedStores.jsonStateRestDetails;
                stateMemStore = FRMS.loadedStores.stateMemStore;
			    FRMS.FrmsUtils.setJsonRestEndpointTable(jsonStateStore);
			    FRMS.deferredStateMemStore = this._queryEndPoint(jsonStateStore, stateMemStore);
                
                all({deferredStateMemStore:FRMS.deferredStateMemStore}).then(function(results){
                    var newStates = results.deferredStateMemStore;
                    var i = 0;
                });
		    },
		    /**
		     * This method populates the state type elements deferred object
		     */
		    populateStateTypeMemoryStore : function () {
		    	var jsonStateTypeStore, stateTypeMemStore;
			    jsonStateTypeStore = FRMS.loadedStores.jsonStateTypeRestDetails;
                stateTypeMemStore = FRMS.loadedStores.stateTypeMemStore;
			    FRMS.FrmsUtils.setJsonRestEndpointTable(jsonStateTypeStore);
			    FRMS.deferredStateTypeMemoryStore = this._queryEndPoint(jsonStateTypeStore, stateTypeMemStore);
                
		    },
		    /**
		     * This method populates the timing requirement elements deferred object
		     */
		    populateTimingReqMemoryStore :  function () {
		    	 var timingReqJsonStore, timingReqMemStore;
		    	 timingReqMemStore = FRMS.loadedStores.timingReqMemStore;
		         timingReqJsonStore =  FRMS.loadedStores.jsontimingReqRestDetails;
		         FRMS.FrmsUtils.setJsonRestEndpointTable(timingReqJsonStore);
		         FRMS.deferredTimingReqMemoryStore = this._queryEndPoint(timingReqJsonStore, timingReqMemStore);
		    },
		    /**
		     *  This method populates the timing code elements deferred object
		     */
		    populateTimingCdMemoryStore: function() {
		    	var timingCdJsonStore, timingCdMemStore;
		        timingCdMemStore = FRMS.loadedStores.timingCdMemStore;
		        timingCdJsonStore =  FRMS.loadedStores.jsontimingCdRestDetails;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(timingCdJsonStore);
		        FRMS.deferredTimingCdMemStore = this._queryEndPoint(timingCdJsonStore, timingCdMemStore);
		    },
		    /**
		     * This method populates the document content type elements deferred object
		     */
		    populateDocContentTypeMemoryStore :  function (){
		    	var docContentTypeMemStore, docContentTypeJsonStore;
		    	docContentTypeMemStore = FRMS.loadedStores.docContentTypeMemStore;
		        docContentTypeJsonStore =  FRMS.loadedStores.jsonDocContentTypeRestDetails;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(docContentTypeJsonStore);
		        FRMS.deferredContentTypeMemStore = this._queryEndPoint(docContentTypeJsonStore, docContentTypeMemStore);
		    },
		    /**
		     * This method populates the distribution channel elements deferred object
		     */
		    populateDistChannelMemStote : function (){
		    	var distChanJsonStore, distChanMemStore;
		        distChanJsonStore =  FRMS.loadedStores.jsonDistChanRestDetails;
                distChanMemStore = FRMS.loadedStores.distChanMemStore;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(distChanJsonStore);
		        FRMS.deferredDistChanJsonStore = this._queryEndPoint(distChanJsonStore,distChanMemStore);
		       
		    },
		    /**
		     * This method populates the security level elements deferred object
		     */
		    populateSecurityLevelMemoryStore : function (){
		    	var secLvlCdJsonStore, secLvlCdMemStore;
		        secLvlCdJsonStore = FRMS.loadedStores.jsonsecLvlCdRestDetails;
                secLvlCdMemStore = FRMS.loadedStores.secLvlCdMemStore;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(secLvlCdJsonStore);
		        FRMS.deferredsecLvlCdJsonStore = this._queryEndPoint(secLvlCdJsonStore, secLvlCdMemStore);
		        
                // NPPI is set from sercurity level code
                all({store:FRMS.deferredsecLvlCdJsonStore}).then(function(results){
                    _selfObject.populateNppiPcciStore(results.store);
                });
		    },
		    /**
		     * Populates NPPI PCCI based on Security Level store
		     */
            populateNppiPcciStore:function(secLvlCdMemStore){
                var arrValue, labelValueObj = {}, arrLength, nppiPcciDesgns = [];
                array.forEach(secLvlCdMemStore, function (nppiPcci) {
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
                    // save to memorey store
                   FRMS.loadedStores.nppiPciDesnMemStore.setData(nppiPcciDesgns);
                }  
            },
            
		    /**
		     * This method populates the document form type  elements deferred object.
		     */
		    populateDocFormTypeMemStore : function (){
		    	var jsonDocFormTypeStore, docFormTypeMemoryStore;
		    	jsonDocFormTypeStore = FRMS.loadedStores.jsonDocFormTypeRestDetails;
                docFormTypeMemoryStore = FRMS.loadedStores.docFormTypeMemoryStore;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(jsonDocFormTypeStore);
		        FRMS.deferredDocFormTypeMemStore = this._queryEndPoint(jsonDocFormTypeStore, docFormTypeMemoryStore);
		        
		    },
		    /**
		     * This method populates the business function elements deferred object.
		     */
		    populateBusinessFunMemStore : function () {
		    	var jsonBusFunStore, businessFunMemStore;
		    	jsonBusFunStore =  FRMS.loadedStores.jsonBusiFunRestDetails;
                businessFunMemStore = FRMS.loadedStores.businessFunMemStore;
		        FRMS.FrmsUtils.setJsonRestEndpointTable(jsonBusFunStore);
		        FRMS.deferredBusinessFunMemStore = this._queryEndPoint(jsonBusFunStore, businessFunMemStore);
		        
		    },
            
            /**
             * This method is used to trigger the .query for each JsonRest Endpoints and set the associated Memory Store -  used for referenceData Only
             * Returns a Promise / Differed
             */	
            _queryEndPoint:function(jsonEndpoint, localMemoryStore){
                    var returnDeffered;
                    returnDeffered = jsonEndpoint.query().then(
                            function(results) {
                                localMemoryStore.setData(results.referenceData);

                                return results.referenceData;
                            },
                            function(error) {
                                if (error.status == 500 || error.status == 404) {
                                    console.error('Error in retreving '+memoryStore+' type data..');
                                }
                            });	
                    return returnDeffered;
            },
            
		    /**
		     * This method populates the all the required product stores.
		     */
		    _setAllProductStores : function(prodResults) {
				
		    	console.debug('Setting all product details to the respective product stores..');
				
		        var labelValueObj = {}, productLob = [], productTypes = [], prodSeriesNms = [], prodCSOMTTable = [], 
		            prodSubTypes = [], productNames = [], productMktNames = [], productLobHash = {}, 
		            prodTypeHash = {}, prodSeriesHash = {}, prodCSOMTableHash = {},
		            prodsubTypeHash = {}, productNamesHash = {}, productMrktNmHash = {},
		            productLOBMemStore, productTypesMemStore, productSeriesMemStore, productCSOMTMemStore, 
		            productSubTypeMemStore, productNamesMemStore, productMktNamesMemStore;
		
		        array.forEach(prodResults, function (prodObj) {
		            var prodlob, prodTypeName, prodSeriesName, prodCSOMTableName, prodsubTypeName,
		                prodNm, prodMarketingName;
		            prodlob = prodObj.lineOfBusinessName;
		            if (!productLobHash[prodlob]) {
		                labelValueObj.label = prodlob;
		                labelValueObj.value = prodlob;
		                productLob.push(labelValueObj);
		                productLobHash[prodlob] = prodObj;
		                labelValueObj = {};
		            }
		            prodTypeName = prodObj.typeName;
		            if (!prodTypeHash[prodTypeName]) {
		                labelValueObj.label = prodTypeName;
		                labelValueObj.value = prodTypeName;
		                productTypes.push(labelValueObj);
		                prodTypeHash[prodTypeName] = prodObj;
		                labelValueObj = {};
		
		            }
		            prodSeriesName = prodObj.seriesName;
		            if (!prodSeriesHash[prodSeriesName]) {
		                labelValueObj.label = prodSeriesName;
		                labelValueObj.value = prodSeriesName;
		                prodSeriesNms.push(labelValueObj);
		                prodSeriesHash[prodSeriesName] = prodObj;
		                labelValueObj = {};
		            }
		            prodCSOMTableName = prodObj.cSOMortalityTableName;
		            if (!prodCSOMTableHash[prodCSOMTableName]) {
		                labelValueObj.label = prodCSOMTableName;
		                labelValueObj.value = prodCSOMTableName;
		                prodCSOMTTable.push(labelValueObj);
		                prodCSOMTableHash[prodCSOMTableName] = prodObj;
		                labelValueObj = {};
		
		            }
		            prodsubTypeName = prodObj.subTypeName;
		            if (!prodsubTypeHash[prodsubTypeName]) {
		                labelValueObj.label = prodsubTypeName;
		                labelValueObj.value = prodsubTypeName;
		                prodSubTypes.push(labelValueObj);
		                prodsubTypeHash[prodsubTypeName] = prodObj;
		                labelValueObj = {};
		            }
		
		            prodNm = prodObj.name;
		            if (!productNamesHash[prodNm]) {
		                labelValueObj.label = prodNm;
		                labelValueObj.value = prodNm;
		                productNames.push(labelValueObj);
		                productNamesHash[prodNm] = prodObj;
		                labelValueObj = {};
		            }
		
		            prodMarketingName = prodObj.marketingName;
		            if (!productMrktNmHash[prodMarketingName]) {
		                labelValueObj.label = prodMarketingName;
		                labelValueObj.value = prodMarketingName;
		                productMktNames.push(labelValueObj);
		                productMrktNmHash[prodMarketingName] = prodObj;
		                labelValueObj = {};
		            }
		        });
		        
		        productLOBMemStore = FRMS.loadedStores.productLOBMemStore;
		        productLOBMemStore.setData(productLob);
		        FRMS.defferedProdLOBStore = new Deferred().resolve(productLOBMemStore);
		        
		        productTypesMemStore = FRMS.loadedStores.productTypeMemStore;
		        productTypesMemStore.setData(productTypes);
		        FRMS.defferedProdTypeStore = new Deferred().resolve(productTypesMemStore);
		        
		        productSeriesMemStore = FRMS.loadedStores.productSeriesMemStore;
		        productSeriesMemStore.setData(prodSeriesNms);
		        FRMS.defferedProdSeriesStore = new Deferred().resolve(productSeriesMemStore);
		        
		        productCSOMTMemStore = FRMS.loadedStores.productCSOMTMemStore;
		        productCSOMTMemStore.setData(prodCSOMTTable);
		        FRMS.defferedProdCSOMTStore = new Deferred().resolve(productCSOMTMemStore);
		        
		        productSubTypeMemStore = FRMS.loadedStores.productSubTypeMemStore;
		        productSubTypeMemStore.setData(prodSubTypes);
		        FRMS.defferedProdSubTypeStore = new Deferred().resolve(productSubTypeMemStore);
		        
		        productNamesMemStore = FRMS.loadedStores.productNamesMemStore;
		        productNamesMemStore.setData(productNames);
		        FRMS.defferedProdNamesStore = new Deferred().resolve(productNamesMemStore);
		        
		        productMktNamesMemStore = FRMS.loadedStores.productMktNamesMemStore;
		        productMktNamesMemStore.setData(productMktNames);
		        FRMS.defferedProdMktNamesStore = new Deferred().resolve(productMktNamesMemStore);
		        
		        console.debug('Completion of setting all product details to the respective deffered stores..');
			}
		});
});