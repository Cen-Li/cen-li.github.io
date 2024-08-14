#include <iostream>
using namespace std;

#ifndef TimeClass_H
#define TimeClass_H

class TimeClass
{
 public:
   TimeClass();
   TimeClass(int h, int m, int s);
   TimeClass(const TimeClass & t);

   void SetTime(int h, int m, int s);
   void Display() const;
   void Increment();

   int GetHour() const;
   void SetHour(int h);

   bool IsEqualTo(TimeClass t) const;
   bool LessThan(TimeClass t) const;

   // overload the logical operators
   bool operator == (const TimeClass& rhs) const;
   bool operator < (const TimeClass& rhs) const;
   TimeClass operator + (const TimeClass& rhs) const;

   // overload the insertion and extraction operators
   friend istream& operator >> (istream& is, TimeClass& rhs);
   friend ostream& operator << (ostream& os, const TimeClass& rhs);
   
   // overloaded assignment operator
   TimeClass & operator = (const TimeClass& rhs);

 private:
   int hour;
   int minute;
   int second;
};

#endif
