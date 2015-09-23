/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true */
/* global headers:true, ldapMembers:true */

define([
	"dojo/dom","dojo/dom-construct",
    "dojo/dom-style", "dojo/_base/array",
	"dojo/on", "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dojo/_base/lang",
    "dojo/request",
	"dojo/request/xhr"
    ], 
function(
	dom, domConstruct, domStyle, array,
	on,	declare, _WidgetBase, _TemplatedMixin, lang, request, xhr
    ) 
{
	/**
	 * This is a list of helper functions and utilities used to all Life Dojo Projects
	 */
    
	return declare('app.Utils',null,
	{
        /**
		 * Parses the header information
		 */
        _parseResponseHeaders:function(headerStr)
        {
            headers = [];
            
            if( headerStr ) 
            {
                var headerPairs = headerStr.split('\u000d\u000a');
                for (var i = 0; i < headerPairs.length; i++)
                {
                    var headerPair = headerPairs[i];
                    var index = headerPair.indexOf('\u003a\u0020');
                    if(index > 0) 
                    {
                        var key = headerPair.substring(0, index);
                        var val = headerPair.substring(index + 2);
                        var my = { };
                        my.name = key;
                        my.value = val ? val.trim() : val;
                        headers.push(my);
                        // headers[key] = val;
                    }
                }
            }
            
            return headers;
        },

        /**
		 * Get headers.  This should be called once from the main.js.
         * The resule will create a global variable called "headers",
         * which can be access to pull information as needed.
		 */
		getHeadersAndLDAPGroups:function()
		{
            var self = this;
			this._log("getHeaders start");

            var promise = request.get("./index.html", { });
 
            // Use promise.response.then, NOT promise.then
            promise.response.then(function(response)
            {
                self._log("==>Get Headers Response:");
                self._log(response);
                self._log("==>Headers:");
                var temp = response.xhr.getAllResponseHeaders();
                self._log(temp);
                self._log( self._parseResponseHeaders(temp) );
                self._log("==>ldapMembers:");
                self._log( self.getLDAPGroupsFromHeader() );
            });
            
			this._log("getHeaders end");
		},
        
        /**
		 * Get LDAP groups from headers
		 */
		getLDAPGroupsFromHeader:function()
		{
			this._log("getLDAPGroupsFromHeader start");
            ldapMembers = {};

            if( headers && headers.length )
            {
                var i = 0;
                for( i = 0; i < headers.length; i++ )
                {
                    if( headers[i].name === "Set-Cookie" && headers[i].value !== null &&
                        headers[i].value.indexOf("memberof=") >= 0 )
                    {
                        var cookieList = headers[i].value.split(";");

                        var j = 0;
                        var memberof = "";
                        for( j =0; j < cookieList.length; j++)
                        {
                            var tcookie = cookieList[j].trim();
                            if( tcookie.indexOf("memberof=") >= 0 )
                            {
                                memberof = tcookie;
                                break;
                            }
                        }
                        
                        memberof =  memberof.substring( "memberof=".length );

                        var memberArray = memberof.split("^");
                        var keyValArray = [];

                        for( j =0; j < memberArray.length; j++)
                        {
                            var sparry = memberArray[j].split(",");
                            keyValArray = keyValArray.concat( sparry[0] );
                        }
                        
                        for( j =0; j < keyValArray.length; j++)
                        {
                            if(keyValArray[j].indexOf("cn=") === 0)
                            {
                                 ldapMembers[ keyValArray[j].split("=")[1] ] = "true";
                            }
                        }
                        
                        for( var m in ldapMembers )
                        {
                            this._log( "LDAP Group = " + m );
                        }
                    }
                }
            }
            
			this._log("getLDAPGroupsFromHeader end");
            
            return ldapMembers;
		},
        
		/**
         * 
         * This function returns a string that represents the type of the input parameter. 
         *
         * The typeof operator (together with instanceof) is probably the biggest design flaw of JavaScript,
         * as it is almost completely broken.  Although instanceof still has limited uses, typeof really 
         * has only one practical use case, which does not happen to be checking the type of an object.
         *
         * The typeof operator should ONLY be used for testing for Undefined Variables. For example,
         *            if( typeof foo !== 'undefined' ) { you can use foo here.... }
         * 
         * Input: obj - the object whose type you want to get
         *
         * Output: This function examines the internal [[Class]] property of an object 
         *         and returns it if it is NOT "Object"; 
         *         otherwise it returns the constructor name as a string.
         *
         * http://bonsaiden.github.io/JavaScript-Garden/#types
         *
         * Created By: Joe Greenwald 4-16-2015
		 * Used By: UV
		 */	
        getTypeOf:function(obj)
        {
            var clas = Object.prototype.toString.call(obj).slice(8, -1);
        
            if( clas === "Object" )
            {
                clas = obj.constructor.toString();
            }

            return clas;
        },

		/**
         * 
         * This function should ONLY be used when trying to identify the "type" of native javascript objects 
         * like Date, String, Boolean, Number, Function, Array, and RegExp. 
         *
         * If you are trying to see if a CUSTOM object is a certain type OR is derived from a certain type,
         * then use the "instanceof" mechanism (i.e. "obj instanceof type").
         * 
         * See getTypeOf() for details
         *
         * Input: obj - the object whose type you want to check
         *        type - a String that identifies the type to check against the obj's type
         *
         *
         * Output: true if the "obj"'s internal [[Class]] property matches the input value "type";
         *         true if the "obj"'s internal [[Class]] property matches "Object" AND
         *         the "obj"'s constructor name contains "type" within it (only useful to check 
         *         immediate type and not the hierarchy)
         *
         * Examples:
         *    isTypeOf(null, "Null") === true
         *    isTypeOf(undefined, "Undefined") === true
         *    isTypeOf(window.jquery, "Undefined") === true
         *    isTypeOf(33, "Number") === true
         *    isTypeOf("hello", "String") === true
         *    isTypeOf( new String("hello"), "String") === true
         *    isTypeOf( new Date(), "Date") === true
         *    isTypeOf( new CustomObject(), "CustomObject") === true  .... checks immediate type only
         *
         * http://bonsaiden.github.io/JavaScript-Garden/#types
         *
         * Created By: Joe Greenwald 4-16-2015
		 * Used By: UV
		 */	
        isTypeOf:function(obj, type)
        {
            var isSameType = false;
            var typeOfObj = this.getTypeOf(obj);

            if( typeOfObj && typeOfObj.indexOf(type) >= 0)
            {
                isSameType = true;
            }

            return isSameType;
        },

        
		/**
		 * Check for Local host vs other host
		 * Created By: David Sheppard 4-13-2015
		 * Used By: UV, FRMS
		 */	
		_localhostCheck:function()
		{
            return(document.location.hostname == "localhost" || 
                    document.location.hostname == "127.0.0.1");
		},
		
        /**
         * Check to see if we are using local json files by checking
         * for the "localjson" parameter within the URL.
         * Called after each service URL to overide for local JSON call
         * 
         * Created By: David Sheppard 4-13-2015
         * Used By: UV, FRMS
         */ 
        _useLocalJSON:function()
        {
            return (this._getURLParam("localjson") == "true");
        },  

        /**
         * Log action and debug items if we have one of the following
         * conditions:
         * 1) we are running against localhost
         * 2) we are using the "localjson" parameter in the URL
         * 3) we are using the "debug" parameter in the URL 
         *    (indicates we are debugging, so output to console)
         * 
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV, FRMS
         */ 
        _log:function(item)
        {
            if(this._localhostCheck() || 
               this._useLocalJSON() ||
               this._getURLParam("debug") == "true")
            {
                console.log(item);
            }
        },  

		/**
		 * Check if a URL variable is set and returns the value
		 * Created By: David Sheppard 4-13-2015
		 * Used By: UV, FRMS
		 */
		_getURLParam:function(name)
		{	
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			  var regexS = "[\\?&]"+name+"=([^&#]*)";
			  var regex = new RegExp( regexS );
			  var results = regex.exec( window.location.href );
			  return results === null ? null : results[1]; 
		},
		
		/**
		 * Parse URL parameters from Object
		 * Created By: David Sheppard 4-13-2015
		 * Used By:  FRMS 
		 */
        urlFromObject:function(obj, prefix) 
        {
          var str = [];
          for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
              var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
              str.push(typeof v == "object" ?
                this._urlFromObject(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
          }
          return "?" + str.join("&");
        },
		
        /**
         * Display an alert dialog message message when there is a communication failure.
         * 
         * Note: DEPRECATED: We should use the new notices.js facility
         * 
         * Input: 
         *     - error - the error object returned to most ajax calls
         *     - message - the message to display indicating the service that was called
         *  
         * Created By: Joe Greenwald 4-16-2015
         * Used By:  UV
         */
        _commonError: function(error,message)
        {
            var errorMsg = "Service Error while processing " + message + "\n\n" +
                           error.response.xhr.status + ": " +
                           error.response.xhr.statusText;
            alert(errorMsg);
            console.log("MYERROR: description = " + error.description);
            console.log("MYERROR: message = " + error.message);
            console.log("MYERROR: response.text = " + error.response.text);
            console.log("MYERROR: response.xhr.status = " + error.response.xhr.status);
            console.log("MYERROR: response.xhr.statusText = " + error.response.xhr.statusText);
        },
			
        /**
         * Make a "div" visible
         * 
         * Input: 
         *     - divId - the div id to make visible
         *  
         * Created By: Joe Greenwald 4-16-2015
         * Used By:  UV, FRMS 
         */
        _showDiv: function(divId)
        {
            console.log("_showDiv " + divId);
            dom.byId(divId).style.display="block";
        },  

        /**
         * Make a "div" invisible
         * 
         * Input: 
         *     - divId - the div id to hide
         *  
         * Created By: Joe Greenwald 4-16-2015
         * Used By:  UV, FRMS 
         */
        _hideDiv: function(divId)
        {
            console.log("_hideDiv " + divId);
            dom.byId(divId).style.display="none";
        },

        /**
         * Remove the content of a div
         * 
         * Input: 
         *     - divId - the div id to clear the content
         *  
         * Created By: Joe Greenwald 4-16-2015
         * Used By:  UV
         */
        _clearDiv: function(divId)
        {
            dom.byId(divId).innerHTML="";
        },
        
        /**
         * Clear the memory store backing for a data grid or enhanced grid
         * 
         * Input: 
         *     - gridInstance - the grid object
         *  
         * Created By: Joe Greenwald 4-16-2015
         * Used By:  UV, FRMS 
         */
        _clearGrid: function clearGrid(gridInstance)
        {
            if(gridInstance !== undefined) 
            {
                gridInstance.setStore(null);
            }
        },

	});	
});