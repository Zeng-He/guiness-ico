//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GuinessToken is ERC20 {
    constructor(string memory name, string memory symbol, uint amount) ERC20(name, symbol) {
        _mint(msg.sender, amount);
        // _mint(msg.sender, amount * (10 ** 18));
    }

    function decimals() public view virtual override returns (uint8) {
        return 1;
    }
}
