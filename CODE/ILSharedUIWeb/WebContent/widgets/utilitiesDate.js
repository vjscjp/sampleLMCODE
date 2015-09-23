/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true */

define([
	"dojo/dom","dojo/dom-construct","dojo/dom-style", "dojo/_base/array",
	"dojo/on", "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dojo/_base/lang",
    "dojo/date/locale",
    "/common/widgets/utilities.js"
    ], 
function(
	dom, domConstruct, domStyle, array,
	on,	declare, _WidgetBase, _TemplatedMixin, lang, locale, SharedUtils
    )
{
    var Utils = new SharedUtils(); // Utils.js helper Widget

    /**
	 * This is a list of functions specific for Date formating
     *
     * Parsing date strings with javascript is a mess, therefore, we must be careful
     * which formats we expect and perform testing rigorously.
     *
     * Please read the excellent article about date string parsing
     * http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html
     *
	 */

	
	return declare('app.UtilsDate',null,
    {
		
        /**
         * Input: 1) A string date or date-time that is expected to be in UTC format  OR
         *        2) the string integer value representing the number of milliseconds 
         *           since 1 January 1970 00:00:00 UTC (Unix Epoch) OR
         *        3) an integer value representing the number of milliseconds 
         *           since 1 January 1970 00:00:00 UTC (Unix Epoch)
         *
         *    Example formats expected: 
         *
         *       Millisecond format
         *       - 353263576               ... only contains digits
         *
         *       ISO formats (or close to ISO formats)
         *       - "2014-10-31 05:00:00"   ... YYYY-MM-DD HH:MM:SS
         *       - "2014-10-31 05:00:00Z"  ... YYYY-MM-DD HH:MM:SSZ
         *       - "2014-10-31T05:00:00"   ... YYYY-MM-DDTHH:MM:SS
         *       - "2014-10-31T05:00:00Z"  ... YYYY-MM-DDTHH:MM:SSZ
         *       - "2014-10-31 00:00:00"   ... YYYY-MM-DD HH:MM:SS
         *       - "2014-10-31"            ... YYYY-MM-DD
         *
         *       Non-ISO formats
         *       - "2014/10/31 05:00:00"   ... YYYY/MM/DD HH:MM:SS
         *       - "2014/10/31 05:00:00Z"  ... YYYY/MM/DD HH:MM:SSZ
         *       - "2014/10/31 00:00:00"   ... YYYY/MM/DD HH:MM:SS
         *       - "2014/10/31"            ... YYYY/MM/DD
         *
         *       - "10/31/2014 05:00:00"   ... MM/DD/YYYY HH:MM:SS
         *       - "10/31/2014 05:00:00Z"  ... MM/DD/YYYY HH:MM:SSZ
         *       - "10/31/2014"            ... MM/DD/YYYY
         *
         *       - "10-31-2014 05:00:00"   ... MM-DD-YYYY HH:MM:SS
         *       - "10-31-2014 05:00:00Z"  ... MM-DD-YYYY HH:MM:SSZ
         *       - "10-31-2014"            ... MM-DD-YYYY
         *
         *       - null, undefined, or a string less than 7 character, or a date that does not parse
         *         will result in a null return value
         *
         * Output: A Date object representing local time (based on the user's locale) if the
         *         input value can be parsed as a Date; otherwise return null
         *
         * Assumptions: 
         *     - The string may or may not have a UTC designation (i.e. it may not have "Z" appended to it), 
         *       so we will add a "Z" to the end to ensure UTC processing
         *     - The input string must be at least 7 character in length to represent at least a date
         *     - If the string does not contains a time component, we will assume midnight
         *     - If the string is midnight (00:00:00),
         *       we will adjust the Date object and shift it by the TimezoneOffset.
         *       Since a date only input would be interpreted at midnight, any time-zone
         *       EAST of GMT would shift the date to the prior day, therefore, we shift
         *       the date-only input forward so that the date does not change days.
         *     - When the input is not in Millisecond format, the string will change
         *       the input to use "/" characters, since there is more consistent
         *       parsing across browsers.
         *     - see http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html
         *
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV
         */
        parseUTCDateString:function(value)
        {
            //console.log( "input date = " + value);
            if( Utils.isTypeOf(value, "Number") )
            {
                var isInt = value % 1 === 0;
                
                if( isInt )
                {
                    value = value.toString();
                }
                else
                {
                    value = null;
                }
            }
            
            if( Utils.isTypeOf(value, "String") )
            {
                try
                {
                    value = value.trim();
                    var isnum = /^\d+$/.test(value);
                    
                    if( isnum )
                    {
                        // parse as milliseconds - expected to be in UTC
                        value = new Date( parseInt(value) );
                        
                        var seconds = value.getSeconds();
                        var minutes = value.getMinutes();
                        var hour = value.getHours();
                        
                        if( hour === 0 && minutes === 0 && seconds === 0)
                        {
                            // it is midnight, we assume that the date is the most important
                            // part of the information, therefore we need to preserve the date
                            // so that it remains on the same day
                            
                            // we must adjust based on the Timezone offset to preserve the 
                            // day within the date
                            date.setMinutes( date.getMinutes() + date.getTimezoneOffset() );
                        }
                    }
                    else if( value.length > 7 )
                    {
                        value = value.replace(/T/g, " ");     // remove the T, since it is only used in ISO format
                        value = value.replace(/\.\d+/g, "");  // remove the sub-second part
                        value = value.replace(/\-\d+$/, "");  // remove the timezone part, since we assume UTC
                        value = value.replace(/\+\d+$/, "");  // remove the timezone part, since we assume UTC
                        value = value.replace(/-/g, "/");     // always use "/" since it has best support
                        
                        var date = null;

                        // if we don't have a time component, we will add one to it
                        if( value.indexOf(":") < 0 )
                        {
                            value = value + " 00:00:00Z";
                        }

                        // we need to make sure there is a "Z" at the end so that we
                        // have the UTC format
                        if( value.indexOf("Z") < 0 )
                        {
                            value = value + "Z"; // assume GMT == UTC == Zulu (Z)
                        }

                        date = new Date(value);

                        // if it is midnight, we assume that the date is the most important
                        // part of the information, therefore we need to preserve the date
                        // so that it remains on the same day
                        if( value.indexOf("00:00:00") >= 0  && this.isValidDate(date) )
                        {
                            // we must adjust based on the Timezone offset to preserve the 
                            // day within the date
                            date.setMinutes( date.getMinutes() + date.getTimezoneOffset() );
                        }

                        value = date;
                    }
                    else
                    {
                        value = null;
                    }
                }
                catch(e)
                {
                    value = null;
                }
            }
            else
            {
                value = null;
            }

            if( this.isValidDate(value) === false )
            {
                value = null;
            }
            
            //console.log( "Utils.isTypeOf(value, Date) = " + Utils.isTypeOf(value, "Date"));
            //console.log( ">>>> output date = " + value);

            return value;
        },

        /**
         * Input: Either a Date object or 
         *        a string representing a date or date-time that is expected to be in UTC format
         *        see parseUTCDateString(value) for example input string formats
         *
         * Output: A date-time String representing local date and time (based on the user's locale).
         *         If the input is a String that cannot be parsed properly, the return value will be null.
         *         If the input is a Date or is parsed properly into a Date, the output will be a string
         *         representing local date and time (based on the user's locale).
         *
         * Assumptions: see parseUTCDateString(value) for more details
         *
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV
         */
        localDateTimeFormatter:function(value)
        {
            //console.log( "localDateTimeFormatter() input date = " + value);
            if( Utils.isTypeOf(value, "String") )
            {
                value = this.parseUTCDateString(value);
            }
            
            if( Utils.isTypeOf(value, "Date") )
            {
                value = value.toLocaleString(); // convert based on locale and output Date+Time
            }

            //console.log( "localDateTimeFormatter() >>>> output date = " + value)
            return value;
        },

        /**
         * Input: Either a Date object or 
         *        a string representing a date or date-time that is expected to be in UTC format
         *        see parseUTCDateString(value) for example input string formats
         *
         * Output: A date-Only String representing local date (based on the user's locale).
         *         If the input is a String that cannot be parsed properly, the return value will be null.
         *         If the input is a Date or is parsed properly into a Date, the output will be a string
         *         representing local date-Only (based on the user's locale).
         *
         * Assumptions: see parseUTCDateString(value) for more details
         *
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV
         */
        localDateOnlyFormatter:function(value)
        {
            //console.log( "localDateOnlyFormatter() input date = " + value);
            if( Utils.isTypeOf(value, "String") )
            {
                value = this.parseUTCDateString(value);
            }
            
            if( Utils.isTypeOf(value, "Date") )
            {
                value = value.toLocaleDateString(); // convert based on locale and output Date only
            }

            //console.log( "localDateOnlyFormatter() >>>> output date = " + value);
            return value;
        },


        /**
         * Input: Either a Date object or 
         *        a string date expected to be in UTC format
         *        see parseUTCDateString(value) for example input
         *
         * Output: An ISO formatted date-only String (YYYY-MM-DD).
         *         If the input is a String that cannot be parsed properly, the return value will be null.
         *         If the input is a Date or is parsed properly into a Date, the output will be an
         *         ISO formatted date-only String (YYYY-MM-DD).
         *
         * Assumptions: see parseUTCDateString(value) for more details
         *
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV
         */
        isoDateOnlyFormatter:function(value)
        {
            //console.log( "isoDateOnlyFormatter() input date = " + value);
            if( Utils.isTypeOf(value, "String") )
            {
                value = this.parseUTCDateString(value);
            }

            if( Utils.isTypeOf(value, "Date") )
            {
                value = locale.format( value, {selector:"date", datePattern:"yyyy-MM-dd" } );
            }

            //console.log( "isoDateOnlyFormatter() >>>> output date = " + value);
            return value;
        },
        
        /**
         * Input: A Date object 
         *
         * Output: true if the input is a valid Date object; otherwise false
         *
         * Created By: Joe Greenwald 4-16-2015
         * Used By: UV
         */
        isValidDate:function(d)
        {
            var isValid = false;
            
            if( Object.prototype.toString.call(d) === "[object Date]" )
            {
                if( isNaN( d.getTime() ) === false ) 
                {
                    isValid = true;
                }
            }
            
            return isValid;
        },

			
	});
    
});
