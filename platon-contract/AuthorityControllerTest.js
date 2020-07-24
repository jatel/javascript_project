var contract = require("./contract")
var assert = require('assert');

async function AuthorityControllerTest(authorityControllerAddress, adminAddress) {
    console.log('AuthorityController contract testing begins');

    // add_authority
    let name = Buffer.from("jatel", "utf8");
    let accumulate = Buffer.from([10, 10, 10]);
    let extra =  Buffer.from([20, 20, 20]);
    var oneAuthority = [adminAddress, name, 12345, accumulate, extra];
    await contract.actionMethodSend("AuthorityController", authorityControllerAddress, 'add_authority', oneAuthority);

    // is_authority
    var isAuthority = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'is_authority', adminAddress);
    assert.ok(isAuthority, 'AuthorityController Contract method is_authority assertion failed!!!')

    var invalidAddress = "lax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmscn5j";
    isAuthority = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'is_authority', invalidAddress);
    assert.ok(!isAuthority, 'AuthorityController Contract method is_authority assertion failed!!!')

    // get_info_by_address
    var oneRealAuthority = [adminAddress, name, '12345', accumulate, extra];
    var authorityInfo = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_info_by_address', adminAddress);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityController Contract method get_info_by_address assertion failed!!!');

    // get_info_by_name
    authorityInfo = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_info_by_name', name);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityController Contract method get_info_by_name assertion failed!!!');

    // get_accumulate
    var accumulateInfo = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_accumulate', adminAddress);
    assert.ok(JSON.stringify(accumulateInfo) === JSON.stringify(accumulate), 'AuthorityController Contract method get_accumulate assertion failed!!!');

    // get_all_name
    var allName = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_all_name');
    assert.ok(JSON.stringify(allName[0]) === JSON.stringify(name), 'AuthorityController Contract method get_all_name assertion failed!!!');

    // update_authority
    oneAuthority[2] = 456789;
    oneRealAuthority[2] = '456789';
    await contract.actionMethodSend("AuthorityController", authorityControllerAddress, 'update_authority', oneAuthority);
    authorityInfo = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_info_by_name', name);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityController Contract method update_authority assertion failed!!!');

    // update_authority
    let newName = Buffer.from("wht", "utf8");
    oneAuthority[1] = newName;
    oneRealAuthority[1] = newName;
    await contract.actionMethodSend("AuthorityController", authorityControllerAddress, 'update_authority', oneAuthority);
    authorityInfo = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_info_by_name', newName);
    assert.ok(JSON.stringify(authorityInfo) === JSON.stringify(oneRealAuthority), 'AuthorityController Contract method update_authority assertion failed!!!');

    // remove_authority
    await contract.actionMethodSend("AuthorityController", authorityControllerAddress, 'remove_authority', adminAddress);
    allName = await contract.constMethodCall("AuthorityController", authorityControllerAddress, 'get_all_name');
    assert.ok(JSON.stringify(allName) === '[]', 'AuthorityController Contract method remove_authority assertion failed!!!');

    // add_authority
    await contract.actionMethodSend("AuthorityController", authorityControllerAddress, 'add_authority', oneAuthority);

    console.log('AuthorityController contract test passed');
}


exports.AuthorityControllerTest = AuthorityControllerTest;