// Program EnumIO is a driver for input and output routines for
// an enumerated type representing time zones.

#include <iostream>
using namespace std;

enum TimeZones {EASTERN, CENTRAL, MOUNTAIN, PACIFIC};

TimeZones  GetZone();
// Returns a time zone.

void  PrintZone(TimeZones);
// Prints time zone in words.

int main ()
{
  for (int i = 1; i <= 4; i++)
  {
	PrintZone(GetZone());
  }

  return 0;
}

/**********************************************************/

TimeZones  GetZone()
{
  int  zone;
  cout  << "Enter 1 for Eastern"  << endl;
  cout  << "Enter 2 for Central"  << endl;
  cout  << "Enter 3 for Mountain" << endl;
  cout  << "Enter 4 for Pacific"  << endl;

  cin  >> zone;

  return TimeZones(zone);
}

/**********************************************************/

void  PrintZone(TimeZones zone)
{
    switch (zone)
    {
	case 0:  cout  << "Eastern"  << endl;
		 break;
	case 1:  cout  << "Central"  << endl;
		 break;
	case 2:  cout  << "Mountain"  << endl;
		 break;
	case 3:  cout  << "Pacific"  << endl;
		 break;
    }
}

