export class Reminder
{
  case_no: string;
  casestage: string;
  clientName: string;
  hearingDate: string;
  hearingTime: string;
  id: number;
  name: string;
  overdueamt: number;
  paidamt: number;
  ref_id: number;
  totalamt: number;
}

export class NewReminder
{
  //Updated Format of the reminder

  id;
  ref_id;
  reminderDate;
  reminderTime;
  subject;
  disc;
  created_by;
  created_on;
  del_by;
  del_on;
  status;
  clientName;
  is_read;
  read_on;

}
