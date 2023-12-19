// SPDX-License-Identifier: MIT

/*
　　　　 　　 ＿＿
　　　 　　／＞　　フ
　　　 　　| 　_　 _ l
　 　　 　／` ミ＿xノ
　　 　 /　　　 　 |
　　　 /　 ヽ　　 ﾉ
　 　 │　　|　|　|
　／￣|　　 |　|　|
　| (￣ヽ＿_ヽ_)__)
　＼二つ ​
*/

pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./base/AllowedAddress.sol";

contract DailyMood is Ownable, AllowedAddress {
    struct Mood {
        uint256 timestamp;
        string mood;
    }

    mapping(address => Mood[]) private moods;

    constructor(
        address initialOwner,
        address[] memory allowedAddresses
    ) Ownable(initialOwner) AllowedAddress(allowedAddresses) {}

    function addAllowedAddress(
        address address_
    ) public onlyOwner returns (bool success) {
        return _addAllowedAddress(address_);
    }

    function removeAllowedAddress(
        address address_
    ) public onlyOwner returns (bool success) {
        return _removeAllowedAddress(address_);
    }

    function getMoodsLength(
        address address_
    ) public view returns (uint256 length) {
        return moods[address_].length;
    }

    function getMoodByIndex(
        address address_,
        uint256 index
    ) public view returns (uint256 timestamp, string memory mood) {
        require(index < moods[address_].length, "Index out of bounds");
        return (moods[address_][index].timestamp, moods[address_][index].mood);
    }

    function pushMood(string memory mood) public onlyAllowedAddress {
        moods[msg.sender].push(Mood(block.timestamp, mood));
    }

    function updateMoodByIndex(
        uint256 index,
        string memory mood
    ) public onlyAllowedAddress {
        require(index < moods[msg.sender].length, "Index out of bounds");
        moods[msg.sender][index].mood = mood;
    }

    function removeMoods(address address_) public {
        require(
            (msg.sender == address_ && isAllowedAddress(msg.sender)) ||
                msg.sender == owner(),
            "Target address not allowed"
        );

        delete moods[address_];
    }

    function removeMoodByIndex(address address_, uint256 index) public {
        require(
            (msg.sender == address_ && isAllowedAddress(msg.sender)) ||
                msg.sender == owner(),
            "Target address not allowed"
        );

        require(index < moods[address_].length, "Index out of bounds");

        for (uint256 i = index; i < moods[address_].length - 1; i++) {
            moods[address_][i] = moods[address_][i + 1];
        }

        moods[address_].pop();
    }
}
