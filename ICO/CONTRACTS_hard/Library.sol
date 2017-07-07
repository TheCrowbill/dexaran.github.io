pragma solidity ^0.4.11;

import './Storage.sol';
import './SafeMath.sol';
import './Initializable.sol';


contract ERC223ReceivingContract
{
    function tokenFallback(address, uint256, bytes) {}
}

contract DEX_LogicLibrary is Initializable {
    
    event Transfer(address indexed from, address indexed to, uint value, bytes indexed data);
    DEX_StateStorage db;

    /*modifier onlyPayloadSize(uint size) {
        require(msg.data.length >= size + 4);
        _;
    }*/
    
    function Load(address _state_storage) only_init
    {
        db = DEX_StateStorage(_state_storage);
    }

    function transfer(address _to, uint _value, bytes _data) {
        address _storage = 0x793C4D0B3Ccab34C14b15AAB3c913F63F5092284;
        
        uint codeLength;
        assembly {
            codeLength := extcodesize(_to)
        }
        
        _storage.call(bytes4(sha3("decrease_balance(address,uint256)")), msg.sender, _value);
        _storage.call(bytes4(sha3("increase_balance(address,uint256)")), _to, _value);
        _storage.call(bytes4(sha3("decrease_payment(address,uint256)")), msg.sender, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));
        _storage.call(bytes4(sha3("increase_payment(address,uint256)")), _to, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));

        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        Transfer(msg.sender, _to, _value, _data);
    }
    
    function transfer(address _to, uint _value) {
        address _storage = 0x793C4D0B3Ccab34C14b15AAB3c913F63F5092284;
        
        uint codeLength;
        bytes memory _empty;

        assembly {
            codeLength := extcodesize(_to)
        }
        
        _storage.call(bytes4(sha3("decrease_balance(address,uint256)")), msg.sender, _value);
        _storage.call(bytes4(sha3("increase_balance(address,uint256)")), _to, _value);
        _storage.call(bytes4(sha3("decrease_payment(address,uint256)")), msg.sender, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));
        _storage.call(bytes4(sha3("increase_payment(address,uint256)")), _to, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));
        
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            
            receiver.tokenFallback(msg.sender, _value, _empty);
        }
        Transfer(msg.sender, _to, _value, _empty);
    }

    function transfer(address _to, uint _value, bytes _data, string _custom_fallback) {
        address _storage = 0x793C4D0B3Ccab34C14b15AAB3c913F63F5092284;
        
        uint codeLength;
        assembly {
            codeLength := extcodesize(_to)
        }

        _storage.call(bytes4(sha3("decrease_balance(address,uint256)")), msg.sender, _value);
        _storage.call(bytes4(sha3("increase_balance(address,uint256)")), _to, _value);
        _storage.call(bytes4(sha3("decrease_payment(address,uint256)")), msg.sender, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));
        _storage.call(bytes4(sha3("increase_payment(address,uint256)")), _to, (db.balanceOf(msg.sender)/(db.dividendsPaid(msg.sender))*(_value)));
        
        if(codeLength>0) {
            _to.call(bytes4(sha3(_custom_fallback)), msg.sender, _value, _data);
        }
        Transfer(msg.sender, _to, _value, _data);
    }
}