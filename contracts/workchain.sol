//SPDX-License-Identifier: MIT

// work agreements as NFTs. requester/executer
// mint a new nft (nft = workrequest)
// nft should have in the metadata a link with the contract + image
// minting also locks an amount in the SC
// the provider buys the nft 
// burn the nft when work completed
// request burning transfers the locked amount to the executer  

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

contract Workchain is ERC721URIStorage {

    // the enumeration of work contracts created
    uint256 public workId; 
    enum workStatus {
        Work_Requested,
        Work_Ongoing
    }

    mapping(uint256 => uint256) public workIdToPrice;
    mapping(uint256 => workStatus) public workIdStatus;


    constructor() ERC721("Workchain", "WR") {
        workId = 0;
    }

    function formatTokenURI(string memory _name, string memory _filePath, uint256 _offeredPrice) public pure returns(string memory) {
        string memory baseURL = "data:application/json;base64,";
        string memory tokenURI = string(abi.encodePacked(
            baseURL,
            Base64.encode(
                bytes(abi.encodePacked(
                    '{"name": "',_name ,'", ', 
                    '"description": "',_filePath ,'", ', 
                    '"attributes": "{price: ',_offeredPrice ,'}", ', 
                    '"image": ""}'
                    )))));

        return tokenURI;
    }

    function createWork(string memory _name, string memory _filePath, uint256 _offeredPrice) payable public {

        // require(msg.value == _offeredPrice, "You need to transfer an equal amount of money to the offered price in the contract");

        // an nft gets minted and then it updates the work ID
        _mint(msg.sender, workId);

        //assign the formatterd tokenURI to the newly created NFT
        string memory _tokenURI = formatTokenURI(_name, _filePath, _offeredPrice);
        _setTokenURI(workId, _tokenURI);

        //mapping between the nft & price. Also, mapping to show work status
        workIdToPrice[workId] = _offeredPrice;
        workIdStatus[workId] = workStatus.Work_Requested;

        workId += 1;
    }

    function requestWork(uint256 _tokenId) public {
        //transfer
        _transfer(ownerOf(_tokenId), msg.sender, _tokenId);
        
        // work status updated
        workIdStatus[workId] = workStatus.Work_Ongoing;
    }

    function closeWork(uint256 _tokenId) payable public {
        // locked amount is transfered back to the owner
        payable(ownerOf(_tokenId)).transfer(workIdToPrice[_tokenId]);

        // burn token
        _burn(_tokenId);
    }
}