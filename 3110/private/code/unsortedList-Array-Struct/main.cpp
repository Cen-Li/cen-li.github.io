// main.cpp
// client program for the unsorted list in array based implementation
// It illustrates the usage of list member functions

#include "list.h"
#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

int main ()  
{
    List aList;  // created an emtpy list class object
    ItemType value;
    ifstream myIn("list2.dat");
    assert(myIn);

    while (!aList.IsFull() && (getline(myIn,value.title)))  {
        myIn>>value.author;
        if (!aList.IsPresent(value)) // maintain a list of unique values
            aList.Insert(value);
        myIn.ignore(100, '\n');
    }

    cout << "title          author  " << endl;
    //cout << "The unsorted list of values are: " << endl;
    aList.Reset();
    for (int i=0; i<aList.Length(); i++)   {
        value = aList.GetNextItem();
        cout << value.title << "  " << value.author<< endl;
    }
        
    // version 2
    aList.SelSort();

    aList.Reset();   
    cout << "After sorting, the list of values are: " << endl;
    for (int i=0; i<aList.Length(); i++)   {
        value= aList.GetNextItem();
        cout << value.title << "  " << value.author<< endl;
    }

    myIn.close();
    return 0;
}
