
#include <string>
#include <iostream>
using namespace std;

#ifndef PERSON_H
#define PERSON_H

class PersonClass
{
  public: 
     // default constructor
     PersonClass();

     // copy constructor
     PersonClass(const PersonClass & rhs);

     //destructor
     ~PersonClass();

     // overloaded operators
     // Compare to see if the two person have the same last name and first name
     bool operator==(const PersonClass& rhs);

     // Compare to determine if the first person's name is alphabetically preceeding the second person's name
     bool operator<(const PersonClass& rhs);

     // Compare to determine if the first person's name is alphabetically following the second person's name
     bool operator>(const PersonClass& rhs);

     // overloaded << operator to display a person's info through os stream
     friend ostream& operator<< (ostream& os, const PersonClass& rhs);

     // overloaded >> operator to read a person's info through is stream
     friend istream& operator>> (istream& is, PersonClass& rhs);

     // declare other methods, i.e., accessors and mutators

  private:
     string FirstName;
     string LastName;
     string PhoneNum;
     int    ID;
};
#endif
