'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'einstein' );
var violet = require('../../lib/violet.js')(app);


violet.addKeyTypes({
  "name": "AMAZON.US_FIRST_NAME",
  "age": "NUMBER",
  "number": "NUMBER"
});

violet.addPhraseEquivalents([
  ["name is", "name's"],
  ["I am", "I'm"],
  ["Do you know", "What is"],
  ["say", "give", "give me", "tell", "tell me"]
]);









violet.respondTo([
      "Is there anything interesting on Chatter?"
    ], function(respond) {
    respond("Yes. There is a post on the All Salesforce group and the SE Trailblazer group.");
});

violet.respondTo([
      "What is the post on the All Salesforce group about?"
    ], function(respond) {
    respond("Jim Cavalieri posted: Team - I am please to announce that V2MAX has been updated with FY18 V2MOM. Feel free to check out your V2MOM alignment with your team, manager, division, and the company. Should I continue, or would you like this post sent to you?");
});

violet.respondTo([
      "Yes, please email it to me."
    ], function(respond) {
    respond("Done. Anything else I can help you with?");
});








violet.respondTo([
      "What's up?",
      "What is happening?",
      "What is the alert about?"
    ], function(respond) {
    respond("You received an e-mail from David Torchiana. Your notes say that he is the CEO of Partners Healthcare.");
});

violet.respondTo([
      "I am busy. Can you forward it to Ash?"
    ], function(respond) {
    respond("Sure. Will do.");
    setTimeout(()=>{respond("I do not see an Ash in your address book. Do you have an e-mail address?")}, 5000);
});

violet.respondTo([
      "Is there an Ashita Saluja in my address book?"
    ], function(respond) {
    respond("Found it. Should I forward the e-mail to her? And should I set up an Alias for Ash?");
});

violet.respondTo([
      "Yes and Yes"
    ], function(respond) {
    respond("Done and Done");
});



violet.respondTo("my name is {{name}} and I am {{age}} {years old|}",
  function(respond, params, session) {
    var name = params('name');
    var age = params('age');
    respond("Welcome " + name + " I heard that you are " + age + ". I will remember you.");
    session.set('name', name);
    session.set('age', age);
});

violet.respondTo(["how old am I", "do you know my age"],
  function(respond, params, session) {
    var age = session.get('age');
    if (age)
      respond("I remember you telling me that you are " + age);
    else
      respond("I do not know your age.");
});

violet.respondTo(["what do I call myself", "do you know my name"],
  function(respond, params, session) {
    var name = session.get('name');
    if (name)
      respond("I remember you telling me that you are " + name);
    else
      respond("I do not know your name.");
});

violet.respondTo([
       "say the number {1-100|number}",
       "I want to hear you say the number {1-100|number}"],
  function(respond, params) {
    var number = params('number');
    respond("You asked for the number "+number);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

violet.respondTo([
      "say a random number",
      "I want to hear you say a random number"],
  function(respond) {
    respond("A random number that you asked for is " + getRandomInt(0,100));
});

module.exports = app;