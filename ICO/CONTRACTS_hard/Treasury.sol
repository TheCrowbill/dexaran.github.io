pragma solidity ^0.4.11;

import './SafeMath.sol';
import './Storage.sol';
import './Initializable.sol';

contract Treasury is Initializable {
    
    event Income(address indexed _sender, uint256 indexed _amount);
    event Claim(address indexed _claimer, uint256 indexed _amount);
    
    using SafeMath for uint;
    
    address public state_storage;
    DEX_StateStorage db;
    
    function Load(address __state_storage) only_init
    {
        state_storage = __state_storage;
        db = DEX_StateStorage(state_storage);
    }
    
    
    function() payable
    {
        db.on_Income(msg.value);
        Income(msg.sender, msg.value);
    }
    
    function get_Dividends_Available(address _owner) constant returns (uint256 _dividends)
    {
        return (db.balanceOf(_owner)/(db.totalSupply()) * (db.total_Dividends() / db.total_Paid()) - (db.dividendsPaid(_owner)));
    }
    
    function claim_Dividends(address _owner)
    {
        if(_owner.send(get_Dividends_Available(_owner)))
        {
            db.on_Dividend_Payment(_owner, get_Dividends_Available(_owner));
            Claim(_owner,get_Dividends_Available(_owner));
        }
    }
}