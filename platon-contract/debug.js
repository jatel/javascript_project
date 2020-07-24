var contract = require("./contract");

async function contractTest(){
    var nothing = await contract.deployContract("nothing");
    await contract.actionMethodSend("nothing", nothing, 'do_nothing');
}

contractTest()

