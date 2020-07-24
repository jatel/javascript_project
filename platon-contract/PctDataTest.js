var contract = require("./contract")
var assert = require('assert');

async function PctDataTest(PctDataAddress, adminAddress) {
    console.log('PctData contract testing begins');

    // register_pct
    let jsonSchema = '{"name":"std""string", "age":"uint32_t", "id":"std::string"}';
    let extra = Buffer.from([1, 2, 3, 4]);
    var onePct = [0, adminAddress, 1234, jsonSchema, extra];
    await contract.actionMethodSend("PctData", PctDataAddress, 'register_pct', onePct);

    // get_pct_id
    var allId = await contract.constMethodCall("PctData", PctDataAddress, 'get_pct_id', adminAddress);
    assert.equal(allId[0], 1000, 'PctData Contract method get_pct_id assertion failed!!!');

    // is_pct_exist
    var exist = await contract.constMethodCall("PctData", PctDataAddress, 'is_pct_exist', 1000);
    assert.ok(exist, 'PctData Contract method is_pct_exist assertion failed!!!');

    exist = await contract.constMethodCall("PctData", PctDataAddress, 'is_pct_exist', 99);
    assert.ok(!exist, 'PctData Contract method is_pct_exist assertion failed!!!');

    // get_pct_issuer
    var issuer = await contract.constMethodCall("PctData", PctDataAddress, 'get_pct_issuer', 1000);
    assert.equal(issuer, adminAddress, 'PctData Contract method get_pct_issuer assertion failed!!!');

    // get_pct_schema
    var schame = await contract.constMethodCall("PctData", PctDataAddress, 'get_pct_schema', 1000);
    assert.equal(schame, jsonSchema, 'PctData Contract method get_pct_schema assertion failed!!!');

    // query_pct
    var oneRealPct = [1000, adminAddress, "1234", jsonSchema, extra];
    var pctInfo = await contract.constMethodCall("PctData", PctDataAddress, 'query_pct', 1000);
    assert.ok(JSON.stringify(oneRealPct) === JSON.stringify(pctInfo), 'PctData Contract method query_pct assertion failed!!!');

    console.log('PctData contract test passed');
}

exports.PctDataTest = PctDataTest;