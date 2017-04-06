

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
    var contractFunctions = [];
    var selectedFunction;


    window.onload = function() {
dropdownContract();
$('#paneContract').show();
$('#readWriteContract').show();
$('#divSelectedFuncTx').show();

    }





    function funcSelected(index) {
      var rawAbi = $('#tatAbi').val();
      selectedFunction = contractFunctions[index];
      
      //Readable function with no param inputs
      if (!(contractFunctions[index].inputs.length > 0)) {
           // alert("Readable!");

        }
        //Function with param inputs
        else {
          //alert("Function with inputs");

          var divParamStr="";
          divParamStr += String(`<h4>` + transformToFullName(selectedFunction) + ` </h4>`);
    
          for (var i in contractFunctions[index].inputs) {
            //alert(contractFunctions[index].inputs[i].type);

           switch (contractFunctions[index].inputs[i].type) {
              case "uint256":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-unit256">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="number (example: 12345)"/>
          </p>
        </div>`);
                break;
              case "bytes":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-bytes">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="bytes (example: 1011011010101010)"/>
          </p>
        </div>`);
                break;
              case "string":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-string">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="text (example: Type text here!)"/>
          </p>
        </div>`);
                break;
              case "bool":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-boolean">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <span class="radio"><label><input id="param-` +i+ `-true" type="radio" value="true" name="optradio-` +contractFunctions[index].inputs[i].name+ `">True</label></span>
            <span class="radio"><label><input id="param-` +i+ `-false" type="radio" value="false" name="optradio-` +contractFunctions[index].inputs[i].name+ `">False</label></span>
          </p>
        </div>`);
                break;
              case "address":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-address">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="address (example: 0x01000b5fe61411c466b70631d7ff070187179bbf)"/>
          </p>
        </div>`);
                break;
          }
        }
        $('#divParam').html(divParamStr);
        //getContractTxData();
      }
    }


    function readFromContract() {
      var msgCall = getContractTxData();


      var rawCallTx = {
      to: contractAddress,
      data: msgCall
    };


   /* var privateKey = new Buffer(PrivKey, 'hex');

    txUpdate.sign(privateKey);

    var serializedRegTx = '0x' + txUpdate.serialize().toString('hex');
      var rdataUpdate = {
        raw: JSON.stringify(rawUpdatenameTx),
        signed: serializedRegTx
      } */
     web3.eth.call(rawCallTx, function(err, result) {
        if(err) {
          alert(err);
       }
        else {
          alert(result);
        }
      }); 
    }



/*
    function readFromContract() {
        ajaxReq.getEthCall({ to: $scope.contract.address, data: $scope.getTxData() }, function (data) {
            if (!data.error) {
                var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
                var outTypes = curFunc.outputs.map(function (i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''));
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber) curFunc.outputs[i].value = decoded[i].toFixed(0);else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;
        });
    };

    }
*/

    function getContractTxData() {
        var curFunc = selectedFunction;
        var fullFuncName = transformToFullName(curFunc);

        var funcSig = getFunctionSignature(fullFuncName);

        var typeName = extractTypeName(fullFuncName);

        var types = typeName.split(',');
        types = types[0] == "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
          if(curFunc.inputs[i].type == 'bool') {
            values.push($('#param-'+i+'-true').prop("checked"));
          }
          else {
            values.push($('#param-'+i).val());
          }
         // alert(types[i]);

             // alert(curFunc.inputs[i].value);
           /* if (curFunc.inputs[i].value) {
               // if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));else values.push(curFunc.inputs[i].value);
            } else values.push(''); */
        }
        var result = "0x";
        result += funcSig;
        result += ethUtil.solidityCoder.encodeParams(types, values);
        var decodedRes = ethUtil.solidityCoder.decodeParams(types, ethUtil.solidityCoder.encodeParams(types, values));
        alert(decodedRes);
        return result;
    }




    function dropdownContract() {

      var tmpStr = "";
      var rawAbi = `[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]`;
      try {
        $('#contractAbiStatus').html(" ");
        var tAbi = JSON.parse(rawAbi);
        contractFunctions = [];
        for (var i in tAbi) if (tAbi[i].type == "function") {
          contractFunctions.push(tAbi[i]);
        }
        for (var i in contractFunctions) {
          contractFunctions[i].name;
          tmpStr += '<li ><a id="li' +contractFunctions[i].name+ '" onclick="funcSelected('+ i +')">' +contractFunctions[i].name+ '</a></li>';
        }
        $('#functionsDropdownList').html(tmpStr);
        $('#readWriteContract').show();
          $('#contractAbiStatus').html('<p class="text-center text-success"><strong> ABI is valid </strong></p>');
            //$scope.showReadWrite = true;
        } catch (e) {
          $('#readWriteContract').hide();
          $('#contractAbiStatus').html('<p class="text-center text-danger"><strong> No valid ABI found! </strong>'+ '<small><br>'+ e +'</small></p>');
        }
        funcSelected(0);
    }

    function initContract() {
      var rawAbi = $('#tatAbi').val();
      try {
        var tAbi = JSON.parse($('#tatAbi').val());
        alert(tAbi[4].type);
        contractFunctions = [];
        for (var i in tAbi) if (tAbi[i].type == "function") {
          contractFunctions.push(tAbi[i]);
        }

          alert(contractFunctions.length);


            //$scope.showReadWrite = true;
        } catch (e) {
            alert(e);
        }
    };







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
    
