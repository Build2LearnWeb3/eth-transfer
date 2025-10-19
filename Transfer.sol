// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transfer {
    address public owner;

    event Sent(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function send(address payable _to) public payable {
        require(_to != address(0), "Cannot send to zero address");
        _to.transfer(msg.value);
        emit Sent(msg.sender, _to, msg.value);
    }
}
