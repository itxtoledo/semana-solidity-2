// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Urna {
    struct Candidato {
        string name;
        uint256 votes;
    }

    mapping(uint8 => Candidato) candidates;

    

    createCandidate(string memory name, uint8 number)   external {
        candidates[number].name = name;
    }
}
