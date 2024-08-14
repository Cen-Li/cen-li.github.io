#include "person.h"

PersonClass::PersonClass()
{
  FirstName="";
  LastName="";
  ID = 0;
  PhoneNum="";
}

PersonClass::~PersonClass()
{
}

// copy constructor
PersonClass::PersonClass(const PersonClass& p)
{
   FirstName = p.FirstName;
   LastName = p.LastName;
   ID = p.ID;
   PhoneNum = p.PhoneNum;
}

// overloaded == operator
bool PersonClass::operator==(const PersonClass&p)
{
   bool IsSamePerson;
   IsSamePerson = ((FirstName == p.FirstName) &&
                   (LastName == p.LastName) &&
                   (PhoneNum == p.PhoneNum) &&
                   (ID == p.ID));
   return IsSamePerson;
}

// overloaded > operator
bool PersonClass::operator>(const PersonClass&p)
{
   bool IsLessThan=false;
   if (LastName > p.LastName)
      return true;
   else if (LastName == p.LastName)
      if (FirstName > p.FirstName)
         return true;

   return false;
}

// overloaded  < operator
bool PersonClass::operator<(const PersonClass&p)
{
   bool IsLessThan=false;
   if (LastName < p.LastName)
      return true;
   else if (LastName == p.LastName)
      if (FirstName < p.FirstName)
         return true;

   return false;
}

// overloaded << operator
ostream & operator<< (ostream& os, const PersonClass & p)
{
  os << "Name : \t" << p.FirstName << " " << p.LastName << endl;
  os << "Phone: \t" << p.PhoneNum << endl;
  os << "ID:    \t" << p.ID << endl;
  return os;
}

// overloaded >> operator
istream& operator>> (istream& is, PersonClass& p)
{
  // if reading from input file, remove prompts
  cout << "Enter First and Last Name " << endl;
  is >> p.FirstName >> p.LastName;
  cout << "Enter phone number " << endl;
  is >> p.PhoneNum;
  cout << "Enter id number " << endl;
  is >> p.ID;

  return is;
} 
