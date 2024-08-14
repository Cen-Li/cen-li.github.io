#ifndef   TIMETYPE_H
#define   TIMETYPE_H

class TimeClass
{
public:
    TimeClass();
        // Postcondition:  Class object is constructed  &&  Time is 0:0:0

    TimeClass( /* in */ int initHrs, 
         /* in */ int initMins, 
         /* in */ int initSecs );
        // Precondition:
        //     0 <= initHrs <= 23  &&  0 <= initMins <= 59  && 0 <= initSecs <= 59
        // Postcondition:
        //     Class object is constructed. Time is set according to the incoming parameters

    void Set( /* in */ int hours, 
      /* in */ int minutes, 
      /* in */ int seconds );
        // Precondition:
        //     0 <= hours <= 23  &&  0 <= minutes <= 59  && 0 <= seconds <= 59
        // Postcondition:
        //     Time is set according to the incoming parameters

    void Increment();
        // Postcondition:
        //     Time has been advanced by one second, with  23:59:59 wrapping around to 0:0:0

    void Write() const;
        // Postcondition:
        //     Time has been output in the form HH:MM:SS

    bool Equal( /* in */ TimeClass otherTime ) const;
        // Postcondition:
        //     Function value == true, 
        //   if this time equals otherTime;    == false, otherwise

    bool LessThan( /* in */ TimeClass otherTime ) const;
        // Precondition:
        //     This time and otherTime represent times in the same day
        // Postcondition:
        //     Function value == true, 
       // if this time is earlier in the day than otherTime;  == false, otherwise
private:
    int hrs;
    int mins;
    int secs;
};
#endif

