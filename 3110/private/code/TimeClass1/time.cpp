#include "time.h"
#include <iostream>
using namespace std;

TimeClass::TimeClass()
{
   hour = 0;
   minute = 0;
   second = 0;
}

TimeClass::TimeClass(int h, int m, int s)
{
   hour = h;
   minute = m;
   second = s;
}

TimeClass::~TimeClass()
{
   cout << "destructor executed" << endl; 
}

void TimeClass::SetTime(int h, int m, int s)
{
   hour = h;
   minute = m;
   second = s;
}

void TimeClass::Display() const
{
   if (hour < 10)
     cout << "0";
   cout << hour;

   cout << ":";

   if (minute < 10)
     cout << "0";
   cout << minute;

   cout << ":";

   if (second < 10)
     cout << "0";
   cout << second;

   cout << endl;
}

void TimeClass::Increment()
{
   if (second < 59)
   {
       second++;
   }
   else
   {
       second = 0;
       if (minute < 59)
       {
           minute ++;
       }
       else
       {
           minute = 0;
           if (hour < 24)
           {
               hour ++;
           }
           else
           {
               hour = 1;
           }
       }
    }
}

int TimeClass::GetHour() const
{
    return hour;
}

void TimeClass::SetHour(int h)
{
    hour = h;
}

bool TimeClass::IsEqualTo(TimeClass t) const
{
   if ((hour == t.hour) && (minute == t.minute) && (second == t.second))
           return true;
   else 
           return false;
}

bool TimeClass::LessThan(TimeClass t) const
{
   if (hour < t.hour)
      return true;
   else if (hour == t.hour)
   {
       if (minute < t.minute)
           return true;
       else if (minute == t.minute)
       {
           if (second < t.second)
               return true;
        }
    }

    return false;
}
