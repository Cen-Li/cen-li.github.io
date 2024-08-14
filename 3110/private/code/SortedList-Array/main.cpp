// main.cpp
// client program for the sorted list in array based implementation
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

    // display the list: Iterate through the list
    aList.Reset();   // ?!
    cout << "The list of values are: " ;
    cout << aList.Length() << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }
        
    // prompt the user to enter a value to delete from the list
    cout << "Enter value to delete : "; 
    cin >> value;
    if (!aList.IsPresent(value)) 
    {
        cerr << "The value is not in the list, deletion not carried out." << endl;
        return -1;
    }

    while (aList.IsPresent(value)) {
        aList.Delete(value);
    }
    aList.Reset();   
    cout << "After deleting, the list of values are: " << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }

    myIn.close();
    return 0;
}
