// This program simulates tossing coins.
// it stops when there are 3 consecutive heads. 
// it should display the number of coin flips before 3 consecutive heads is tossed.

#include <iostream>
#include <ctime>
using namespace std;

int main() 
{
    bool heads;        // tossed head
    int  count=0;      // count the total number of toss
    int  headCount=0;  // count the number of consecutive heads
    srand(time(0));

    while (headCount < 3) {
        // head case
        if (rand()%2 == 0)  {
           headCount ++;
           cout << "Head" << endl;
        }
        else  {
           headCount = 0;
           cout << "Tail" << endl;
        }
        count ++;
   }
   cout << count << " tosses done before 3 consecutive heads." << endl;
}

   

