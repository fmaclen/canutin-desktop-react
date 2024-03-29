import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';

import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { AssetType } from './assetType.entity';
import { getBalanceGroupByAssetType } from '../helpers';
import { AssetBalanceStatement } from './assetBalanceStatement.entity';

@Entity()
@Unique(['name'])
export class Asset extends Base {
  @Column()
  name: string;

  @ManyToOne(() => AssetType, assetType => assetType.asset, { cascade: true })
  @JoinColumn()
  assetType: AssetType;

  @Column()
  balanceGroup: BalanceGroupEnum;

  @Column()
  sold: boolean;

  @Column({ nullable: true })
  symbol?: string;

  @OneToMany(() => AssetBalanceStatement, balanceStatement => balanceStatement.asset)
  balanceStatements?: AssetBalanceStatement[];

  constructor(
    name: string,
    assetType: AssetType,
    sold: boolean,
    symbol?: string,
    balanceStatements?: AssetBalanceStatement[]
  ) {
    super();
    this.name = name;
    this.assetType = assetType;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
    this.sold = sold;
    this.symbol = symbol;
    this.balanceStatements = balanceStatements;
  }
}
