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

TimeClass::TimeClass(const TimeClass& t)
{
   hour = t.hour;
   minute = t.minute;
   second = t.second;
   
}

bool TimeClass::operator==(const TimeClass&rhs) const
{
   return (hour == rhs.hour)&&(minute==rhs.minute)&&(second==rhs.second);
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

istream& operator >> (istream& is, TimeClass& rhs)
{
    cout << "enter hour:";
	is >> rhs.hour;
    cout << "enter minute:";
    is >> rhs.minute;

    cout << "enter second:";
    is >> rhs.second;
    
	return is;
}

ostream& operator << (ostream& os, const TimeClass& rhs)
{
	os << "current time - ";

	os 	<< rhs.hour << ":" 
 		<< rhs.minute << ":"
		<< rhs.second;
    os << endl;


  	/* OR, to format it better, do:
   	if (rhs.hour < 10)
     	os << "0";
   	os << rhs.hour;

   	os << ":";

   	if (rhs.minute < 10)
     	os << "0";
   	os << rhs.minute;

   	os << ":";

   	if (rhs.second < 10)
     	os << "0";
   	os << rhs.second;
    */

	return os;
}

TimeClass TimeClass::operator + (const TimeClass &rhs) const
{
	TimeClass sumTime;

    sumTime.hour = hour + rhs.hour;
    sumTime.minute= minute+ rhs.minute;
    sumTime.second= second + rhs.second;

	return sumTime;
}



bool TimeClass::operator< (const TimeClass&rhs) const
{
    if (hour < rhs.hour)
		return true;
	else if (hour == rhs.hour)
	{
		if (minute < rhs.minute)
			return true;
		else if (minute == rhs.minute)
		{
			if (second < rhs.second)
				return true;
		}
	}

    return false;
}


/* overloaded assignment operator 
TimeClass & TimeClass::operator = (const TimeClass & rhs)
{
    if (this != &rhs)
    {
        hour = rhs.hour;
        minute = rhs.minute;
        second = rhs.second;
    }

    return *this;
}
*/
