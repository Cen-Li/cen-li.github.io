#include "time.h"
#include <iostream>
using namespace std;

TimeClass::TimeClass()
{
    hrs = 0;
    mins = 0;
    secs = 0;
}

TimeClass::TimeClass( /* in */ int initHrs,
                    /* in */ int initMins,
                    /* in */ int initSecs )
{
    hrs = initHrs;
    mins = initMins;
    secs = initSecs;
}

void TimeClass::Set( /* in */ int hours,
                    /* in */ int minutes,
                    /* in */ int seconds )
{
    hrs = hours;
    mins = minutes;
    secs = seconds;
}

void TimeClass::Increment()
{
    secs++;
    if (secs > 59)
    {
        secs = 0;
        mins++;
        if (mins > 59)
        {
            mins = 0;
            hrs++;
            if (hrs > 23)
                hrs = 0;
        }
    }
}

void TimeClass::Write() const
{
    if (hrs < 10)
        cout << '0';
    cout << hrs << ':';
    if (mins < 10)
        cout << '0';
    cout << mins << ':';
    if (secs < 10)
        cout << '0';
    cout << secs;
    cout << endl;
}


//************************************************
bool TimeClass::Equal( /* in */ TimeClass otherTime ) const

{
    if (hrs == otherTime.hrs && 
        mins == otherTime.mins && 
        secs == otherTime.secs)
       return true;
    else
       return false;
}

//************************************************
bool TimeClass::LessThan( /* in */ TimeClass otherTime ) const
{
    if (hrs < otherTime.hrs ||
        (hrs == otherTime.hrs && mins < otherTime.mins) ||
        (hrs == otherTime.hrs && mins == otherTime.mins
                            && secs < otherTime.secs))
        return true;
    else
        return false;
}

