// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Urna {
    struct Candidate {
        bytes32 name;
        uint256 votes;
    }

    uint256 public startDate = 0;
    uint256 public endDate = 0;

    mapping(uint8 => Candidate) public candidates;
    uint8[] public availableCandidates;

    mapping(address => bool) private voted;

    address public immutable manager;

    constructor() {
        manager = msg.sender;
    }

    function setElectionWindow(uint256 startDate_, uint256 endDate_)
        external
        onlyManager
    {
        startDate = startDate_;
        endDate = endDate_;
    }

    function createCandidate(bytes32 name, uint8 number)
        external
        onlyInPreElection
        onlyManager
    {
        require(candidates[number].name == "", "candidate already exists");
        candidates[number].name = name;
        availableCandidates.push(number);
    }

    function vote(uint8 number) external onlyInElectionWindow {
        require(candidates[number].name != "", "candidate does not exist");
        require(!voted[msg.sender], "already voted");

        voted[msg.sender] = true;
        candidates[number].votes += 1;
    }

    function votes() external view returns (Candidate[] memory) {
        Candidate[] memory tCandidates = new Candidate[](
            availableCandidates.length
        );

        for (uint i = 0; i < availableCandidates.length; i++) {
            tCandidates[i] = candidates[availableCandidates[i]];
        }

        return tCandidates;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "only manager");
        _;
    }

    modifier onlyInPreElection() {
        require(block.timestamp < startDate, "election started");
        _;
    }

    modifier onlyInElectionWindow() {
        require(block.timestamp >= startDate, "election dont started yet");
        require(block.timestamp <= endDate, "election has ended");
        _;
    }
}
