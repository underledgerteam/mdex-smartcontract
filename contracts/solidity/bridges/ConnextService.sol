//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnextHandler.sol";
import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../interfaces/IMdexCrossChainSwap.sol";
import "../interfaces/IMdexService.sol";
import "../amm/periphery/interfaces/IUniswapV2Router02.sol";

contract ConnextService is Ownable, Pausable, IMdexCrossChainSwap {
    IConnextHandler public immutable connext;
    address public immutable promiseRouter;
    address private mdexCrossChain;
    IUniswapV2Router02 public ROUTER;

    mapping(uint32 => address) public mdexBridgeAddress;
    mapping(uint32 => address) public assetAddress;

    modifier onlyPromiseRouter() {
        require(msg.sender == address(promiseRouter), "Expected PromiseRouter");
        _;
    }

    constructor(
        IConnextHandler _connext,
        address _promiseRouter,
        address _mdexCrossChain
    ) IMdexCrossChainSwap(_mdexCrossChain) {
        connext = _connext;
        promiseRouter = _promiseRouter;
        mdexCrossChain = _mdexCrossChain;
    }

    function setBridgeAddress(uint32 domainId, address brideAddress) public onlyOwner {
        mdexBridgeAddress[domainId] = brideAddress;
    }

    function setAsset(uint32 domainId, address tokenAdress) public onlyOwner {
        assetAddress[domainId] = tokenAdress;
    }

    function serRouter(IUniswapV2Router02 router) public onlyOwner {
        ROUTER = router;
    }

    function execute(bytes calldata payload) external whenNotPaused returns (bytes calldata) {
        address[] memory path = new address[](2);
        address reciever;
        address tokenRecieve;
        uint256 amount;
        uint32 destinationDomain;
        (reciever, tokenRecieve, amount, destinationDomain) = abi.decode(payload, (address, address, uint256, uint32));
        path[0] = assetAddress[destinationDomain];
        path[1] = tokenRecieve;
        IERC20(assetAddress[destinationDomain]).approve(address(ROUTER), amount);
        uint256[] memory amountOutMin = ROUTER.getAmountsOut(amount, path);
        ROUTER.swapTokensForExactTokens(amountOutMin[1], amount, path, reciever, block.timestamp);

        return payload;
    }

    function connextSwap(uint256 amount, bytes calldata payload) internal {
        uint32 originDomain;
        uint32 destinationDomain;
        address sender;
        address tokenDestinationAddress;

        (sender, tokenDestinationAddress, originDomain, destinationDomain) = abi.decode(
            payload,
            (address, address, uint32, uint32)
        );

        IERC20(assetAddress[originDomain]).transferFrom(msg.sender, address(this), amount);
        IERC20(assetAddress[originDomain]).approve(address(connext), amount);

        bytes memory data = abi.encode(sender, tokenDestinationAddress, amount, destinationDomain);

        bytes4 selector = bytes4(keccak256("execute(bytes)"));
        bytes memory callData = abi.encodeWithSelector(selector, data);

        CallParams memory callParams = CallParams({
            to: mdexBridgeAddress[destinationDomain],
            callData: callData,
            originDomain: originDomain,
            destinationDomain: destinationDomain,
            agent: sender,
            recovery: sender,
            forceSlow: false,
            receiveLocal: false,
            callback: address(this),
            callbackFee: 0,
            relayerFee: 0,
            slippageTol: 9995
        });

        XCallArgs memory xcallArgs = XCallArgs({
            params: callParams,
            transactingAssetId: assetAddress[originDomain],
            amount: amount
        });

        connext.xcall(xcallArgs);
    }

    function _swap(uint256 amount, bytes calldata payload) internal override {
        require(msg.sender == address(mdexCrossChain), "Only Mdex Cross-Chain Call");
        connextSwap(amount, payload);
    }

    function callback(
        bytes32 transferId,
        bool success,
        bytes memory data
    ) external onlyPromiseRouter {
        uint256 newValue = abi.decode(data, (uint256));
    }
}
