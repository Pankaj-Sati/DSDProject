
import { Injectable } from '@angular/core';

//This class is used to share a common Relationship data among the other app modules
/*
  Generated class for the ClientEntityRelationshipProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientEntityRelationshipProvider {

  constructor()
  {
    console.log('Hello ClientEntityRelationshipProvider Provider');
  }

  getAllRelationships()
  {
    let relationships =[
      { value: 'Father', name: 'Father' },
      { value: 'Mother', name: 'Mother' },
      { value: 'Daughter', name: 'Daughter' },
      { value: 'Son', name: 'Son' },
      { value: 'Other Relations', name: 'Other Relations' }
      
    ]
    return relationships;
  }

}
