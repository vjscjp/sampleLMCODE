define([
    'intern!object',
    'intern/chai!assert',
    'controllers/widgets/functions'
], function (registerSuite, assert, functions) {
    registerSuite({
        name: 'Function Test',
        
        // assert params http://chaijs.com/api/assert/
        
        testDate: function () {
            var myFunction = new functions();
            var myDate = "2014-10-31";
            var futureDate = myFunction._isoDateFormatter(myDate);
            assert.strictEqual(futureDate, '10/31/2014',
                'Date is parsed correctly');
        },
        
        testFuture: function () {
            var myFunction = new functions();
            var myDate = "2016-10-31";
            var futureDate = myFunction._isFuture(myDate)
            assert.isTrue(futureDate,
                'Date is future');
        },
        
        testFuture: function () {
            var myFunction = new functions();
            var myDate = "2016-10-16";
            var futureDate = myFunction.plusDay(myDate,1)
            assert(myFunction._isoDateFormatter(futureDate) == '10/17/2016'
                ,'Date is future');
        },
        
        testDatesObject: function(){
            var myFunction = new functions();
            var date1 = myFunction._returnDateObj("2015-01-01 00:00:00");
            var date2 = myFunction._returnDateObj("2015-01-01T05:00:00.000+0000");
            var date3 = myFunction._returnDateObj("2015-01-01 05:00:00");
            
            assert(myFunction._isoDateFormatter(date1) == '1/1/2015'
                    && myFunction._isoDateFormatter(date2) == '1/1/2015'
                    && myFunction._isoDateFormatter(date3) == '1/1/2015'
                ,'Date is future');
        }
        
        
                  
    });
});