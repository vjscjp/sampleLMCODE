define([
    'intern!object',
    'intern/chai!assert',
    'models/forms/formCreateOrModifyModal.js',
	'dojo/store/Memory'
], function (registerSuite, assert, formCreateOrModifyModal, Memory) {
    "use strict";

    // global testing vars
    // var packageVersionStore = dojo.fromJson(packageVersionStoreJson);

    registerSuite({
        name: 'FormsModalTestSuite',

        /**
		 * Test case1: Create a brand new form with states products channels combinations.
		----
		formBrandNewCreateTestCase : function() {
			var groupedFormArray, groupedFormMemStore, previousStateCds = [], previousProductCds = [], previousChannelCds = [], optionType = "FORM_CREATE", commonFormAttrChangedFlag = false,
			selectedSts = ["1", "2"], 
			selectedProdCds = ["0000000018", "0000000104"],
			selectedChannels = ["3", "8"], 
			commonAttributes;
			var removedStLifeEffDtMapArray = [ ];
			
			var groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("Create a brand new form with states products channels combinations.");
    	},
		/**
		 * Test case 2: update form with added/removed states/products/channels combinations.
		----
		formUpdateWithNewlyAddedAndExistingRemovedTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = ["0000000018", "0000000104"], 
			previousChannelCds = ["3", "8"], 
			selectedSts = ["1","4"],
			selectedProdCds = ["0000000018", "0000000001"],
			selectedChannels = ["3", "1043400001"],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			var removedStLifeEffDtMapArray = [ 
										   { stCd: "1", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "2", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "4", lifeExprtnDt : "2015-07-20T00:00:00.000Z" }
										 ];
			
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update request is -->", response);
			console.debug("update form with added/removed states/products/channels combinations.");
			
    	}, 
		
		/**
		 * Test case 3: update form with only added/removed states.
		----
		formUpdateWithOnlyAddingStateAndExistingStateRemovedTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			//previousProductCds = ["0000000018", "0000000104"], 
			previousProductCds = [], 
			previousChannelCds = [], 
			//selectedSts = ["1","4"],
			selectedSts = ["1","4"],
			selectedProdCds = [],
			selectedChannels = [],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"1","mseProdCd":null,"distChanCd":null,"markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":null,"distChanCd":null,"markForUpdate":"0"}];
				
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			
			var removedStLifeEffDtMapArray = [ 
										   { stCd: "1", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "2", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "4", lifeExprtnDt : "2015-07-20T00:00:00.000Z" }
										 ];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update form with added/removed states/products/channels combinations.");
			
    	}, 
		/**
		 * Test case 4: update form with only added/removed states.
		----
		formUpdateWithAddingStateProdAndExistingStateProdRemovedTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = [], 
			//previousProductCds = [], 
			previousChannelCds = [], 
			
			selectedSts = ["4"],
			selectedProdCds = [],
			selectedChannels = ["3", "1043400001"],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":null,"markForUpdate":"1"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":null,"markForUpdate":"1"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":null,"markForUpdate":"1"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":null,"markForUpdate":"1"}];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			
			var removedStLifeEffDtMapArray = [];
										 
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update form with added/removed states/products/channels combinations.");
    	}, 
		
		
		/**
		 * Test case 7: Update form with if any common attribute changes on form.
		----
		formUpdateWithCommonAttrTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore,  previousStateCds = [], previousProductCds = [], previousChannelCds = [],	selectedSts = [], selectedProdCds = [], selectedChannels = [], 
			optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true, commonAttributes;
			
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"1"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"1"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"1"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"1"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"1"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"1"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"1"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"1"}];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			
			var removedStLifeEffDtMapArray = [];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Update form with if any common attribute changes are done is successful.");
			console.debug("Updated form with if any common attribute changes.");
    	},
		/**
		* Test case 8: update form with all removing all existing  states, products, channels.
		----
		formUpdateWithAllRemovedTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = ["0000000018", "0000000104"], 
			previousChannelCds = ["3", "8"], 
			//selectedSts = ["1","4"],
			selectedSts = [],
			selectedProdCds = [],
			selectedChannels = [],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			
			var removedStLifeEffDtMapArray = [ 
										   { stCd: "1", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "2", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "4", lifeExprtnDt : "2015-07-20T00:00:00.000Z" }
										 ];
			//case 2: if removed states and added states exists
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update form with added/removed states/products/channels combinations.");
			
    	}, 
		/**
		* Test case 9: update form with unordered distribution channels.
		----
		formUpdateWithAddedUnOrderedTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = ["0000000104"], 
			previousChannelCds = ["3", "8"], 
			//selectedSts = ["1","4"],
			selectedSts = [],
			selectedProdCds = ["0000000104"],
			selectedChannels = [],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				];
			var removedStLifeEffDtMapArray = [ ];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts.sort(), previousProductCds, selectedProdCds.sort(), previousChannelCds, selectedChannels.sort(),
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update form with added/removed states/products/channels combinations.");
			
    	},
		/**
		 * Test case 10: update form with completely added states/products/channels combinations.
		----
		formUpdateWithNewlyAddedStatesProductsChannelsTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = ["0000000018", "0000000104"], 
			previousChannelCds = ["3", "8"], 
			selectedSts = ["1", "2","4"],
			selectedProdCds = ["0000000018", "0000000104", "0000000001"],
			selectedChannels = ["3", "8", "1043400001"],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			var removedStLifeEffDtMapArray = [ ];
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"1"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"1"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"1"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"1"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"1"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"1"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"1"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"1"}];
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			//assert(response === 1 , "update form with added/removed states/products/channels combinations.");
			console.debug("update request is -->", response);
			console.debug("update form with added/removed states/products/channels combinations.");
			
    	},
		/**
		 * Test case 6: Update form with newly added states/products/channels combinations.
		----
		formUpdateWithNewStPrChTestCase : function() {
		
			var response, commonAttributes = {}, groupedFormArray, groupedFormMemStore,  
			previousStateCds = ["1", "2"], previousProductCds = ["0000000104"], previousChannelCds = ["3", "8"], 
			selectedSts = ["1", "2"], selectedProdCds = ["0000000104"], selectedChannels = ["3", "8", "1043400001"],
			optionType = "FORM_VIEW_OR_EDIT", 
			commonFormAttrChangedFlag = true;
			var removedStLifeEffDtMapArray = [ ];
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Updated form with newly added states/products/channels.");
			console.debug("Updated form with newly added states/products/channels.");
    	},

		/**
		 * Test case 5: Update form with only removing existing states/products/channels combinations.
		----
		formUpdateWithRemoveExistingTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"], 
			previousProductCds = ["0000000018", "0000000104"], 
			previousChannelCds = ["3", "8"], 
			
			selectedSts = ["1"],
			selectedProdCds = ["0000000018"],
			selectedChannels = ["3"],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			
			groupedFormArray = [{"id":11202341,"orgnlDocId":11202341,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202339,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202338,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202336,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202335,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202334,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			var removedStLifeEffDtMapArray = [ 
										   { stCd: "1", lifeExprtnDt : "2015-07-20T00:00:00.000Z" },
										   { stCd: "2", lifeExprtnDt : "2015-07-20T00:00:00.000Z" }
										 ];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Update form with only removing existing states/products/channels combinations.");
			console.debug("Update form with only removing existing states/products/channels combinations.");
		},	
		/**
		 * Test case 5: Update form with only removing existing states/products/channels combinations.
		 ----
		formUpdateWithRemoveOneExistingTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", commonFormAttrChangedFlag = true,
			previousStateCds = ["1"], 
			previousProductCds = [], 
			previousChannelCds = ["3"], 
			
			selectedSts = [],
			selectedProdCds = [],
			selectedChannels = ["3"],
			commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			
			groupedFormArray = [
				{"id":11202337,"orgnlDocId":11202337,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"}
				];
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			var removedStLifeEffDtMapArray = [ 
										   { value: "1", expirationDate : "2015-07-20T00:00:00.000Z" }
										 ];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Update form with only removing existing states/products/channels combinations.");
			console.debug("Update form with only removing existing states/products/channels combinations.");
		},
		/**
		 * Test case 5: Update form with only removing existing states/products/channels combinations.
		 */
		/* formUpdateWithAddExistingTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore, optionType = "FORM_VIEW_OR_EDIT", 
				/*optionType = "FORM_CREATE",  commonFormAttrChangedFlag = true,
			previousStateCds = ["1", "2"],
			previousProductCds = ["0000000018", "0000000104"], 
			previousChannelCds = ["3", "8"], 
			//selectedSts =  ["1","2"],
			selectedSts =  ["1"],
			selectedProdCds = ["0000000018","0000000104"],
			selectedChannels = ["3", "8"];
			
			var removedStLifeEffDtMapArray = [{value: "2", expirationDate : "2015-07-20T00:00:00.000Z" }];
			var commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			
			groupedFormArray = [
				{"id":11202341,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}]; 
			
			
				
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			var removedStLifeEffDtMapArray = [ 
										   { value: "1", expirationDate : "2015-07-20T00:00:00.000Z" }
										 ];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Update form with only removing existing states/products/channels combinations.");
			console.debug("Update form with only removing existing states/products/channels combinations.");
		}, */
		/**
		 * Test case 5: Update form with only removing existing states/products/channels combinations.
		 *
		formUpdateWithRemovingExistingTestCase : function() {
		
			var response, groupedFormArray, groupedFormMemStore,  
			    //optionType = "FORM_VIEW_OR_EDIT",
				optionType = "FORM_CREATE",  commonFormAttrChangedFlag = true,
			previousStateCds = [],
			//previousStateCds = ["1"],
			//previousProductCds = ["0000000018"], 
			previousProductCds = [], 
			previousChannelCds = [],
			//previousChannelCds = ["3"], 
			selectedSts = ["1"],
			//selectedSts = ["1","2"],
			//selectedSts =   ["1","2"],
			//selectedProdCds = ["0000000018", "0000000104"],
			selectedProdCds = ["0000000018"], 
			selectedChannels = ["3"];
			//selectedChannels = []
			var removedStLifeEffDtMapArray = [{value: "2", expirationDate : "2015-07-20T00:00:00.000Z" }];
			var commonAttributes = {"formNum":"Tc319_1","classtnCd":"1043400056","subclassificationCd":"1043400504","docFormType":{"cd":"1043400001"},"allChannelSelected":"false","extlRecInd":"0","processType":"save"};
			//case 2: if removed states and added states exists
			groupedFormArray = [
				
			
			groupedFormArray = [
				{"id":11202341,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202340,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202339,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202338,"orgnlDocId":11202340,"stCd":"2","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"},
				{"id":11202337,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000104","distChanCd":"3","markForUpdate":"0"},
				{"id":11202336,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000018","distChanCd":"3","markForUpdate":"0"},
				{"id":11202335,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000104","distChanCd":"8","markForUpdate":"0"},
				{"id":11202334,"orgnlDocId":11202340,"stCd":"1","mseProdCd":"0000000018","distChanCd":"8","markForUpdate":"0"}];
			
			
			groupedFormMemStore = new Memory({data: groupedFormArray, idProperty : 'id'});
			var removedStLifeEffDtMapArray = [ 
										   { value: "1", expirationDate : "2015-07-20T00:00:00.000Z" }
										 ];
			response = formCreateOrModifyModal.getFormRequest(groupedFormMemStore, commonAttributes, previousStateCds, 
						selectedSts, previousProductCds, selectedProdCds, previousChannelCds, selectedChannels,
						optionType, commonFormAttrChangedFlag, removedStLifeEffDtMapArray);
			console.debug("update request is -->", response);
			//assert(response === 1 , "Update form with only removing existing states/products/channels combinations.");
			console.debug("Update form with only removing existing states/products/channels combinations.");
		},
		/**
		 *  
		 */
			
		getSampleRequest: function (){
			//formCreateOrModifyModal.getSampleRequest();
			console.debug('Success in test case');
		}
		
    });
});