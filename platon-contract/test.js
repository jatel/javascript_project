var contract = require("./contract");
var RoleContract = require("./RoleContractTest");
var AuthorityData = require("./AuthorityDataTest");
var AuthorityController = require("./AuthorityControllerTest");
var PidContract = require("./PidContractTest");
var PctData = require("./PctDataTest");
var PctController = require("./PctControllerTest");
var CredentialContract  = require("./CredentialContractTest");

var json2csv = require('json2csv');
var fs = require("fs");
var path = require("path");

// admin address
var adminAddress = contract.deployFrom;

async function contractTest(){
    // deploy and test RoleContract
    var roleContractAddress = await contract.deployContract("RoleContract", adminAddress);
    await RoleContract.RoleContractTest(roleContractAddress, adminAddress);

    // deploy and test AuthorityData
    var authorityDataAddress = await contract.deployContract("AuthorityData", roleContractAddress);
    await AuthorityData.AuthorityDataTest(authorityDataAddress, adminAddress);

    // deploy and test AuthorityController
    var authorityControllerAddress = await contract.deployContract("AuthorityController", roleContractAddress, authorityDataAddress);
    await AuthorityController.AuthorityControllerTest(authorityControllerAddress, adminAddress);

    // set_authority_controller_address
    await contract.actionMethodSend("RoleContract", roleContractAddress, 'set_authority_controller_address', authorityControllerAddress);

    // deploy and test PidContract
    var PidContractAddress = await contract.deployContract("PidContract", roleContractAddress);
    await PidContract.PidContractTest(PidContractAddress, adminAddress);

    // deploy and test PctData
    var PctDataAddress = await contract.deployContract("PctData", roleContractAddress);
    await PctData.PctDataTest(PctDataAddress, adminAddress);

    // deploy and test PctController
    var PctControllerAddress = await contract.deployContract("PctController", roleContractAddress, PctDataAddress);
    await PctController.PctControllerTest(PctControllerAddress, adminAddress);

    // deploy and test CredentialContract
    var CredentialContractAddress = await contract.deployContract("CredentialContract", roleContractAddress);
    await CredentialContract.CredentialContractTest(CredentialContractAddress);
}

async function runTest() {
    try{
        await contractTest()
    } catch(e){
        console.log("error:", e.message);
    }

    // write csv file
    const csvInfo = await json2csv.parse(contract.gasJson,  ['coantract', 'method', 'gasUsed:']);
    fs.writeFile(path.join(__dirname, 'gasUsed.csv'), csvInfo, function(err){
        if (err) {
            console.log("error:", err);
        }
    });
}

runTest();
