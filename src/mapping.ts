import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from '../generated/NftMarketplace/NftMarketplace';
import {
  ItemBought,
  ItemCanceled,
  ItemListed,
  ActiveItem,
} from '../generated/schema';

export function handleItemBought(event: ItemBoughtEvent): void {
  const id = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let ItemBoughtEntity = ItemBought.load(id);
  const ActiveItemEntity = ActiveItem.load(id);
  if (!ItemBoughtEntity) {
    ItemBoughtEntity = new ItemBought(id);
  }
  ItemBoughtEntity.buyer = event.params.buyer;
  ActiveItemEntity!.buyer = event.params.buyer;
  ItemBoughtEntity.nftAddress = event.params.nftAddress;
  ItemBoughtEntity.tokenId = event.params.tokenId;
  ItemBoughtEntity.price = event.params.price;

  ItemBoughtEntity.blockNumber = event.block.number;
  ItemBoughtEntity.blockTimestamp = event.block.timestamp;
  ItemBoughtEntity.transactionHash = event.transaction.hash;

  ItemBoughtEntity.save();
  ActiveItemEntity!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  const id = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let ItemCanceledEntity = ItemCanceled.load(id);
  let ActiveItemEntity = ActiveItem.load(id);
  if (!ItemCanceledEntity) {
    ItemCanceledEntity = new ItemCanceled(id);
  }
  ItemCanceledEntity.seller = event.params.seller;
  ItemCanceledEntity.nftAddress = event.params.nftAddress;
  ItemCanceledEntity.tokenId = event.params.tokenId;

  ItemCanceledEntity.blockNumber = event.block.number;
  ItemCanceledEntity.blockTimestamp = event.block.timestamp;
  ItemCanceledEntity.transactionHash = event.transaction.hash;

  ActiveItemEntity!.buyer = Address.fromString(
    '0x000000000000000000000000000000000000dEaD'
  );

  ItemCanceledEntity.save();
  ActiveItemEntity!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const id = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let ItemListedEntity = ItemListed.load(id);
  let ActiveItemEntity = ActiveItem.load(id);
  if (!ItemListedEntity) {
    ItemListedEntity = new ItemListed(id);
  }
  if (!ActiveItemEntity) {
    ActiveItemEntity = new ActiveItem(id);
  }
  ItemListedEntity.seller = event.params.seller;
  ActiveItemEntity.seller = event.params.seller;
  ItemListedEntity.nftAddress = event.params.nftAddress;
  ActiveItemEntity.nftAddress = event.params.nftAddress;
  ItemListedEntity.tokenId = event.params.tokenId;
  ActiveItemEntity.tokenId = event.params.tokenId;
  ItemListedEntity.price = event.params.price;
  ActiveItemEntity.price = event.params.price;

  ItemListedEntity.blockNumber = event.block.number;
  ItemListedEntity.blockTimestamp = event.block.timestamp;
  ItemListedEntity.transactionHash = event.transaction.hash;

  ActiveItemEntity.buyer = Address.fromString(
    '0x0000000000000000000000000000000000000000'
  );

  ItemListedEntity.save();
  ActiveItemEntity.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
