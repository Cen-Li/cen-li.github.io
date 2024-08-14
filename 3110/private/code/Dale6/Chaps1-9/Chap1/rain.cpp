// Program Rain calculates the average rainfall over a period 
// of days.  The number of days and the rain statistics are in 
// file Rain.in.
 
#include <iostream>
#include <fstream>
#include <iomanip>
#include <cassert>
using namespace std;

int GetInches(ifstream& rainFle, int numberOfDays); 
// Function returns the total inches of rain
// Pre:  File rainFile has been opened; numberOfDays is the 
//       first value on the file, followed by numberOfDays 
//       real values representing inches of rain.

int main()
{
  float average;           // Average rainfall
  float totalRain;         // Total accumulated rain
  int numberOfDays;        // Number of days in calculation
  ifstream  rainFile;      // Data file
  
  cout  << fixed  << showpoint;
  rainFile.open("rain.in");
  assert(rainFile);

  rainFile >> numberOfDays;
  totalRain = GetInches(rainFile, numberOfDays);
  
  if (totalRain == 0.0)
    cout  << "There was no rain during this period."  << endl;
  else
  {
    average = totalRain / numberOfDays;
    cout << "The average rain fall over "  
         << numberOfDays; 
    cout << " days is " << setw(1)  << setprecision(3) 
         << average  << endl;
  }
  return 0;
}

//******************************************************

int GetInches(ifstream& rainFile, int numberOfDays)
{
  float inches;         // Day's worth of rain
  int counter;          // Loop control variable
  float totalRain = 0.0;
  counter = 1;
  while (counter <= numberOfDays)
  {
    rainFile >> inches;
    totalRain = totalRain + inches;
    counter++;
  }
  return totalRain;
}
