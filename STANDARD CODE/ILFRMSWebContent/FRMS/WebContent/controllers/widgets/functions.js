define([
	"dojo/dom","dojo/dom-construct","dojo/dom-style", "dojo/_base/array",
	"dojo/on", "dojo/date/locale",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dojo/_base/lang"

    
], function(
	dom, domConstruct, domStyle, array,
	on,locale,
	declare, _WidgetBase, _TemplatedMixin, lang
) {
	
	/**
	 * This is a list of helper functions
	 */

	
	return declare('app.Functions',null,{
			// variables
		
			// functions
        
			/**
			 * Check for Local host vs other host
			 */	
			_localhostCheck:function(){
				if (document.location.hostname == "localhost" || document.location.hostname == "127.0.0.1"){
					 return true;
				}
				return false;
			},
			
			
            /**
			 * return non proxy or test
			 */	
			_returnUnSetEndpoint:function(storeObject){
				var unsetProx = String(storeObject.__proto__.target).replace("test/","");
                return unsetProx;
			},
			/**
			 * This method is used for to set json rest store.
			 * add proxy or test to store depending on localhost or if ?localjson=true in URL parameters
			 */	
			_setJsonRestEndpoint:function(storeObject){
				var target = storeObject.target;                
                storeObject.headers.preventCache = "true";
                storeObject.headers.Pragma = "no-cache";
                storeObject.headers.Expires = "-1"; 
				
				if (this._useLocalJSON()) {
					
					if (target.indexOf("test") === -1){
						storeObject.target = 'test' + storeObject.target;
                        storeObject.__proto__.target = storeObject.target;
                    }
					
				} else if(this._localhostCheck()) {
					if (target.indexOf("proxy") === -1){
						storeObject.target = '/proxy' + storeObject.target;
                        storeObject.__proto__.target = storeObject.target;                        
                        storeObject.headers.SM_USER = "n0249211";
                        storeObject.__proto__.headers = {SM_USER:"n0249211"};
                    }
				}
				//console.debug(storeObject.target);
				
			},
			/**
			 * This method is used for to set json rest store.
			 * add proxy or test to store depending on localhost or if ?localjson=true in URL parameters
			 */	
			_getJsonRestEndpoint:function(storeObject) {			
				var target = storeObject.target;
			    storeObject.headers.preventCache = "true";
                storeObject.headers.Pragma = "no-cache";
                storeObject.headers.Expires = "-1"; 
                
				if (this._useLocalJSON()) {
					
					if (target.indexOf("test") === -1) {
						storeObject.target = 'test' + storeObject.target;
					}
				} else if (this._localhostCheck()) {
					if (target.indexOf("proxy") === -1) {
						storeObject.target = '/proxy' + storeObject.target;
                        storeObject.headers.SM_USER = "n0249211";
                        storeObject.__proto__.headers = {SM_USER:"n0249211"};
					}
				}
				return storeObject;
				
			},
			/**
			 * Set Stores for reference table data
			 * add proxy or test to store depending on localhost or if ?localjson=true in URL parameters
			 */	
			_setJsonRestEndpointTable:function(storeObject){
                
                var target = String(storeObject.target);
				if (this._useLocalJSON()) {
                    
					if (target.indexOf("tableName=") != -1) {
						storeObject.target = storeObject.target.replace("?tableName=", '/');
                        storeObject.target = storeObject.target.replace("&sourceName", '/?sourceName');
                        storeObject.target = storeObject.target.replace(' ', '_');
					}
				}
                this._setJsonRestEndpoint(storeObject);
				
			},
			
            
            _createRefDataOptions:function(store,object){
                dojo.forEach(store, function(itemTmp){
                    var opt = document.createElement('option');
                    opt.value = itemTmp.sourceCode;
                    opt.innerHTML = itemTmp.sourceDescription;
                    //dijit.byId(object).appendChild(opt);
                    object.appendChild(opt);
                });
            },
        
            _createRefDataOptionList:function(store){
                var myList = [];
                dojo.forEach(store, function(itemTmp){
                    var myListItem = {};
                    myListItem.value = itemTmp.sourceCode;
                    myListItem.label = itemTmp.sourceDescription;
                    myList.push(myListItem);
                });
                return myList;
            },
        
            _createRefDataList:function(store){
                var myList = [];
                dojo.forEach(store, function(itemTmp){
                    var myListItem = {};
                    myListItem.id = itemTmp.sourceCode;
                    myListItem.name = itemTmp.sourceDescription;
                    myList.push(myListItem);
                });
                return myList;
            },
        
            _getJsonRefDataMemoryStore:function(updateItem){
                var memoryStore = updateItem.memoryStore;
                var objectID = updateItem.objectID;
                var digitType = updateItem.digitType;
                
                // check if Store data has already been called -- NOTE: anything with .referenceData should be READ ONLY
                if(memoryStore.data.length > 0)
                    return memoryStore.data;
                // return makes it a differed .query for promis.all
				return memoryStore.attachedJsonRest
					.query({}, {
						start : 10,
						count : 10,
						sort : [ {
							attribute : "referenceData.targetCode",
							ascending : true
						} ]
					})
					.then(
						function(jsonRefDataRestResultsObj) {
							//console.debug("Successful retrieval of reference data :", jsonRefDataRestResultsObj.referenceData);
							memoryStore.setData(jsonRefDataRestResultsObj.referenceData);
                            
                            return jsonRefDataRestResultsObj.referenceData;
						},
						function(error) {
							if (error.status == 500
									|| error.status == 404) {
								console
										.error('Error in retreving '+memoryStore+' type data..');
							}
						});	
			},
        
            _getJsonRefDataMemory:function(updateItem){
                var memoryStore = updateItem.memoryStore;
                
                // maybe validate memoryStore.data ??
				memoryStore.attachedJsonRest
					.query({}, {
						start : 10,
						count : 10,
						sort : [ {
							attribute : "referenceData.targetCode",
							ascending : true
						} ]
					})
					.then(
						function(jsonRefDataRestResultsObj) {
							//console.debug("Successful retrieval of reference data :", jsonRefDataRestResultsObj.referenceData);
							memoryStore.setData(jsonRefDataRestResultsObj.referenceData);
                            
						},
						function(error) {
							if (error.status == 500
									|| error.status == 404) {
								console
										.error('Error in retreving state type data..');
							}
						});	
			},
        
			/**
			 * check for url param ?localjson=true
			 */
			_useLocalJSON:function()
			{
				// false for live
				if(this._getURLParam("localjson") == "true"){
					return true;
				}else{
					return false;
				}
			},	
		
					
			
			/**
			 * Pasrse URL paramateurs
			 */
			_getURLParam:function(name)
			{	
				name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
				  var regexS = "[\\?&]"+name+"=([^&#]*)";
				  var regex = new RegExp( regexS );
				  var results = regex.exec( window.location.href );
				  if( results == null )
				    return null;
				  else
				    return results[1];
			},
        
            _urlFromObject:function(obj, prefix, notFirst) {
              var str = [];
              for(var p in obj) {
                if (obj.hasOwnProperty(p)) {
                  var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                  str.push(typeof v == "object" ?
                    this._urlFromObject(v, k, true) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
              }
                if(typeof notFirst != "undefined" && notFirst){
                    return str.join("&");
                }
              return "?" + str.join("&");
            },
        
            // Dates
            _returnDateObj:function(localeDate){
                // IE11 doesn't like the seconds, take them out if its not a date
                if( typeof localeDate != "undefined" && (! (localeDate instanceof Date))){
                    // has seconds if its from the database
                    // for "2015-01-01 00:00:00"
                    localeDate = localeDate.toString().replace(' 00:00:00','T00:00:00');
                    // for "2015-01-01T05:00:00.000+0000"
                    localeDate = localeDate.toString().replace('.000+0000','');

                    var newDate = new Date(localeDate);
                }else{
                    var newDate = new Date(localeDate);
                }
                if(newDate.getHours()){ // i it doesn't equal zero fix the timezone
                    // fix time zone from database - now it won't jump a day
                    newDate.setTime( newDate.getTime() + newDate.getTimezoneOffset()*60*1000 );   
                }
                
                return newDate;

            },

            _isoDateFormatter:function(value){
                var date = this._returnDateObj(value);
                return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date
                        .getFullYear());
            },
        
            _isoDateFormatterShort:function(value){
                var date = this._returnDateObj(value),
                     pad = function(num) {
			            norm = Math.abs(Math.floor(num));
			            return (norm < 10 ? '0' : '') + norm;
			        };
                var year = date.getFullYear().toString().substr(2,2);
                return ( pad(date.getMonth() + 1) + '/' + pad(date.getDate()) + '/' + year);
            },
        
            _isoDateTimeFormatter:function(value){
                var date = this._returnDateObj(value);
                var pad = function(num) {
			            norm = Math.abs(Math.floor(num));
			            return (norm < 10 ? '0' : '') + norm;
			        };
                return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() +" "+pad(date.getHours())+":"+pad(date.getMinutes()) );
                
            },
        
            _isFuture:function(value){
                var date = Date.UTC(value);
                var todays = Date.UTC(new Date());
                if(date > todays)
                    return true
                return false;
            },
        
            isBigerDate:function(start,end){
                var startDate = Date.UTC(start);
                var endDate = Date.UTC(end);
                if(startDate > endDate)
                    return true
                return false;
            },

			/**
			 * make a div visible
			 */
			_showDiv: function(divId)
			{
				//console.log("_showDiv " + divId);
				dom.byId(divId).style.display="block";
			},	
			
			
			/**
			 * hide a div
			 */
			_hideDiv: function(divId)
			{
				//console.log("_hideDiv " + divId);
				dom.byId(divId).style.display="none";
			},
			
			
			/**
			 * remove content from a div
			 */
			_clearDiv: function(divId)
			{
				dom.byId(divId).innerHTML="";
			},
        
            // -- HTML Interactions -- //
			
            /**
             * Gets the current index for <select> options
             */
            getSelectedIndex:function(selectItem){
                // look for selected option, else load first
                var searchByIndex = null;
                var i = 0;
                if(typeof selectItem != "undefined"){
                    //selectItem.options[selectItem.selectedIndex].value;

                    dojo.forEach(selectItem.options, function(option){
                        if(option.selected == true)
                            searchByIndex = i;
                        i = i + 1;
                    });
                }
                // loading current, wich is last
                if(searchByIndex == null) searchByIndex = (i-1);

                return searchByIndex;
            },
        
            // -- Date Interactions -- //    
        
			/**
			 * Formatting the date with UTC.
			 */
			formatLocalDate:function(date) {
			    var now = this._returnDateObj(date),
			        tzo = -now.getTimezoneOffset(),
			        dif = tzo >= 0 ? '+' : '-', pad;
                
                pad = function(num) {
                    if( num == 0) return '00';
                    norm = Math.abs(Math.floor(num));
                    return (norm < 10 ? '0' : '') + norm;
                };
                var hours =  pad(now.getHours()); 
				return now.getFullYear() 
			        + '-' + pad(now.getMonth()+1)
			        + '-' + pad(now.getDate())+' '+
			        /* + 'T' */ + hours.toString()
			        + ':' + pad(now.getMinutes()) 
			        + ':' + pad(now.getSeconds());
			        /*+ dif + pad(tzo / 60) 
			        + ':' + pad(tzo % 60);*/
			},
        
            /**
			 * Formatting the date with UTC.
			 */
            formatLocalDateOnly:function(date) {
                var pad;
                var now = this._returnDateObj(date);
                pad = function(num) {
                    if( num == 0) return '00';
                    norm = Math.abs(Math.floor(num));
                    return (norm < 10 ? '0' : '') + norm;
                };
                return now.getFullYear() 
			        + '-' + pad(now.getMonth()+1)
			        + '-' + pad(now.getDate())
            },
        
			isEmpty :function(str) {
				return (!str || 0 === str.length);
			},
        
           /**
			* Formatting the date with Hour Min (mm/dd/yyyy hh:mm)
            * USE _isoDateTimeFormatter as this DOES THE _returnDateObj to FIX IE11 DATE ISSUES
			*/
            formatDateHourMin:function(date) {
                if(date != null) {
                    var now = new Date(date); 
                    if(now != null && isNaN(now)) { 
                        now = new Date(date.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2"));  
                    } 
                    var pad = function(num) {
                        if( num == 0) return '00';
                        norm = Math.abs(Math.floor(num));
                        return (norm < 10 ? '0' : '') + norm;
                    }; 
                    return pad(now.getMonth()+1)  + '/' + pad(now.getDate())   + '/' + now.getFullYear() 
                        + " " + pad(now.getHours()).toString() + ':' + pad(now.getMinutes()).toString();
                }
            },
        
			isEmpty :function(str) {
				return (!str || 0 === str.length);
			},
            /**
			 * Add one day to date
			 */
            plusDay :function(date, num) {
                myDate = this._returnDateObj(date);
                myDate.setDate(myDate.getDate() + num );
                return myDate;
            },
        
            formatUTCDate : function(date) {
                var now = date,
                    tzo = -now.getTimezoneOffset(),
                    dif = tzo >= 0 ? '+' : '-',
                    pad = function (num) {
                        var norm = Math.abs(Math.floor(num));
                        return (norm < 10 ? '0' : '') + norm;
                    };
                return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now
                    .getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + dif + pad(tzo /
                    60) + ':' + pad(tzo % 60);
            },
			/**
			* Post method
			*/
			getXhrArguments : function (requestUrl, request, smUser) {
				var jsonParsedRequest, xhrArgs;
				jsonParsedRequest = JSON.stringify(request);
				xhrArgs = {
					url : requestUrl,
					postData: jsonParsedRequest,
					handleAs: "json",
					sync:true,
					headers: lang.mixin({
						"Content-Type": "application/json",
						Accept: "application/javascript, application/json",
						"SM_USER": smUser, preventCache: "true",
						Pragma: "no-cache", Expires: "-1" 
					})
				};
				return xhrArgs;
			},
			
            /**
			* Processing export date from Grids CVS export plugin
            * Created by David Sheppard 4-15-2015
			*/
            exportGrid: function(str, fileName){
                var aLink = document.createElement('a');
                var encodedUri = 'data:application/vnd.ms-excel,' + encodeURIComponent(str);
                //var fileName = 'Package_Search_Results.xls';
                document.body.appendChild(aLink);                        


                var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
                if (navigator.msSaveBlob) { // IE 10+
                    navigator.msSaveBlob(blob, fileName);
                }else{
                    aLink.href = encodedUri;
                    aLink.download = fileName;
                    aLink.click();
                }        
            },
            
            /**
			* Used for handling REST error functions, takes in error object
            * Created by David Sheppard 4-15-2015
			*/
            handleError: function(error){
                console.debug(error.response.status, error);
                switch (error.status) {
                case 403:
                    Notice.showError(JSON.parse(error.responseText).statusDetailMsg);
                    break;
                case 404:
                case 406:
                case 415:
                case 500:
                    Notice.showError('Problem while contacting server. Please contact the Adminstrator.');
                    break;
                default:
                    Notice.showError('Problem while contacting server. Please contact the Adminstrator.');    
                }  
            },
        
            // -- View and Conroller Functions -- //
            doAfterActivate: function(){
                //Notice.doneLoading();
            },
        
            doBeforeDeactivate: function(){
                //Notice.doneLoading();
            },
        
			// Errors and display from Form Search, should possibly be its own widget
        
            /**
             * This method disables or enables the label style
             */
            disableOrEnableErrMsg:function(selectedVal, label) {
                if (selectedVal) {
                    domAttr.remove(query(label)[0], "style");
                    domClass.remove(displayErrorDiv, 'error');
                    displayErrorDiv.innerText = "";
                } else {
                    domStyle.set(dojo.query(label)[0], errorStyleClass);
                }
            },
            /**
             * This method disables or enables the label style
             */
            disableOrEnableErrMsgForCMSelect: function(selectedVal, label) {
                if (selectedVal.length > 0) {
                    domAttr.remove(query(label)[0], "style");
                    domClass.remove(displayErrorDiv, 'error');
                    displayErrorDiv.innerText = "";
                } else {
                    domStyle.set(dojo.query(label)[0],
                        errorStyleClass);
                }
            },
            /**
            * This function clear the error message
            */
            disableErrMsg: function(noFocusClass, tempSearchFldClass, tempFormNumClass) {
                query(noFocusClass).forEach(function (node, index, arr) {
                    dijit.byNode(node).set("required", false);
                });
                query(tempSearchFldClass).forEach(function (node, index, arr) {
                    domAttr.remove(node, "style");
                });
                domAttr.remove(query(tempFormNumClass)[0], "style");
                displayErrorDiv.innerText = "";
                displayInfoDiv.innerText = "";
                domClass.remove(displayErrorDiv, 'error');
                domClass.remove(displayInfoDiv, 'info');

            },
            /**
            * This method gives the label valud object for given array of objects
            */
            getCodeArrayObjs: function(arrayObjects) {
                var labelValArray = [], labelValueObj = {}, cd = {};
                array.forEach(arrayObjects, function (code) {
                    labelValueObj.cd = code;
                    labelValArray.push(labelValueObj);
                    labelValueObj = {};
                });
                return labelValArray;
            },
            /**
            * This method gives the label value object.
            */
            getLabelValueObjs: function(arrayObjects) {
                var labelValArray = [], labelValueObj = {}, label = {}, value = {};
                array.forEach(arrayObjects, function (arrayObject) {
                    labelValueObj.label = arrayObject.targetDescription;
                    labelValueObj.value = arrayObject.targetCode;
                    labelValArray.push(labelValueObj);
                    labelValueObj = {};
                });
                return labelValArray;
            },
        
            hasPackageAccess: function(){
                if(this._localhostCheck()){
                    return true;
                }
                return hasUserPkgWriteAccess;
            },
            
            /**
            * Transition view controloler
            */
            transitionTo: function(e, targetView, paramSettings) {
                var transOpts = {
                        target : targetView,
                        params : paramSettings
                    };
                this.app.transitionToView(e.target, transOpts);		
            },
			/**
			*This method gives the label valud object for given array of objects
			*/
			getLabelValueObj: function(arrayObjects) {

				var labelValArray = [], labelValueObj = {}, cd = {};
				array.forEach(arrayObjects, function (code) {
					labelValueObj.cd = code;
					labelValArray.push(labelValueObj);
					labelValueObj = {};
				});
				return labelValArray;
			}
			
	});	
});