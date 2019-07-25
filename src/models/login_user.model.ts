export class User //To show Basic details for displaying in the home screen
{
  id: string;
  name: string;
  email: string;
  user_type_id: string;
  profile_img: string;
  contact: string;
}

export class UserDetails
{
  name; //User name
  usertype_id; //Id allocated to user type
  gender;
  email;
  contact;
  alternate_number;
  dob;
  permanent_address;
  residencial_address;
  city;
  state;
  pincode;
  fax;
  country;
  profile_img;
  uname; //Whether it is SuperAdmin, Admin client etc.
}
