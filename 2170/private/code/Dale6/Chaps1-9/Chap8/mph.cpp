// Program MPH reads miles and hours and prints miles
// per hour.

#include <iostream>
#include <iomanip>
using namespace std;

/* FILL IN the function prototype for GetData */

int main ()
{
  float  miles;
  float  hours;
  float  milesPerHour;

  cout  << fixed  << showpoint;

  /* FILL IN code to invoke function GetData */

  milesPerHour = miles / hours;
  cout << setw(10)  << miles
       << setw(10)  << hours
       << setw(10)  << milesPerHour  << endl;
  return 0;
}

//*****************************************************

/* FILL IN the function heading for GetData */
{
  /* FILL IN Code to prompt for miles and hours */
  /* FILL IN Code to read miles and hours */
}
