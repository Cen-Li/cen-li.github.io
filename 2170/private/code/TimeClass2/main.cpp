#include <iostream>
#include "time.h"
using namespace std;

int main()
{
   TimeClass time1;
   TimeClass time2(4, 40, 20);

   cin >> time1;

   if (time1 + time1 == time2)
       cout << "Equal time " << endl;
   else 
       cout << "Time not equal" << endl;

   return 0;
}
