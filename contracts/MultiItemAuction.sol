// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

/// @title MultiItemAuction
/// @author Peter Brooke
/// @dev Multi-item aucton contract
/// @dev    The auction system should allow users to place bids on items and automatically determine the highest bidder when the auction ends.
///    The smart contract should have the following functionality:
///    1. Initialise the auction with a list of items and their starting bids.
///    2. Allow users to place bids on items.
///    3. Automatically determine the highest bidder for each item when the auction ends.
///
/// @custom:dev-run-script scripts/deploy_with_web3.ts
///

contract MultiItemAuction {
    struct Item {
        uint itemId;
        uint startingBid;
        uint highestBid;
        address highestBidder;
        bool active;
    }

    address public auctioneer;
    uint public auctionEndTime;
    mapping(uint => Item) public items;
    mapping(uint => mapping(address => uint)) public pendingReturns;
    uint[] public itemIds;

    event HighestBidIncreased(uint itemId, address bidder, uint amount);
    event AuctionEnded(uint itemId, address winner, uint amount);

    constructor(
        uint _biddingTime,
        uint[] memory _itemIds,
        uint[] memory _startingBids
    ) {
        require(
            _itemIds.length == _startingBids.length,
            "Item IDs and starting bids arrays must have the same length."
        );

        auctioneer = msg.sender;
        auctionEndTime = block.timestamp + _biddingTime;

        for (uint i = 0; i < _itemIds.length; i++) {
            items[_itemIds[i]] = Item({
                itemId: _itemIds[i],
                startingBid: _startingBids[i],
                highestBid: 0,
                highestBidder: address(0),
                active: true
            });
            itemIds.push(_itemIds[i]);
        }
    }

    /// Store `x`.
    /// @param itemId id of the item that is bid on
    /// @dev Places a bid of the amount in 'msg.value' on the item referenced by 'itemId'

    function bid(uint itemId) public payable {
        require(items[itemId].active, "Item does not exist or is not active.");
        require(block.timestamp <= auctionEndTime, "Auction already ended.");
        require(
            msg.value >= items[itemId].startingBid,
            "Bid must be equal or higher than the item's starting bid."
        );
        require(
            msg.value > items[itemId].highestBid,
            "There already is a higher bid."
        );

        if (items[itemId].highestBid != 0) {
            pendingReturns[itemId][items[itemId].highestBidder] += items[itemId]
                .highestBid;
        }

        items[itemId].highestBidder = msg.sender;
        items[itemId].highestBid = msg.value;
        emit HighestBidIncreased(itemId, msg.sender, msg.value);
    }

    function withdraw(uint itemId) public returns (bool) {
        uint amount = pendingReturns[itemId][msg.sender];
        if (amount > 0) {
            pendingReturns[itemId][msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[itemId][msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function endAuction(uint itemId) public {
        require(
            msg.sender == auctioneer,
            "Only the auctioneer can end the auction."
        );
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");
        require(items[itemId].active, "Item does not exist or is not active.");

        items[itemId].active = false;
        emit AuctionEnded(
            itemId,
            items[itemId].highestBidder,
            items[itemId].highestBid
        );

        if (items[itemId].highestBidder != address(0)) {
            payable(auctioneer).transfer(items[itemId].highestBid);
        }
    }
}
