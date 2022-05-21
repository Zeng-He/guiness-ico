//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./GuinessKyc.sol";

contract GuinessSale is Crowdsale {

    GuinessKyc __kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        GuinessKyc kyc
    ) Crowdsale(rate, wallet, token)
    {
        __kyc = kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal override view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(__kyc.isKycCompleted(msg.sender), "Kyc is not completed for this account");
    }
}