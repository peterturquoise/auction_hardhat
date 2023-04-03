# Solidity API

## MultiItemAuction2

_The MultiItemAucton contract should allow users to place bids on items and automatically determine the highest bidder when the auction ends.
   The smart contract should have the following functionality:
   1. Initialise the auction with a list of items and their starting bids.
   2. Allow users to place bids on items.
   3. Automatically determine the highest bidder for each item when the auction ends._

### Item

```solidity
struct Item {
  uint256 itemId;
  uint256 startingBid;
  uint256 highestBid;
  address highestBidder;
  bool active;
}
```

### auctioneer

```solidity
address auctioneer
```

### auctionEndTime

```solidity
uint256 auctionEndTime
```

### items

```solidity
mapping(uint256 => struct MultiItemAuction2.Item) items
```

### pendingReturns

```solidity
mapping(uint256 => mapping(address => uint256)) pendingReturns
```

### itemIds

```solidity
uint256[] itemIds
```

### HighestBidIncreased

```solidity
event HighestBidIncreased(uint256 itemId, address bidder, uint256 amount)
```

### AuctionEnded

```solidity
event AuctionEnded(uint256 itemId, address winner, uint256 amount)
```

### constructor

```solidity
constructor(uint256 _biddingTime, uint256[] _itemIds, uint256[] _startingBids) public
```

### bid

```solidity
function bid(uint256 itemId) public payable
```

### withdraw

```solidity
function withdraw(uint256 itemId) public returns (bool)
```

### endAuction

```solidity
function endAuction(uint256 itemId) public
```

## Lock

### unlockTime

```solidity
uint256 unlockTime
```

### owner

```solidity
address payable owner
```

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```

### constructor

```solidity
constructor(uint256 _unlockTime) public payable
```

### withdraw

```solidity
function withdraw() public
```

## MultiItemAuction

_Multi-item aucton contract
   The auction system should allow users to place bids on items and automatically determine the highest bidder when the auction ends.
   The smart contract should have the following functionality:
   1. Initialise the auction with a list of items and their starting bids.
   2. Allow users to place bids on items.
   3. Automatically determine the highest bidder for each item when the auction ends._

### Item

```solidity
struct Item {
  uint256 itemId;
  uint256 startingBid;
  uint256 highestBid;
  address highestBidder;
  bool active;
}
```

### auctioneer

```solidity
address auctioneer
```

### auctionEndTime

```solidity
uint256 auctionEndTime
```

### items

```solidity
mapping(uint256 => struct MultiItemAuction.Item) items
```

### pendingReturns

```solidity
mapping(uint256 => mapping(address => uint256)) pendingReturns
```

### itemIds

```solidity
uint256[] itemIds
```

### HighestBidIncreased

```solidity
event HighestBidIncreased(uint256 itemId, address bidder, uint256 amount)
```

### AuctionEnded

```solidity
event AuctionEnded(uint256 itemId, address winner, uint256 amount)
```

### constructor

```solidity
constructor(uint256 _biddingTime, uint256[] _itemIds, uint256[] _startingBids) public
```

### bid

```solidity
function bid(uint256 itemId) public payable
```

Store `x`.

_Places a bid of the amount in 'msg.value' on the item referenced by 'itemId'_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| itemId | uint256 | id of the item that is bid on |

### withdraw

```solidity
function withdraw(uint256 itemId) public returns (bool)
```

### endAuction

```solidity
function endAuction(uint256 itemId) public
```

## Token

### name

```solidity
string name
```

### symbol

```solidity
string symbol
```

### totalSupply

```solidity
uint256 totalSupply
```

### owner

```solidity
address owner
```

### balances

```solidity
mapping(address => uint256) balances
```

### Transfer

```solidity
event Transfer(address _from, address _to, uint256 _value)
```

### constructor

```solidity
constructor() public
```

Contract initialization.

### transfer

```solidity
function transfer(address to, uint256 amount) external
```

A function to transfer tokens.

The `external` modifier makes a function *only* callable from *outside*
the contract.

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

Read only function to retrieve the token balance of a given account.

The `view` modifier indicates that it doesn't modify the contract's
state, which allows us to call it without executing a transaction.

