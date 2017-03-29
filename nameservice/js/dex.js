

      //var uri = 'https://api.myetherapi.com/rop';
    var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
    var from = web3.eth.coinbase;
    var contractAddress = '0x0e2cec66618f7ca428b1fe01d0de779dbb0f7358';
    var contract = web3.eth.contract(abiArray).at(contractAddress);
    var clockingFunc;
    var Name1;
    var accessGas=200000;


    window.onload = function() {

    }


    function dexUpdateName() {
        $("#divUpdateNameValues").show();
        $("#updatenamestatus").hide();
      $("#tarawtxUpdateName").hide();
    }

    function dexUpdateNameSubmit() {

    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce1 = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var gasPrice1 = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit1 = padLeftEven(BNtoHex(new BigNumber(accessGas)));

    var callName = $('#nametoupdatetxt').val();
    var callAddress = $('#updatenameaddress').val();
    var callValue = $('#updatenamevalue').val();



    var dexCallData = contract.updateName.getData(callName, callAddress, callValue);

    var rawUpdatenameTx = {
      nonce: '0x'+nonce1,
      gasPrice: '0x'+gasPrice1,
      gasLimit: '0x'+gasLimit1,
      to: contractAddress,
      value: '0x0',
      data: dexCallData
    };


    var privateKey = new Buffer(PrivKey, 'hex');
    var txUpdate = new Tx(rawUpdatenameTx);

    txUpdate.sign(privateKey);

    var serializedRegTx = '0x' + txUpdate.serialize().toString('hex');
      var rdataUpdate = {
        raw: JSON.stringify(rawUpdatenameTx),
        signed: serializedRegTx
      }


      $("#tarawtxUpdateName").val(rdataUpdate.raw);
      $("#tarawtxUpdateName").show();
      $("#updatenamestatus").show();
      web3.eth.sendRawTransaction(rdataUpdate.signed, function(err, result) {
        if(err) {
 $("#nameUpdateTxStatus").html('<p class="text-center text-success"><strong> ERROR:  ' +err +'</strong></p>');
       }
        else {
          $("#nameUpdateTxStatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
        }
      });
    }

    function onRegisterNameKeyUp() {
        $("#divregNameCosts").hide();
    }

    function onUpdateNameKeyUp() {
        $("#divUpdateNameValues").hide();
    }

    function dexRegName() {
      var currentBlockNumber = web3.eth.blockNumber;
      //var nameregCost = contract.getName($('#newnameregister').val());
      var askName = contract.getName($('#newnameregister').val());
      //if((askName[0]!=0x0) || (askName[1]!=0x0)) {

      if((askName[3]>currentBlockNumber) || (askName[2]=="-avoid")) {
        $('#nameregvalidate').html('<p class="text-danger"><strong> Can not register this name </strong></p>').fadeIn(1000);
        $('#nameregvalidate').html('<p class="text-danger"><strong> Can not register this name </strong></p>').fadeOut(1500);
      } else {
        $('#nameregvalidate').html('<p class="text-success"><strong> Name is available </strong></p>').fadeIn(1000);
        $('#nameregvalidate').html('<p class="text-success"><strong> Name is available </strong></p>').fadeOut(2000);
      $("#divregNameCosts").show();
    }
    }

    function dexRegNameSubmit() {

    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce1 = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var gasPrice1 = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit1 = padLeftEven(BNtoHex(new BigNumber(210000)));

    var dexCallData = contract.registerName.getData($('#newnameregister').val());
    var rawRegnameTx = {
      nonce: '0x'+nonce1,
      gasPrice: '0x'+gasPrice1,
      gasLimit: '0x'+gasLimit1,
      to: contractAddress,
      value: '0x0',
      data: dexCallData
    };


    var privateKey = new Buffer(PrivKey, 'hex');
    var txReg = new Tx(rawRegnameTx);

    txReg.sign(privateKey);

    var serializedRegTx = '0x' + txReg.serialize().toString('hex');
      var rdataReg = {
        raw: JSON.stringify(rawRegnameTx),
        signed: serializedRegTx
      }

      web3.eth.sendRawTransaction(rdataReg.signed, function(err, result) {
        if(err) {
 $("#regnamestatus").html('<p class="text-center text-success"><strong> ERROR:  ' +err +'</strong></p>');
       }
        else {
          $("#regnamestatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
        }
      });
    }

    function dexGenTx() {

try{

    if (PrivKey.length != 64) throw "Invalid Private key, try again";
    if (!$.isNumeric($('#sendtxamount').val()) || $('#sendtxamount').val() <= 0) throw "Invalid amount, try again";
        var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
        $("#tarawtx").val("");
        $("#tasignedtx").val("");
        $("#txsendstatus").html('')

    var toAddress = $('#sendtxaddress').val();
    var sendToName = contract.getName(toAddress);
    if (validateEtherAddress(toAddress)) {

      $("#tareceiver").val('You are sending: '+ $('#sendtxamount').val() +' Ether\nTo: '+ $('#sendtxaddress').val());
    } else {

     toAddress=sendToName[1];
     $("#tareceiver").val('You are sending: '+ $('#sendtxamount').val() +' Ether\nTo: "'+ $('#sendtxaddress').val() +'" \nAddress: '+ toAddress);
    }

    if (!validateEtherAddress(toAddress)) throw "Invalid to Address, try again";
    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var tmpValue = String(toWei($('#sendtxamount').val(), 'ether'));
    var gasPrice = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit = padLeftEven(BNtoHex(new BigNumber(90000))); 
    var value = padLeftEven(BNtoHex(new BigNumber(tmpValue)));

    var rawTx = {
      nonce: '0x'+nonce,
      gasPrice: '0x'+gasPrice,
      gasLimit: '0x'+gasLimit,
      to: toAddress,
      value: '0x'+value,
      data: ''
    };
    var privateKey = new Buffer(PrivKey, 'hex');
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = '0x' + tx.serialize().toString('hex');
      var rdata = {
        raw: JSON.stringify(rawTx),
        signed: serializedTx
      }

      $("#tarawtx").val(rdata.raw);
      $("#tasignedtx").val(rdata.signed);
      $("#divtransactionTAs").show();
      $("#divsendtranaction").show();
      
      $("#confirmAmount").html($('#sendtxamount').val());
      $("#confirmAddress").html(toAddress);
}
   catch (err) {
    $("#txcreatestatus").html('<p class="text-center text-danger"><strong> ' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
    $("#divtransactionTAs").hide();
    $("#divsendtranaction").hide();
  }
  }


    function dexSendTx() {
        web3.eth.sendRawTransaction($("#tasignedtx").val(), function(err, result) {
        $("#txsendstatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
      });
  }

    function dexGetBalance() {
    var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
    var originalBalance = $("#accountAddress").html();
    web3.eth.getBalance(originalBalance, function(err, result){
                            document.getElementById('accountBalance').innerText = String(web3.fromWei(result, 'ether')) + ' ETC';
                    });
    }

    function onNameKeyUp() {

      var Name = document.getElementById('searchname').value;
          
      clearInterval(clockingFunc);
      clockingFunc = setInterval(function(){
        contract.getName(Name, function(error, result){
          if(!error)
                
                $("#ownerOfId").val(result[0]);
                $("#addressOfId").val(result[1]);
                $("#valueOfId").val(result[2]);
                $("#endblockOfId").val(result[3]);
                //$("#signature").val(result[4]); //NOT YET SUPPORTED BY CONTRACT
                /*
              document.getElementById('ownerOfId').value = result[0];
              document.getElementById('addressOfId').value = result[1];
              document.getElementById('valueOfId').value = result[2];
              document.getElementById('endblockOfId').value = result[3];
              */
          //else
              //console.error(error);
      });
      }, 900);
}

    function onAddressKeyUp() {
      //alert("executed!");
      Name1 = $('#sendtxaddress').val();

      $("#linkstrstatus").hide();
      clearInterval(clockingFunc);
      clockingFunc = setInterval(function(){

        if(!validateEtherAddress(Name1)){
        contract.getName(Name1, function(error, result){
          if(!error)
            if(validateEtherAddress(result[1]) && (result[1]!=0x0) && (Name1!="")){
              $('#addressvalidate').html('<p class="text-success"><strong> Valid address: ' + result[1] +'</strong></p>');
              if((result[2][0]=='-') && (result[2][1]=='L') && (result[2][2]==' ')) {
                var linkStr = String(result[2]).substring(3);
                $("#linkstrstatus").show();
                $("#linkstrstatus").html('<a href="'+ linkStr + '">'+ linkStr + '</a>');
              }

            }
            else {
              $('#addressvalidate').html('<p class="text-danger"><strong> Invalid address </strong></p>');
            }
      });
      }
      else {
        $('#addressvalidate').html('<p class="text-success"><strong> Valid address. </strong></p>');
      }


      }, 1000);
      
    }
    
