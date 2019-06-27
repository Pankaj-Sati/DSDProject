export class UserType
{
	//This class returns the user type by switching the user type id received from the server
	getUserType(usertype_id)
	{
			switch(usertype_id)
			{
				case 1: return 'SUPER ADMIN';
				case 2: return 'ADMIN';
				case 3: return 'ACCOUNT';
				case 4: return 'CASE MANAGER';
				case 5: return 'CLIENT';
				default: return 'CLIENT';
			}
	}
}