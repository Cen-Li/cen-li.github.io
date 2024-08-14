// main.cpp
// client program for the sorted list in linked list implementation
// It illustrates the usage of list member functions

#include "slist.h"
#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

void Lookup(SortedList & aList);

int main ()  
{
    SortedList aList;  // created an emtpy list class object
    ItemType value;
    ifstream myIn("list.dat");
    assert(myIn);

    // read all the data and store them in the list
    while (myIn >> value)  {
        aList.Insert(value);
    }

    // traverse the list and print the values one by one
    cout << "The list of values are: " << endl;
    aList.Reset();
    for (int i=0; i<aList.GetLength(); i++)   {
        value = aList.GetNextItem();
        cout << value << endl;
    }
        
    // Look for a value by calling a function
    Lookup(aList);

    myIn.close();
    return 0;
}

// This function looks for a value in the list. The value to look for is entered by the user
// The list is input to the function as parameter
void Lookup(SortedList & aList)
{
    ItemType value, lookfor;
    bool   found=false;

    cout << "Which value do you want to look up:";
    cin >> lookfor;

    aList.Reset();
    for (int i=0; i<aList.GetLength(); i++)   {
        value = aList.GetNextItem();
        if (value == lookfor) 
        {
	    cout << "Found " << lookfor << " in the list." << endl;
            found=true;
        }
    }
    if (!found)
        cout << lookfor << " is not in the list." << endl;
}
