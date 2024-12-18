// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) {
    totalSupply = _initialSupply;
  }

  function increaseSupply(uint256 _amount) public {
    require(_amount > 0, "Amount must be greater than 0");
    totalSupply += _amount;
  }

  function getCurrentSupply() public view returns (uint256) {
    return totalSupply;
  }
}