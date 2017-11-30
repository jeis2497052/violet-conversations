var assert = require('assert');
var vh = require('./violetHelper.js');

describe('violetStoreSF', function() {
  this.timeout(5*1000);

  /*
  Assumes that there is a Automated_Tests object created in the
  Org with Status as a picklist[New, Waiting, Running, Failed,
  Passed] and Verified as a Checkbox
  */

  describe('query multiple ways', function() {

    it('should be able to do a query using basic query parameters', function() {
      var violetSFStore = require('../lib/violetStoreSF')(vh.violet);
      violetSFStore.store.propOfInterest = {
        'Automated_Tests': ['Status', 'Verified']
      }
      vh.violet.respondTo('Hello', function *(response) {
        response.say('Hi');
        var results = yield response.load('Automated_Tests', 'Status', 'New');
        // console.log('results: ', results);
        assert.ok(Array.isArray(results));
      });
      vh.initialize();
      return violetSFStore.connected().then(()=>{
        return vh.sendIntent('Hello');
      }).then(({rcvdStr, body})=>{
        assert.equal('Hi', rcvdStr);
      });
    });

    it('should be able to do a query using object parameters', function() {
      var violetSFStore = require('../lib/violetStoreSF')(vh.violet);
      violetSFStore.store.propOfInterest = {
        'Automated_Tests': ['Status', 'Verified']
      }
      vh.violet.respondTo('Hello', function *(response) {
        response.say('Hi');
        var results = yield response.load({
          objName: 'Automated_Tests',
          keyName: 'Status',
          keyVal: 'New'
        });
        // console.log('results: ', results);
        assert.ok(Array.isArray(results));
      });
      vh.initialize();
      return violetSFStore.connected().then(()=>{
        return vh.sendIntent('Hello');
      }).then(({rcvdStr, body})=>{
        assert.equal('Hi', rcvdStr);
      });
    });

    it('should be able to do a query using raw soql query', function() {
      var violetSFStore = require('../lib/violetStoreSF')(vh.violet);
      vh.violet.respondTo('Hello', function *(response) {
        response.say('Hi');
        var results = yield response.load({
          query: "CreatedDate, Status__c, Verified__c FROM Automated_Tests__c WHERE Status__c = 'New'  limit 100"
        });
        // console.log('results: ', results);
        assert.ok(Array.isArray(results));
      });
      vh.initialize();
      return violetSFStore.connected().then(()=>{
        return vh.sendIntent('Hello');
      }).then(({rcvdStr, body})=>{
        assert.equal('Hi', rcvdStr);
      });
    });

  });

  describe('basic crud support (minus the delete)', function() {

    it('should be able to create a record and read to verify that it has been inserted', function() {
      var recName = `Important Record: ${Math.round(Math.random()*1000*1000)}`
      var violetSFStore = require('../lib/violetStoreSF')(vh.violet);
      violetSFStore.store.propOfInterest = {
        'Automated_Tests': ['Name*', 'CreatedDate*', 'Status', 'Verified']
      }
      vh.violet.respondTo('Hello', function *(response) {
        response.say('Hi');
        yield response.store('Automated_Tests', {
          'Name*': recName,
          Status: 'New',
          Verified: true
        });
        var results = yield response.load({
          objName: 'Automated_Tests',
          keyName: 'Name*',
          keyVal: recName
        });
        // console.log('results: ', results);
        assert.ok(Array.isArray(results));
        assert.ok(results.length==1);
        assert.equal(results[0].Name,recName);

        yield response.update('Automated_Tests', 'Name*', recName, {'Status': 'Running'});
        results = yield response.load({
          objName: 'Automated_Tests',
          keyName: 'Name*',
          keyVal: recName
        });
        // console.log('results: ', results);
        assert.ok(Array.isArray(results));
        assert.ok(results.length==1);
        assert.equal(results[0].Status,'Running');

        // we should ideally delete the record - but Violet does not support this right now
      });
      vh.initialize();
      return violetSFStore.connected().then(()=>{
        return vh.sendIntent('Hello');
      }).then(({rcvdStr, body})=>{
        assert.equal('Hi', rcvdStr);
      });
    });

  });

  describe('basic search support', function() {

    it('should be able to create a record and read to verify that it has been inserted', function() {
      var violetSFStore = require('../lib/violetStoreSF')(vh.violet);
      violetSFStore.store.propOfInterest = {
        'KnowledgeArticleVersion*': ['Id*', 'Title*', 'Summary*', 'UrlName*', 'LastPublishedDate*']
      }
      vh.violet.respondTo('Hello', function *(response) {
        response.say('Hi');
        var results = yield violetSFStore.store.search('KnowledgeArticleVersion*', 'security');
        // console.log('search results:', results);
        // console.log('found ' + results.length + ' results');
        assert.ok(Array.isArray(results));
      });
      vh.initialize();
      return violetSFStore.connected().then(()=>{
        return vh.sendIntent('Hello');
      }).then(({rcvdStr, body})=>{
        assert.equal('Hi', rcvdStr);
      });
    });

  });


});
