// Program SumNums reads and counts nonnegative integers until
// the end of file is reached on file SumNums.D1.

#include <iostream>
#include <fstream>
using namespace std;


int main ()
{
    ifstream  data;
    int  number;	// Input value
    int  count;		// Number of positive values

    data.open("SumNum.D1");
    count = 0;
    while (data)
    {
	data  >> number;
	if (number > 0)
	    count = count + number;
    }
    cout  << "The number of nonnegative integers is "
	  << count  << endl;
    return 0;
}

