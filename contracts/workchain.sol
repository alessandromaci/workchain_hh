//SPDX-License-Identifier: MIT

// work agreements as NFTs. requester/executer OK
// mint a new nft (nft = workrequest) OK
// nft should have in the metadata a link with the contract + image OK
// set an image by default 
// add a link with some text that should be stored somewhere OK
// make possible to upload file automatically to IPFS
// minting also locks an amount in the SC OK
// the provider buys the nft OK
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

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
            if (_i == 0) {
                return "0";
            }
            uint j = _i;
            uint len;
            while (j != 0) {
                len++;
                j /= 10;
            }
            bytes memory bstr = new bytes(len);
            uint k = len;
            while (_i != 0) {
                k = k-1;
                uint8 temp = (48 + uint8(_i - _i / 10 * 10));
                bytes1 b1 = bytes1(temp);
                bstr[k] = b1;
                _i /= 10;
            }
            return string(bstr);
        }

    function formatTokenURI(string memory _name, string memory _filePath, uint256 _offeredPrice) public pure returns(string memory) {
        string memory baseURL = "data:application/json;base64,";
        string memory _offeredPriceString = uint2str(_offeredPrice);
        string memory tokenURI = string(abi.encodePacked(
            baseURL,
            Base64.encode(
                bytes(abi.encodePacked(
                    '{"name": "',_name ,'", ', 
                    '"description": "ipfs//',_filePath ,'", ', 
                    '"attributes": [{"trait_type":"price", "value":"',_offeredPriceString ,'"}], ', 
                    '"image": "ipfs//QmNnm8yz15m5f2qzL4LVJ2TBkCjQf93XnXMxMBbn4FPzSt"}'
                    )))));

        return tokenURI;
    }

    function createWork(string memory _name, string memory _filePath, uint256 _offeredPrice) payable public {

        require(msg.value == _offeredPrice, "You need to transfer an equal amount of money to the offered price in the contract");

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
        workIdStatus[_tokenId] = workStatus.Work_Ongoing;
    }

    function closeWork(uint256 _tokenId) payable public {
        // locked amount is transfered back to the owner
        payable(ownerOf(_tokenId)).transfer(workIdToPrice[_tokenId]);

        // burn token
        _burn(_tokenId);
    }
}