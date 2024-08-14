#include <iostream>
using namespace std;

int main() {
   int v1, v2, v3;  // the 3 integer values entered

   cout << "Enter 3 integer values: ";
   cin >> v1 >> v2 >> v3;
 
   if (v1 > v2) {
      // compare v2 and v3
      if (v2 > v3)  {   // v1>v2>v3
         cout << v1 << " " << v2 << " " << v3 << endl;
      }
      else   {   // v3 >=v2, v1 > v2, need to compare v1 and v3
         if (v1 > v3)  {    // v1 > v3 > v2
            cout << v1 << " " << v3 << " " << v2 << endl;
         }
         else {    // v3 > v1 > v2
            cout << v3 << " " << v1 << " " << v2 << endl;
         }
      }
   }   // v1 <= v2
   else   {
      if (v1 > v3)  {  // v2 > v1 > v3
         cout << v2 << " " << v1 << " " << v3 << endl;
      }
      else  {    // need to compare v2 and v3
           if (v2 < v3)  {  // v3 > v2 > v1
               cout << v3 << " " << v2 << " " << v1 << endl;
           }
           else {
               cout << v2 << " " << v3 << " " << v1 << endl;
           }
       }
    } 
}
