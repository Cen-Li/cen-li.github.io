#ifndef TimeClass_H
#define TimeClass_H

class TimeClass
{
 public:
   TimeClass();
   TimeClass(int h, int m, int s);

   void SetTime(int h, int m, int s);
   void Display() const;
   void Increment();
   int GetHour() const;
   void SetHour(int h);
   bool IsEqualTo(TimeClass t) const;
   bool LessThan(TimeClass t) const;
   bool operator == (const TimeClass& rhs) const;

   const TimeClass & operator = (const TimeClass & rhs);

 private:
   int hour;
   int minute;
   int second;
};

#endif
