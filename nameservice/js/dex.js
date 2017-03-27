    //var uri = 'https://api.myetherapi.com/rop';
    var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
    var from = web3.eth.coinbase;
    var contractAddress = '0x0e2cec66618f7ca428b1fe01d0de779dbb0f7358';
    /*
    var coinBalance = contract.getCoinAccount.call();
    var energyBalance = contract.getEnergyAccount.call(); */



    window.onload = function() {
        /*var contract = web3.eth.contract(abiArray).at(contractAddress);
        var nameDex = contract.getName("Dexaran");
        document.getElementById('addressOf').innerText = contractAddress;
        document.getElementById('nameOf').innerText = nameDex[1];*/

    }

    function onNameKeyUp() {
    	var contract = web3.eth.contract(abiArray).at(contractAddress);
		var Name = contract.getName("Dexaran");
		document.getElementById('addressOf').innerText = nameDex[1];
    }