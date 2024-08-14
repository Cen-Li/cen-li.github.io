#include <iostream>
#include <iomanip>  
using namespace std;

int main ()
{
   // print the heading
   cout << endl << endl;
   cout << left;
   cout << setw(15) << "School Number"  
          << setw(15) << "School Name" << endl << endl;
   cout << right;

   // print the 1st school
   cout << setw(5) << 10 << setw(10) << " ";
   cout << left;
   cout << setw(15) << "MTSU" << endl;

   // print the 2nd school
   cout << right;
   cout << setw(5) << 5 << setw(10) << " ";
   cout << left;
   cout<< setw(15) << "UT" << endl;

   // print the 3rd school
   cout <<  right;
   cout << setw(5) << 32 << setw(10) << " ";
   cout << left;
   cout << setw(15) << "Vanderbilt" << endl;
   cout << endl << endl;

   return 0;

}  
