var WebSocketClient = require('websocket').client;
var MongoClient = require('mongodb').MongoClient;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {

  console.log('WebSocket client connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed');
  });


	MongoClient.connect('mongodb://127.0.0.1:27017/tessel', function(err, db) {
		if(err) throw err;

		var collection = db.collection('climate_measurements');
		connection.on('message', function(message) {
			var data = JSON.parse(message.utf8Data);
			var time = new Date().getTime();
			if (message.type === 'utf8') {
				collection.insert({timestamp: time, humidity: data.humidity, temperature: data.temperature}, function(err, docs) {});
			}
		});
	})

});

client.connect('ws://192.168.1.65:8000');
