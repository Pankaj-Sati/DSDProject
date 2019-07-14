import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { ClientCommunications} from '../../models/client_communications.model';

/**
 * Generated class for the ClientCommunicationDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'client-communication-details',
  templateUrl: 'client-communication-details.html'
})
export class ClientCommunicationDetailsComponent
{
  comm: ClientCommunications;

  constructor
    (
    public navParams: NavParams,
    public navCtrl: NavController
    )
  {
    console.log('Hello ClientCommunicationDetailsComponent Component');
   
  }

  ionViewDidLoad()
  {
    this.comm = this.navParams.get('communication');
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

}
