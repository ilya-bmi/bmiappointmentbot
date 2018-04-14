var restify = require('restify');
var builder = require('botbuilder');
var azure = require("botbuilder-azure");

var documentDbOptions = {
    host: 'https://bmibotdb.documents.azure.com:443/    ', 
    masterKey: 'LPJ0ldNetBnHEXJZQtNAPc7W3q6zEAn8alNtEauaHE7ZAfBIU93gRSfsKCoN5QrNKQK2ePWZMDzOkmVjidhuSg', 
    database: 'botdocs',   
    collection: 'botdata'
};

var inMemoryStorage = new builder.MemoryBotStorage();

var docDbClient = new azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said BMI: %s", session.message.text);
}).set('storage', inMemoryStorage);

//var bot = new builder.UniversalBot(connector, function (session) {
//    session.send("You said BMI: %s", session.message.text);
//}).set('storage', cosmosStorage);

