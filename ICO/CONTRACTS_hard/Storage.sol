pragma solidity ^0.4.11;

import './SafeMath.sol';
import './Initializable.sol';

contract DEX_StateStorage is Initializable {
    using SafeMath for uint;
    
    address public treasury;
    
    address public ICO_contract;
    
    address public frontend_contract;
    mapping(address => uint) public balances;
    mapping(address => uint) public dividends_paid;
    
    uint256 public total_Supply;
    
    string public name = "Dexaran Treasury Token";
    string public symbol = "DEX";
    uint8 public decimals = 18;
    
    uint256 public total_Dividends;
    uint256 public total_Paid;
    
    function Load(address _ICO, address __treasury, address __frontend_contract) only_init
    {
        ICO_contract = _ICO;
        treasury = __treasury;
        frontend_contract = __frontend_contract;
    }
    
    function name() constant returns (string) { return name; }
    function symbol() constant returns (string) { return symbol; }
    function decimals() constant returns (uint8) {return decimals;}
    
    function totalSupply() constant returns (uint256 _supply)
    {
        return total_Supply;
    }
    
    function totalPaid() constant returns (uint256 _payment)
    {
        return total_Paid;
    }
    
    function totalDividends() constant returns (uint256 _dividends)
    {
        return total_Dividends;
    }

    function balanceOf(address _owner) constant returns (uint _balance)
    {
        return balances[_owner];
    }
    
    function dividendsPaid(address _owner) constant returns (uint _dividends)
    {
        return dividends_paid[_owner];
    }
    
    function increase_payment(address _owner, uint256 _amount) only_frontend
    {
        dividends_paid[_owner] = dividends_paid[_owner].add(_amount);
    }
    
    function decrease_payment(address _owner, uint256 _amount) only_frontend
    {
        dividends_paid[_owner] = dividends_paid[_owner].sub(_amount);
    }
    
    function increase_balance(address _owner, uint256 _amount) only_frontend
    {
        balances[_owner] = balances[_owner].add(_amount);
    }
    
    function decrease_balance(address _owner, uint256 _amount) only_frontend
    {
        balances[_owner] = balances[_owner].sub(_amount);
    }
    
    
    function on_Dividend_Payment(address _owner, uint256 _amount) only_treasury
    {
        total_Paid = total_Paid.add(_amount);
        dividends_paid[_owner] = dividends_paid[_owner].add(_amount);
    }
    
    function on_Income(uint256 _value) only_treasury
    {
        total_Dividends = total_Dividends.add(_value);
    }
    
    /** ICO **/
    
    function ICO_give_token(address _destination, uint256 _amount) only_ICO
    {
        balances[_destination] = balances[_destination].add(_amount);
        total_Supply = total_Supply.add(_amount);
    }
    
    function ICO_shutdown() only_ICO
    {
        ICO_contract = 0x0;
    }
    
    
     /** DEBUGGING FUNCTIONS **/
     
    
    function frontend_Updated(address _newContract) only_frontend not_on_ICO
    {
        frontend_contract = _newContract;
    }
    
    modifier share_required(uint256 _requirement)
    {
        if(balanceOf(msg.sender) <= (totalSupply().mul(_requirement)).div(100))
        {
            throw;
        }
        _;
    }
    
    modifier only_frontend
    {
        if(msg.sender != frontend_contract)
        {
            throw;
        }
        _;
    }
    
    modifier only_treasury
    {
        if(msg.sender != treasury)
        {
            throw;
        }
        _;
    }
    
    modifier only_ICO
    {
        if(msg.sender != ICO_contract)
        {
            throw;
        }
        _;
    }
    
    modifier not_on_ICO
    {
        if(ICO_contract != 0x0)
        {
            throw;
        }
        _;
    }
}