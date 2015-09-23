define(["dojo/_base/declare"], function(declare){
	
	//var  _localApp = null;
	
	return declare(null, {
	
	    constructor: function() {
	    	console.debug("FrmsUtils Constructor::");
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
		/**
		 * Check for Local host vs other host
		 */	
		_localhostCheck:function(){
			if (document.location.hostname === "localhost" || document.location.hostname === "127.0.0.1"){
				 return true;
			}
			return false;
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
		 * Set Stores for reference table data
		 * add proxy or test to store depending on localhost or if ?localjson=true in URL parameters
		 */	
		setJsonRestEndpointTable:function(storeObject){
	        
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
		* Initialize all the fields in the container (view or widget)
		*/
		initializeFields:function(fieldsConfig, container){
			if(fieldsConfig && container){
				for(var field in fieldsConfig){
					//set labels for all form Fields
					var fldConfig= fieldsConfig[field];
					var fld=container[field];
					if(fld){
						//initialize form fields with default properties
						var def_properties = fldConfig.properties;
						if(def_properties){
							 for(var prop in def_properties){
								fld.set(prop,def_properties[prop],false);
							 }
						}
					}
				}
			}
		},
		/**
		* Converter used to transform true - 1 and false - 0
		*/
		ZeroOneConverter:{
			format: function(value){
				return (value==='1')?true:false;
			},
			parse: function(checked){
				return (checked)?'1':'0';
			}
		},
		
	});
});
