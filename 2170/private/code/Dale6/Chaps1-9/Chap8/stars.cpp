// Program Stars prints NUM_STARS on the screen.
#include <iostream>
using namespace std;

const int  NUM_STARS = 10;

void PrintStars();
// Prints NUM_STARS stars on the screen.

int main ()
{
  cout << "The next line contains " << NUM_STARS
       << " stars. " << endl;
  PrintStars();
  PrintStars();
  return 0;
}

//*************************************************

void PrintStars ()
// Post: NUM_STARS asterisks are sent to cout.

{
  cout << "**********" << endl;
  return;
} 
