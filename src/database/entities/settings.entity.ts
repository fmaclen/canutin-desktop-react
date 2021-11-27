import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Settings extends Base {
  @Column()
  budgetAuto: boolean;

  constructor(budgetAuto: boolean) {
    super();
    this.budgetAuto = budgetAuto;
  }
}
