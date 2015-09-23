define(["dojo/_base/declare", "dojo/_base/lang"], function(declare, lang){
	return declare(null, {
		constants : { 
			SUCCESS_FORM_DTLS_CRT : "Form created successfully."
		},
        frank:"Good",
		constructor: function(){
		     console.debug("In constructor "); 
		},
		name : "FrmsWebConstants",
		getConstantValue : function(cname){
			if(typeof cname == "undefined"){
				console.debug("Invoking the constants...");
				// Copy of our protected object
				return lang.clone(this.constants);
			}else{
				// Value of a particular thing            
				if(this.constants.hasOwnProperty(cname)){
					console.debug("Yes it has property");
					return this.constants[cname];
				}else{
					throw "Constant '"+cname+"' does not exist.";
				}
			}
		}
		
	});
});