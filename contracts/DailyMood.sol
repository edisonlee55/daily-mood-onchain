// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract DailyMood is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Mood {
        uint256 timestamp;
        string mood;
    }

    mapping(address => Mood[]) private moods;

    EnumerableSet.AddressSet private allowedAddresses;

    constructor(
        address initialOwner,
        address[] memory _allowedAddresses
    ) Ownable(initialOwner) {
        for (uint i = 0; i < _allowedAddresses.length; i++) {
            allowedAddresses.add(_allowedAddresses[i]);
        }
    }

    modifier onlyAllowedAddresses() {
        require(isAllowedAddress(msg.sender), "Address not allowed");
        _;
    }

    function isAllowedAddress(address _address) public view returns (bool) {
        if (allowedAddresses.contains(address(0))) {
            return true;
        }
        return allowedAddresses.contains(_address);
    }

    function addAllowedAddress(address _address) public onlyOwner {
        allowedAddresses.add(_address);
    }

    function removeAllowedAddress(address _address) public onlyOwner {
        allowedAddresses.remove(_address);
    }

    function getMoods(address _address) public view returns (Mood[] memory) {
        return moods[_address];
    }

    function getMoodByIndex(
        address _address,
        uint256 _index
    ) public view returns (Mood memory) {
        return moods[_address][_index];
    }

    function pushMood(Mood memory _mood) public onlyAllowedAddresses {
        moods[msg.sender].push(_mood);
    }

    function removeMoodByIndex(uint256 _index) public onlyAllowedAddresses {
        delete moods[msg.sender][_index];
    }

    function ownerRemoveMoods(address _address) public onlyOwner {
        delete moods[_address];
    }

    function ownerRemoveMoodByIndex(
        address _address,
        uint256 _index
    ) public onlyOwner {
        delete moods[_address][_index];
    }
}
