define([
    'intern!object',
    'intern/chai!assert',
    'models/promotion/releaseGroupsModel'
], function (registerSuite, assert, releaseGroupModel) {
    "use strict";

    // global testing vars
    // var packageVersionStore = dojo.fromJson(packageVersionStoreJson);

    registerSuite({
        name: 'Promotion Models Test',

        // assert params http://chaijs.com/api/assert/

        /**
         * TODO
         */
        setPassedDataTest: function () {
            releaseGroupModel.setPassedData({id: 1, addedDocs: [{id: 10}, {id: 11}]});
            assert(1 === releaseGroupModel.getReleaseGroupId(), "Id did not match expected 1");
        },

        /**
         * TODO
         */
        getVersionsTest: function () {
            var versions = releaseGroupModel.getVersions();
            assert(versions, "Versions not truthy");
            assert(1 === versions.data.length, "Expected Versions would be empty");
            
            releaseGroupModel.addVersions([
                {id: 1, groupVersionNum: 1}, 
                {id: 2, groupVersionNum: 2}, 
                {id: 3, groupVersionNum: 3}]);
            assert(4 === versions.data.length, "Expected Versions updated to contain 3 objects, plus all");
            
            releaseGroupModel.addVersions([
                {id: 4, groupVersionNum: 4}, 
                {id: 5, groupVersionNum: 5}, 
                {id: 6, groupVersionNum: 6}]);
            assert(7 === versions.data.length, "Expected Versions updated to contain 6 objects, plus all");
        },
        
        /**
         * TODO
         */
        addVersionsTest: function () {
            releaseGroupModel.setVersions();
            var versions = releaseGroupModel.getVersions();
            assert(versions, "Versions not truthy");
            assert(1 === versions.data.length, "Expected Versions would be empty");
            
            releaseGroupModel.addVersions([
                {id: 1, groupVersionNum: 1}, 
                {id: 2, groupVersionNum: 2}, 
                {id: 3, groupVersionNum: 3}]);
            assert(4 === versions.data.length, "Expected Versions updated to contain 3 objects, plus all");
            
            releaseGroupModel.addVersions([
                {id: 4, groupVersionNum: 4}, 
                {id: 5, groupVersionNum: 5}, 
                {id: 6, groupVersionNum: 6}]);
            assert(7 === versions.data.length, "Expected Versions updated to contain 6 objects, plus all");
        },

        /**
         * TODO
         */
        setVersionsTest: function () {
            releaseGroupModel.setVersions();
            var versions = releaseGroupModel.getVersions();
            assert(versions, "Versions not truthy");
            assert(1 === versions.data.length, "Expected Versions would be empty");
            
            releaseGroupModel.setVersions([
                {id: 1, groupVersionNum: 1}, 
                {id: 2, groupVersionNum: 2}, 
                {id: 3, groupVersionNum: 3}]);
            versions = releaseGroupModel.getVersions()
            assert(4 === versions.data.length, "Expected Versions updated to contain 3 objects, plus all");
            
            releaseGroupModel.setVersions([
                {id: 4, groupVersionNum: 4}, 
                {id: 5, groupVersionNum: 5}, 
                {id: 6, groupVersionNum: 6}]);
            versions = releaseGroupModel.getVersions()
            assert(4 === versions.data.length, "Expected Versions updated to contain 3 objects, plus all");
        },
        
        /**
         * TODO
         */
        setVersionDocsTest: function () {
            var observStore = releaseGroupModel.setVersionDocs(1, 20, [{id: 100}, {id: 101}, {id: 102}]);
            assert(3 === observStore.data.length, "Expected 3 docs, but had " + observStore.data.length);
        },
        
        /**
         * TODO
         */
        addVersionDocsTest: function () {
            var observStore = releaseGroupModel.getVersionDocs(1, 20);
            assert(3 === observStore.data.length, "Expected 3 docs, but had " + observStore.data.length);
            releaseGroupModel.addVersionDocs(1, [{id: 103}, {id: 104}, {id: 105}]);
            assert(6 === observStore.data.length, "Expected 6 docs after add, but had " + observStore.data.length);
        }
    });
});