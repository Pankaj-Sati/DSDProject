export class User //To show Basic details for displaying in the home screen
{
  id: string;
  name: string;
  email: string;
  user_type_id: string;
  profile_img: string;
  contact: string;
  calendar_link;
}

export class UserDetails
{
  name; //User name
  lastname; //User name
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
  permanent_addressLine1;
  permanent_addressLine2;
  case_no;
}
