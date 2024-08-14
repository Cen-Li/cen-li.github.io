// main.cpp
// client program for the unsorted list in array based implementation
// It illustrates the usage of list member functions

#include "slist.h"
#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

int main ()  
{
    SortedList aList;  // created an emtpy list class object
    ItemType value;
    ifstream myIn("listData.dat");
    assert(myIn);

    while (!aList.IsFull() && (myIn>>value))  {
        if (!aList.IsPresent(value)) // maintain a list of unique values
            aList.Insert(value);
    }

    cout << "The unsorted list of values are: " << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }
        
    // version 1
    cout << "Enter value to delete : "; 
    cin >> value;
    aList.Delete(value);
    cout << "After deleting, the list of values are: " << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }

    // version 2
    /*
    aList.Reset();   // ?!!
    aList.SelSort();
    cout << "After sorting, the list of values are: " << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }
    */

    myIn.close();
    return 0;
}
