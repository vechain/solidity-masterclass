// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ERC20 {
    /// Returns the amount of tokens in existence.
    /// @dev `view` does not modify the state of the contract.
    /// @dev `pure` does not read or modify the state of the contract.
    function totalSupply() external view returns (uint256);

    /// Returns the amount of tokens owned by `account`.
    /// @param account Address of the account.
    function balanceOf(address account) external view returns (uint256);

    /// Moves `amount` tokens from the caller's account to `recipient`.
    /// @param recipient Address of the recipient.
    /// @param amount Amount of tokens to transfer.
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    /// Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom`. This is zero by default.
    /// @param owner Address of the owner.
    /// @param spender Address of the spender.
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /// Sets `amount` as the allowance of `spender` over the caller's tokens.
    /// @param spender Address of the spender.
    /// @param amount Amount of tokens to allow.
    function approve(address spender, uint256 amount) external returns (bool);

    /// Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller's allowance.
    /// @param sender Address of the sender.
    /// @param recipient Address of the recipient.
    /// @param amount Amount of tokens to transfer.
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MyToken is ERC20 {
    string public constant name = "MyToken";
    string public constant symbol = "MTK";
    uint8 public constant decimals = 18;
    uint256 private _totalSupply = 1000000 * 10 ** uint256(decimals);
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor() {
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
