//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GuinessKyc is Ownable {
    mapping (address => bool) allowed;

    function setKycCompleted(address addr) public onlyOwner {
        allowed[addr] = true;
    }

    function removeKyc(address addr) public onlyOwner {
        allowed[addr] = false;
    }

    function isKycCompleted(address addr) public view returns(bool) {
        return allowed[addr];
    }
}