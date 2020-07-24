var contract = require("./contract")
var assert = require('assert');

async function PctControllerTest(PctControllerAddress, adminAddress) {
    console.log('PctController contract testing begins');

    // register_pct
    let jsonSchema = '{"name":"std""string", "age":"uint32_t", "id":"std::string"}';
    let extra = Buffer.from([1, 2, 3, 4]);
    var onePct = [0, adminAddress, 1234, jsonSchema, extra];
    await contract.actionMethodSend("PctController", PctControllerAddress, 'register_pct', onePct);

    // get_pct_id
    var allId = await contract.constMethodCall("PctController", PctControllerAddress, 'get_pct_id', adminAddress);
    assert.equal(allId[0], 1000, 'PctController Contract method get_pct_id assertion failed!!!');

    // is_pct_exist
    var exist = await contract.constMethodCall("PctController", PctControllerAddress, 'is_pct_exist', 1000);
    assert.ok(exist, 'PctController Contract method is_pct_exist assertion failed!!!');

    exist = await contract.constMethodCall("PctController", PctControllerAddress, 'is_pct_exist', 99);
    assert.ok(!exist, 'PctController Contract method is_pct_exist assertion failed!!!');

    // get_pct_issuer
    var issuer = await contract.constMethodCall("PctController", PctControllerAddress, 'get_pct_issuer', 1000);
    assert.equal(issuer, adminAddress, 'PctController Contract method get_pct_issuer assertion failed!!!');

    // get_pct_schema
    var schame = await contract.constMethodCall("PctController", PctControllerAddress, 'get_pct_schema', 1000);
    assert.equal(schame, jsonSchema, 'PctController Contract method get_pct_schema assertion failed!!!');

    // query_pct
    var oneRealPct = [1000, adminAddress, "1234", jsonSchema, extra];
    var pctInfo = await contract.constMethodCall("PctController", PctControllerAddress, 'query_pct', 1000);
    assert.ok(JSON.stringify(oneRealPct) === JSON.stringify(pctInfo), 'PctController Contract method query_pct assertion failed!!!');

    console.log('PctController contract test passed');
}

exports.PctControllerTest = PctControllerTest;