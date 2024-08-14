#include <iostream>
#include "time.h"
using namespace std;

int main()
{
   TimeClass time1;
   TimeClass time2(3, 40, 5);

   time1.SetTime(5, 12, 30);   // using SetTime

   cout << time1.GetHour() << endl;

   time2.SetHour(10);

   time1.Display();

   if (time1.IsEqualTo(time2))
       cout << "Equal time " << endl;
   else 
       cout << "Not Equal" << endl;

   time1 = time2;
   time1.SetHour(time1.GetHour()+1);
   time1.Display();

   for (int i=0; i<15; i++)
   {
       time2.Increment();
       time2.Display();
   }

   return 0;
}
