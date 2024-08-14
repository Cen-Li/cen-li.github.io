#include "time.h"
#include <iostream>
using namespace std;

int main()
{
    TimeClass time1(5, 30, 0);
    TimeClass time2;
    int      count;

    time2 = time1;
    cout << "time1: ";
    time1.Write();
    cout << "time2: ";
    time2.Write();
    cout << endl;

    if (time1.Equal(time2))
        cout << "Times are equal" << endl;
    else
        cout << "Times are NOT equal" << endl;

    time2.Increment();
    cout << "New time2: ";
    time2.Write();
    cout << endl;

    if (time1.Equal(time2))
        cout << "Times are equal" << endl;
    else
        cout << "Times are NOT equal" << endl;

    if (time1.LessThan(time2))
        cout << "time1 is less than time2" << endl;
    else
        cout << "time1 is NOT less than time2" << endl;

    if (time2.LessThan(time1))
        cout << "time2 is less than time1" << endl;
    else
        cout << "time2 is NOT less than time1" << endl;

    cout << endl << "Continuously Incrementing time1:" << endl;
    time1.Set(23, 59, 55);
    for (count = 1; count <= 10; count++)
    {
        time1.Write();
        time1.Increment();
    }
    return 0;
}

