//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnextHandler.sol";
import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ConnextBridgeToken is  Ownable, Pausable {
    IConnextHandler public immutable connext;
    address public immutable bridgeController;
    struct BridgeInfo {
        uint128 chainId;
        string chainName;
        uint32 chainDomainId;
        address bridgeAddress;
    }

    mapping(uint128 => address) public controllerAddress;
    mapping(uint128 => BridgeInfo) public BridgeInfoData;
    mapping(uint128 => address) public stableContract;


    event BridgeEvent(address user, uint256 amount);
    event ExecuteEvent(address user, uint256 amount);
    constructor(
        uint128 sourcChainId,
        address _controller,
        IConnextHandler _connext
    ) {
        controllerAddress[sourcChainId] = _controller;
        connext = _connext;
        bridgeController = _controller;
    }

    function addChainInfo(
        string memory _chainName,
        uint128 _chainId,
        uint32 _chainDomainId,
        address _bridgeAddress
    ) external onlyOwner {
        BridgeInfoData[_chainId] = BridgeInfo({
            chainId: _chainId,
            chainName: _chainName,
            chainDomainId: _chainDomainId,
            bridgeAddress: _bridgeAddress
        });
    }

    function addStableCoin(uint128 _chainId, address _address) external onlyOwner {
        stableContract[_chainId] = _address;
    }

    function execute(bytes calldata payload) external whenNotPaused {
        address sender;
        address tokenAddress;
        uint128 sourcChainId;
        uint128 destinationChainId;
        uint256 amount;

        (sender, tokenAddress, sourcChainId, destinationChainId, amount) = abi
            .decode(payload, (address, address, uint128, uint128, uint256));

        emit ExecuteEvent(sender, amount);   
    }


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    function _bridgeConnext(
        uint256 amount,
        uint128 sourcChainId,
        bytes calldata header
    ) public {
        address sender;
        address tokenAddress;
        uint128 destinationChainId;

        (sender, tokenAddress, destinationChainId) = abi.decode(
            header,
            (address, address, uint128)
        );

        require(
            BridgeInfoData[destinationChainId].bridgeAddress != address(0),
            "Bridge Destination Chain is not equal address 0"
        );

        require(
            BridgeInfoData[sourcChainId].bridgeAddress != address(0),
            "Bridge Source Chain is not equal address 0"
        );

        bytes memory payload = abi.encode(
            sender,
            tokenAddress,
            sourcChainId,
            destinationChainId,
            amount
        );

        bytes memory callData = abi.encodeWithSelector(
            this.execute.selector,
            payload
        );

        CallParams memory callParams = CallParams({
            to: BridgeInfoData[destinationChainId].bridgeAddress,
            callData: callData,
            originDomain: BridgeInfoData[sourcChainId].chainDomainId,
            destinationDomain: BridgeInfoData[destinationChainId].chainDomainId,
            recovery: BridgeInfoData[destinationChainId].bridgeAddress,
            callback: address(this),
            callbackFee: 0,
            forceSlow: false,
            receiveLocal: false
        });

        XCallArgs memory xcallArgs = XCallArgs({
            params: callParams,
            transactingAssetId: stableContract[sourcChainId],
            amount: amount,
            relayerFee: 0
        });

        connext.xcall(xcallArgs);

        emit BridgeEvent(sender, amount);
    }

}
