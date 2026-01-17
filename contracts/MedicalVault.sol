// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalVault {
    struct Record {
        string ipfsHash;
        string encryptedKey;
        address patient;
    }

    // Patient Address => Doctor Address => Medical Record
    mapping(address => mapping(address => Record)) public accessRegistry;

    event AccessGranted(address indexed patient, address indexed doctor, string ipfsHash);

    // This is called by your frontend after the backend returns the IPFS hash
    function shareWithDoctor(address _doctor, string memory _hash, string memory _key) public {
        accessRegistry[msg.sender][_doctor] = Record(_hash, _key, msg.sender);
        emit AccessGranted(msg.sender, _doctor, _hash);
    }

    // The doctor calls this to retrieve the 'sealed envelope'
    function getSharedRecord(address _patient) public view returns (string memory, string memory) {
        Record memory rec = accessRegistry[_patient][msg.sender];
        require(rec.patient != address(0), "No access granted");
        return (rec.ipfsHash, rec.encryptedKey);
    }
}