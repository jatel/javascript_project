var contract = require("./contract")
var assert = require('assert');

async function AuthorityDataTest(authorityDataAddress, adminAddress) {
    console.log('AuthorityData contract testing begins');

    // add_authority
    let name = Buffer.from("jatel", "utf8");
    let accumulate = Buffer.from([10, 10, 10]);
    let extra =  Buffer.from([20, 20, 20]);
    var oneAuthority = [adminAddress, name, 12345, accumulate, extra];
    await contract.actionMethodSend("AuthorityData", authorityDataAddress, 'add_authority', oneAuthority);

    // is_authority
    var isAuthority = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'is_authority', adminAddress);
    assert.ok(isAuthority, 'AuthorityData Contract method is_authority assertion failed!!!')

    var invalidAddress = "lax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmscn5j";
    isAuthority = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'is_authority', invalidAddress);
    assert.ok(!isAuthority, 'AuthorityData Contract method is_authority assertion failed!!!')

    // get_info_by_address
    var oneRealAuthority = [adminAddress, name, '12345', accumulate, extra];
    var authorityInfo = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_info_by_address', adminAddress);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityData Contract method get_info_by_address assertion failed!!!');

    // get_info_by_name
    authorityInfo = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_info_by_name', name);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityData Contract method get_info_by_name assertion failed!!!');

    // get_accumulate
    var accumulateInfo = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_accumulate', adminAddress);
    assert.ok(JSON.stringify(accumulateInfo) === JSON.stringify(accumulate), 'AuthorityData Contract method get_accumulate assertion failed!!!');

    // get_all_name
    var allName = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_all_name');
    assert.ok(JSON.stringify(allName[0]) === JSON.stringify(name), 'AuthorityData Contract method get_all_name assertion failed!!!');

    // update_authority
    oneAuthority[2] = 456789;
    oneRealAuthority[2] = '456789';
    await contract.actionMethodSend("AuthorityData", authorityDataAddress, 'update_authority', oneAuthority);
    authorityInfo = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_info_by_name', name);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityData Contract method update_authority assertion failed!!!');

    // update_authority
    let newName = Buffer.from("wht", "utf8");
    oneAuthority[1] = newName;
    oneRealAuthority[1] = newName;
    await contract.actionMethodSend("AuthorityData", authorityDataAddress, 'update_authority', oneAuthority);
    authorityInfo = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_info_by_name', newName);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityData Contract method update_authority assertion failed!!!');

    // remove_authority
    await contract.actionMethodSend("AuthorityData", authorityDataAddress, 'remove_authority', adminAddress);
    allName = await contract.constMethodCall("AuthorityData", authorityDataAddress, 'get_all_name');
    assert.ok(JSON.stringify(allName) === '[]', 'AuthorityData Contract method remove_authority assertion failed!!!');

    console.log('AuthorityData contract test passed');
}


exports.AuthorityDataTest = AuthorityDataTest;