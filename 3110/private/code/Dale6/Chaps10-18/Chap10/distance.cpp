//*****************************************************
// Program Distance converts either yards or feet to
// a record of type Distance.
//*****************************************************

#include <iostream>
using namespace std;

struct Distance
{
  long  feet;
  long  yards;
  long  miles;
};

Distance ConvertYards(long yards);
// Post: yards has been converted into a variable of
//       type Distance.

Distance ConvertFeet(long feet);
// Post: feet has been converted into a variable of
//       type Distance.

void PrintDistance(Distance distance);
// Post:  A vriable of type Distance is printed as feet,
//        yards, and miles.


int main()
{
  // FILL IN code to test the operations involving
  // struct Distance.
}


//*********  Distance Operations ********************

Distance ConvertYards(long yards)
{
  // FILL IN Code to convert yards to a variable of Distance.
}

//******************************************************

Distance ConvertFeet(long feet)
{
  // FILL IN Code to convert feet to a variable of Distance.
}

//******************************************************

void PrintDistance(Distance Distance)
{
  // FILL IN Code to print a variable of Distance.
}

