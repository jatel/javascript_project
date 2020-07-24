var contract = require("./contract")
var assert = require('assert');

async function CredentialContractTest(CredentialContractAddress) {
    console.log('CredentialContract contract testing begins');

    // create_credential
    let hash = Buffer.from([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    let signer = "jatel";
    let signature_data = "random data"
    await contract.actionMethodSend("CredentialContract", CredentialContractAddress, 'create_credential', hash, signer, signature_data, 123);

    // set_attribute
    await contract.actionMethodSend("CredentialContract", CredentialContractAddress, 'set_attribute', hash, 1, "set dara", 123);

    // is_hash_exist
    var exist = await contract.constMethodCall("CredentialContract", CredentialContractAddress, 'is_hash_exist', hash);
    assert.ok(exist, 'CredentialContract Contract method is_hash_exist assertion failed!!!')

    // get_latest_block
    var blockNumber = await contract.constMethodCall("CredentialContract", CredentialContractAddress, 'get_latest_block', hash);
    assert.notEqual(blockNumber, 0, 'CredentialContract Contract method get_latest_block assertion failed!!!');

    console.log('CredentialContract contract test passed');
}

exports.CredentialContractTest = CredentialContractTest;