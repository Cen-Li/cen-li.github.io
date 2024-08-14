#include "phone.h"

phoneclass::phoneclass()
{
  FirstName[0]='\0';
  LastName[0]='\0';
  PhoneNum[0]='\0';
}

phoneclass::~phoneclass()
{
}

phoneclass::phoneclass(const phoneclass& p)
{
   FirstName = p.FirstName;
   LastName = p.LastName;
   ID = p.ID;
   PhoneNum = p.PhoneNum;
}

bool phoneclass::operator==(const phoneclass&p)
{
   bool IsSamePerson;
   IsSamePerson = ((FirstName == p.FirstName) &&
                   (LastName == p.LastName) &&
                   (PhoneNum == p.PhoneNum) &&
                   (ID == p.ID));
    return IsSamePerson;
}

bool phoneclass::operator>(const phoneclass&p)
{
   bool IsLessThan=false;
   if (LastName > p.LastName)
      return true;
   else if (LastName == p.LastName)
      if (FirstName > p.FirstName)
         return true;

   return false;
}

bool phoneclass::operator<(const phoneclass&p)
{
   bool IsLessThan=false;
   if (LastName < p.LastName)
      return true;
   else if (LastName == p.LastName)
      if (FirstName < p.FirstName)
         return true;

   return false;
}

ostream & operator<< (ostream& os, const phoneclass & p)
{
  os << "Name : \t" << p.FirstName << " " << p.LastName << endl;
  os << "Phone: \t" << p.PhoneNum << endl;
  os << "ID:    \t" << p.ID << endl;
  return os;
}

istream& operator>> (istream& is, phoneclass& p)
{

  cout << "Enter First and Last Name " << endl;
  is >> p.FirstName >> p.LastName;
  cout << "Enter phone number " << endl;
  is >> p.PhoneNum;
  cout << "Enter id number " << endl;
  is >> p.ID;

  return is;
} 
