import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { BalancegGroupEnum } from '../../enums/balancegGroup.enum';
import { Account } from './account.entity';
import { AssetType } from './assetType.entity';
import { getBalanceGroupByAssetType } from '../helpers';

@Entity()
export class Asset extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @OneToOne(() => AssetType, assetType => assetType.asset, { cascade: true })
  assetType: AssetType;

  @Column()
  balanceGroup: BalancegGroupEnum;

  @Column({ nullable: true })
  sold?: Date;

  @ManyToOne(() => Account, account => account.assets, { nullable: true })
  account?: Account;

  constructor(
    name: string,
    quantity: number,
    cost: number,
    assetType: AssetType,
    account?: Account,
    sold?: Date
  ) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.cost = cost;
    this.account = account;
    this.assetType = assetType;
    this.sold = sold;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
  }
}
