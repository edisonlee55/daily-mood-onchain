// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract AllowedAddress {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private allowedAddressSet;

    modifier onlyAllowedAddress() {
        require(isAllowedAddress(msg.sender), "Address not allowed");
        _;
    }

    constructor(address[] memory allowedAddresses_) {
        for (uint256 i = 0; i < allowedAddresses_.length; i++) {
            allowedAddressSet.add(allowedAddresses_[i]);
        }
    }

    function isAllowedAddress(
        address address_
    ) public view returns (bool isAllowed) {
        if (allowedAddressSet.contains(address(0))) {
            return true;
        }
        return allowedAddressSet.contains(address_);
    }

    function getAllowedAddressLength() public view returns (uint256 length) {
        return allowedAddressSet.length();
    }

    function getAllowedAddresses()
        public
        view
        returns (address[] memory addresses)
    {
        return allowedAddressSet.values();
    }

    function _addAllowedAddress(
        address address_
    ) internal returns (bool success) {
        return allowedAddressSet.add(address_);
    }

    function _removeAllowedAddress(
        address address_
    ) internal returns (bool success) {
        return allowedAddressSet.remove(address_);
    }
}
