
var contract = require("./contract")
var assert = require('assert');

async function RoleContractTest(roleContractAddress, adminAddress) {
    console.log('RoleContract contract testing begins');

    // get_admin_address
    var adminAddressResult = await contract.constMethodCall("RoleContract", roleContractAddress, 'get_admin_address');
    assert.equal(adminAddressResult, adminAddress, 'RoleContract Contract method get_admin_address assertion failed!!!');

    // set_authority_controller_address
    await contract.actionMethodSend("RoleContract", roleContractAddress, 'set_authority_controller_address', adminAddress);
    var authorityControllerAddress = await contract.constMethodCall("RoleContract", roleContractAddress, 'get_authority_controller_address');
    assert.equal(authorityControllerAddress, adminAddress, 'RoleContract Contract method set_authority_controller_address assertion failed!!!');

    // check_permission
    var checkPermission = await contract.constMethodCall("RoleContract", roleContractAddress, 'check_permission', adminAddress, 200);
    assert.ok(checkPermission, 'RoleContract Contract method check_permission assertion failed!!!');

    var invalidAddress = "lax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmscn5j";
    checkPermission = await contract.constMethodCall("RoleContract", roleContractAddress, 'check_permission', invalidAddress, 200);
    assert.ok(!checkPermission, 'RoleContract Contract method check_permission assertion failed!!!');

    // check_role
    var checkRole = await contract.constMethodCall("RoleContract", roleContractAddress, 'check_role', adminAddress, 100);
    assert.ok(checkRole, 'RoleContract Contract method check_permission assertion failed!!!');

    checkRole = await contract.constMethodCall("RoleContract", roleContractAddress, 'check_role', invalidAddress, 100);
    assert.ok(!checkRole, 'RoleContract Contract method check_permission assertion failed!!!');

    console.log('RoleContract contract test passed');
}

exports.RoleContractTest = RoleContractTest;

