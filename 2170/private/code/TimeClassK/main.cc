#include <iostream>
#include "time.h"
using namespace std;

int main()
{
   TimeClass time1;
   TimeClass time2(3, 40, 5);
   TimeClass time3;

   time2.Display();
   if (time1.IsEqualTo(time2))
       cout << "Equal time " << endl;
   else 
       cout << "Not Equal" << endl;

   /*
   for (int i=0; i<15; i++)
   {
       time2.Increment();
       time2.Display();
   }*/

   time1 = time2;
   time1.SetHour(time1.GetHour()+1);
   time1.Display();

   time3 = time2 = time1;
   if (time1==time3)
       cout << "Equal time " << endl;
   else 
       cout << "Not Equal" << endl;

 
   return 0;
}
