#include <iostream>
using namespace std;
#include "List.h"


int main()
{
    ListItemType data;
    bool success;

    List aList;

    aList.insert(0, 90, success);
    aList.insert(0, 75, success);
    aList.insert(3, 100, success);
    aList.insert(2, 80, success);

    aList.remove(1, success);

    for (int i=aList.getLength(); i>=0; i--)
    {
        aList.retrieve(i, data, success);
        if (success)
        {
	    cout << data << endl;
        }
    }

    return 0;
}
