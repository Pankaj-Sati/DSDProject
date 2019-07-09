
import { Injectable } from '@angular/core';
/*
 * This service makes it easy to add and remove countries field in the application
 */

/*
  Generated class for the CountryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CountryProvider
{

  countryList = [
    { id: '231', name: 'United States' }
  ];

  constructor()
  {
    console.log('Hello CountryProvider Provider');

  }

  getCountryList()
  {
    return this.countryList;
  }

  getCountryName(id)
  {
    let country = this.countryList.find((eachCountry) => Number(eachCountry.id) == Number(id)); //Finding the country whose ID is sent in the function call
    if (country)
    {
      return country.name;
    }
    //Execution will reach here if no country is found
    return null;
  }



}
