
import { Injectable } from '@angular/core';

/*
  Generated class for the EntityTypeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

import { EntityType} from '../../models/entity_type.model';

@Injectable()
export class EntityTypeProvider
{
  entityTypeList: EntityType[] = [];

  constructor()
  {
    this.entityTypeList = [
      { value: 'Entity', name:'Entity'},
      { value: 'Petitioner', name:'Petitioner'},
      { value: 'Beneficiary', name:'Beneficiary'},
      { value: 'Applicant', name:'Applicant'},
      { value: 'Defendent', name:'Defendent'},
      { value: 'Plantiff', name:'Plantiff'},
      { value: 'Derivative Beneficiary', name:'Derivative Beneficiary'},
    ];
  }

  getList(): EntityType[]
  {
    return this.entityTypeList;
  }

}
