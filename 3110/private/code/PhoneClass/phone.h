#include <string>
#include <iostream.h>

#ifndef Phone_H
#define Phone_H

class phoneclass
{
  public: 
     phoneclass();
     phoneclass(const phoneclass &);
     ~phoneclass();
     bool operator==(const phoneclass&);
     bool operator<(const phoneclass&);
     bool operator>(const phoneclass&);
     friend ostream& operator<< (ostream&, const phoneclass&);
     friend istream& operator>> (istream&, phoneclass&);
  private:
     string FirstName;
     string LastName;
     string PhoneNum;
     int    ID;
};
#endif
