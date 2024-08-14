#ifndef TimeClass_H
#define TimeClass_H

class TimeClass
{
 public:
   // default constructor
   TimeClass();
   // parameterized constructor
   TimeClass(int h, int m, int s);

   ~TimeClass();
 
   // set the time to hour(h), minute(m) and second(s)
   // Pre-condition: the new hour, minute and second values are provided 
   //               as the parameters of the function
   // Post-condition: the objects time is changed to the values provided 
   //               as the parameters of the function
   void SetTime(int h, int m, int s);

   // return the hour value of the current time
   // Pre-condition: none
   // Post-condition: the hour value is returned
   int GetHour() const;

   // Change the hour value of the current time
   // Pre-condition: 
   // Post-condition: hour is set to h
   void SetHour(int h);

   // the current time is displayed in the format hh:mm:ss
   // Pre-condition: none
   // Post-condition: the current time is displayed in the specified format
   void Display() const;

   // Increment the current time by one second
   // Pre-condition: none
   // Post-condition: the time is increased by one second
   void Increment();

   // Compare whether two time are the same
   // Pre-condition: a second time is provided as parameter
   // Post-condition: returns true if the time provided is the same as the current time, returns false otherwise
   bool IsEqualTo(TimeClass t) const;

   // Compare whether the current time is less than the time provided in parameter
   // Pre-condition: a second time is provided as parameter
   // Post-condition: returns true if the current time is less than the time provided, returns false otherwise 
   bool LessThan(TimeClass t) const;

 private:
   int hour;  
   int minute;
   int second;
};

#endif
