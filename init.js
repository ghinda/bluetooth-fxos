
var adapter;

// Retreving the local device adapter is asynchronous, handle this carefully.
navigator.mozBluetooth.getDefaultAdapter().onsuccess = function(evt) {
  adapter = evt.target.result;
  
    
  adapter.onpairedstatuschanged = function (evt) {
    if (evt.status) {
      alert("The pairing operation has been successfully completed");
    } else {
      alert("The pairing operation has failed. Please, try again");
    }
  }
  
  adapter.ondevicefound = function(e) {
    console.log(e);
  }
  
  adapter.ona2dpstatuschanged = function bt_a2dpStatusChanged(evt) {
    console.log(evt.address, evt.status, Profiles.A2DP);
  };
  
  var req = adapter.getPairedDevices();
  req.onsuccess = function bt_getPairedSuccess() {
    // copy for sorting
    var paired = req.result.slice();
    var length = paired.length;
    
    var device = paired[0];
    
    var connectSuccess = function(e) {
      console.log('success');
    };

    var connectError = function(e) {
      console.log('error', e);
    };
    
    var connectReq = adapter.connect(device, 0x0003);
    connectReq.onsuccess = connectSuccess;
    connectReq.onerror = connectError;
    
    console.log(device);
    
    /*
    var pairReq = adapter.pair(device.address);
    var pairingAddress = device.address;
    pairReq.onerror = function bt_pairError(error) {
      console.log(false, pairReq.error.name);
    };
    */
    
    
  };
  
}

function onPairing(message) {
  var reponse,
      request = message.detail,
      passkey = request.passkey;

  switch (request.method) {
    case 'confirmation':
      // Make sure the passkey is a string
      passkey = String(passkey);
      // Make sure the string is 6 characters long (pad with 0 if necessary)
      passkey = (new Array((6 - passkey.length) + 1)).join('0') + passkey;
      // Let's prompt the user
      response = confirm('Is that same number visible on the remote device screen: ' + passkey)
      // Let's send the confirmation
      adapter.setPairingConfirmation(request.address, response);
      break;

    case 'pincode':
      // Let's prompt the user
      response = prompt('Thanks to provide the remote device PIN code');
      // Let's send the pin code
      adapter.setPinCode(request.address, response);
      break;

    case 'passkey':
      // Let's prompt the user
      response = alert('Thanks to type the following code on the remote device');
      // Let's send back the passkey
      adapter.setPasskey(request.address, response);
      break;
  }

}

navigator.mozSetMessageHandler("bluetooth-pairing-request", onPairing);


console.log('init');

