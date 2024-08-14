// Program Time takes an Eastern standard time in hours, minutes, and seconds, 
// and prints it out in Central time, Mountain time, or Pacific time.

#include <iostream>
using namespace std;

enum TimeZones {EASTERN, CENTRAL, MOUNTAIN, PACIFIC};

TimeZones GetZone();
// Returns a time zone.

void PrintZone(TimeZones zone);
// Prints time zone in words.

void PrintTime(TimeZones zone, long time);
// Prints time in all four zones.

int DecrementTime(int);

int GetTime();

int main ()
{
  TimeZones  zone;
  long  time;
  time =  GetTime();
  zone =  GetZone();
  switch (zone)
  {
	case PACIFIC :  time = DecrementTime(time); 
	case MOUNTAIN:  time = DecrementTime(time); 
	case CENTRAL :  time = DecrementTime(time); 
	case EASTERN :  break;
  }
  PrintTime(zone, time);
  return 0;
}

/**********************************************************/

int DecrementTime(int time)
{  
  return time - 3600;
}

/**********************************************************/

int GetTime()
{   
  int  hours;
  int  minutes;
  int  seconds;
  cout << "Enter a time (EST) in hours, minutes, and seconds, "
	   << "separated by blanks"  << endl;
  cin >> hours >> minutes >> seconds;

  return  seconds + minutes*60 + hours*3600;
}

/**********************************************************/

TimeZones  GetZone()
{
  int  zone;
  cout << "What time zone do you wish the time printed in?" << endl;
  cout << "Enter 0 for Eastern" << endl;
  cout << "Enter 1 for Central" << endl;
  cout << "Enter 2 for Mountain"<< endl;
  cout << "Enter 3 for Pacific" << endl;
  cin >> zone;

  return TimeZones(zone);
}

/**********************************************************/

void  PrintZone(TimeZones zone)
{
  switch (zone)
  {
    case 0:  cout << "Eastern" << endl; break;
	case 1:  cout << "Central" << endl; break;
	case 2:  cout << "Mountain" << endl; break;
	case 3:  cout << "Pacific" << endl; break;
    }
}

/**********************************************************/

void  PrintTime(TimeZones zone, long time)
{
  cout << "The time you entered is ";
  cout << time / 3600  << " hours "
	   << (time % 3600) / 60  << " minutes "
	   << (time % 60)  << " seconds ";
  cout << " in ";
  PrintZone(zone);
  cout << " time."  << endl;
}

