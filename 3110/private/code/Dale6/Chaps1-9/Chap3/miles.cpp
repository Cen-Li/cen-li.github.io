// Program Miles prints miles in kilometers.
#include <iostream>
using namespace std;

float MilesToKilometers(int miles);
// Returns the kilometer equivalent of miles

int main ()
{   
  cout  << fixed  << showpoint;  // For decimal output
  cout  << "One mile is " << MilesToKilometers(1)  
        << " kilometers." << endl;
  cout  << "Ten miles is " << MilesToKilometers(10)
        << " kilometers." << endl;
  cout  << "One hundred miles is " << MilesToKilometers(100)
        << " kilometers." << endl;
  return 0;
}

float MilesToKilometers(int miles)
{
  const float KILO = 1.609;
  return KILO * float(miles);
}
