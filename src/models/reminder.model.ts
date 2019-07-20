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
  date;
  subject;
  description;
  user;
  created_date;
  action;

}
