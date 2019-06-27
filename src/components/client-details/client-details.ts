import { Component } from '@angular/core';

/**
 * Generated class for the ClientDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'client-details',
  templateUrl: 'client-details.html'
})
export class ClientDetailsComponent {

  text: string;

  constructor() {
    console.log('Hello ClientDetailsComponent Component');
    this.text = 'Hello World';
  }

}
