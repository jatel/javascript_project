var contract = require("./contract")
var assert = require('assert');

async function PidContractTest(PidContractAddress, adminAddress) {
    console.log('PidContract contract testing begins');

    // create_pid
    let publicKeyHex = "02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71";
    let auth = "did:pid:lax1s4u4p9j95lh72a2c0ttj48ntd58s45resjgtza#keys-1";
    let initPublicKey = publicKeyHex + "|did:pid:lax1s4u4p9j95lh72a2c0ttj48ntd58s45resjgtza|Secp256k1VerificationKey2018|activate";
    let create = "123456";
    await contract.actionMethodSend("PidContract", PidContractAddress, 'create_pid', adminAddress, auth, initPublicKey, create, 123);

    // set_attribute
    await contract.actionMethodSend("PidContract", PidContractAddress, 'set_attribute', adminAddress, 2, 
    publicKeyHex + "|did:pid:lax1s4u4p9j95lh72a2c0ttj48ntd58s45resjgtza|Secp256k1VerificationKey2018|activate|2", 1234);

    // add_public_key
    await contract.actionMethodSend("PidContract", PidContractAddress, 'add_public_key', adminAddress, 
    publicKeyHex + "|did:pid:lax1s4u4p9j95lh72a2c0ttj48ntd58s45resjgtza|Secp256k1VerificationKey2018|activate|3", 12345);

    // change_status
    var status = await contract.constMethodCall("PidContract", PidContractAddress, 'get_status', adminAddress);
    assert.equal(status, 0, 'PidContract Contract method get_status assertion failed!!!');
    await contract.actionMethodSend("PidContract", PidContractAddress, 'change_status', adminAddress, 1);
    status = await contract.constMethodCall("PidContract", PidContractAddress, 'get_status', adminAddress);
    assert.equal(status, 1, 'PidContract Contract method change_status assertion failed!!!');

    // is_identity_exist
    var exist = await contract.constMethodCall("PidContract", PidContractAddress, 'is_identity_exist', adminAddress);
    assert.ok(exist, 'PidContract Contract method is_identity_exist assertion failed!!!');
    var invalidAddress = "lax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmscn5j";
    exist = await contract.constMethodCall("PidContract", PidContractAddress, 'is_identity_exist', invalidAddress);
    assert.ok(!exist, 'PidContract Contract method is_identity_exist assertion failed!!!');

    // get_latest_block
    var blockNumber = await contract.constMethodCall("PidContract", PidContractAddress, 'get_latest_block', adminAddress);
    assert.notEqual(blockNumber, 0, 'PidContract Contract method get_latest_block assertion failed!!!');

    console.log('PidContract contract test passed');
}

exports.PidContractTest = PidContractTest;