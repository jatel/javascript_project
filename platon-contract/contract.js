var fs_extra = require("fs-extra");
var fs = require("fs")
var Web3 = require('web3')

// deploy and call contract address
var contractDirectory = "../build/";
var formAccount = "lax1yjjzvjph3tw4h2quw6mse25y492xy7fzwdtqja";
var gas = 999999;
var gasPrice = 50000000004;

// web3 object
var provider = new Web3.providers.HttpProvider(
    `http://10.1.1.5:6789`,
    { keepAlive: false }
);
var web3 = new Web3(provider);

// unlock account
//web3.platon.personal.importRawKey("b7a7372e78160f71a1a75e03c4aa72705806a05cf14ef39c87fdee93d108588c", "123456");
web3.platon.personal.unlockAccount("lax1yjjzvjph3tw4h2quw6mse25y492xy7fzwdtqja", "123456", 99999);

async function deployContract(contractName, args) {
    try {
        // find contractName.wasm exist in dictory
        var binPath = contractDirectory + contractName + ".wasm";
        var checkFile = fs.existsSync(binPath);
        if(!checkFile) {
            throw new Error("contract does not compile, not allow to deploy");
        }

        // deploy parameter
        var contract = new web3.platon.Contract([], formAccount, { vmType: 1 }); 
        var bin = (await fs_extra.readFile(binPath)).toString("hex");
        var params = {};
        params.data = contract.deploy({
            data: bin,
            arguments: JSON.parse(args)
        }).encodeABI();
        params.from = formAccount;
        params.gas = gas;
        params.gasPrice = gasPrice;
        
        // deploy contract
        const receipt = await web3.platon.sendTransaction(params);
        console.log("deploy: ", receipt);
        if (receipt.status !== undefined && !receipt.status) {
            throw new Error("Failed to deploy wasm contract");
        }
        return receipt.contractAddress;
    } catch(error) {
        console.trace("error: ", error);
    }
}


async function actionMethodSend(contractName, contractAddress, method, args){
    try {
        // find contractName.wasm exist in dictory
        var abiPath = contractDirectory + contractName + ".abi.json";
        if(!fs.existsSync(abiPath)){
            throw new Error("contract does not compile, not allow to deploy");
        }

        // ACTION method
        var abi = JSON.parse(await fs_extra.readFileSync(abiPath, "utf8"));
        var contract = new web3.platon.Contract(abi, contractAddress, {vmType: 1 });
        var sendResult = await contract.methods[method](JSON.parse(args)).send({from: formAccount, gas: 999999});
        console.log("send: ",sendResult);
        return sendResult;
    } catch(error) {
        console.trace("error: ", error);
    }
}

async function constMethodCall(contractName, contractAddress, method, args){
    try {
        // find contractName.wasm exist in dictory
        var abiPath = contractDirectory + contractName + ".abi.json";
        if(!fs.existsSync(abiPath)){
            throw new Error("contract does not compile, not allow to deploy");
        }

        // ACTION method
        var abi = JSON.parse(await fs_extra.readFileSync(abiPath, "utf8"));
        var contract = new web3.platon.Contract(abi, contractAddress, {vmType: 1 });
        var callResult
        if("[]" == args) {
            callResult = await contract.methods[method]().call();
        }else{
            callResult = await contract.methods[method](JSON.parse(args)).call();
        }
        console.log("call: ",callResult);
        return callResult;
    } catch(error) {
        console.trace("error: ", error);
    }
}


module.exports = {
    deployContract :deployContract, 
    actionMethodSend:actionMethodSend,
    constMethodCall:constMethodCall
}


