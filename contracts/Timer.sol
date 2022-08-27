// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Timer {
    uint256 public timestamp;
    uint256 public changedAt;

    function setCountdownTo(uint256 timestamp_) public {
        timestamp = timestamp_;
        changedAt = block.timestamp;
    }

    function countdown () public view returns (uint256 secondsLeft) {
        secondsLeft = timestamp - block.timestamp;
    }
}
