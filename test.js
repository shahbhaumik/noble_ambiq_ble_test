var noble = require('noble');

noble.on('stateChange', function(state){
  if (state === 'poweredOn'){
    console.log('Powered on!');
  }
  noble.startScanning();
});

noble.on('discover', function(peripheral){
  var macAddress = peripheral.uuid;
    var rss = peripheral.rssi;
    var localName = peripheral.advertisement.localName;
    console.log('found device: ', macAddress , ' ', rss , ' ', localName);
    connectAndSetup(peripheral); });



function connectAndSetup(peripheral){
  if (peripheral.advertisement.localName === 'Heart Rate'){
    console.log('Found the HRM Device');
    noble.stopScanning();
    peripheral.connect(function(error){
      console.log('device connected');
      var serviceUUIDs = ['180D'];
      var characteristicUUID = ['2A37'];
      peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUID, function(error, services, charateristics){
        if (error){
          console.log ('Error discovering the serviceUUID and characteristicUUID');
          return;
        }
        var hrmData = charateristics[0];
        hrmData.on('read', function(data, isNotification) {
                                      if (data.length ===1){
                                        var result = data.readUInt8(0);
                                        console.log(result);
                                      }
                                    });
      hrmData.subscribe(function (err) {
                              if (err) {
                                console.log('Error subscribing to HRM notifications', err);
                              } else {
                                console.log('Subscribed for HRM notifications');
                              }
                            });

      });
});
}
}
