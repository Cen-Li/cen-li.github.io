// main.cpp
// client program for the unsorted list in array based implementation
// It illustrates the usage of list member functions

#include "list.h"
#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

void BuildList(List &aList);
void PrintList(List &aList);

int main ()  
{
    List aList;  // created an emtpy list class object
    ItemType value;

    BuildList(aList);
    PrintList(aList);

    cout << "Enter value to delete : "; 
    cin >> value;
    aList.DeleteAll(value);

    cout << "After deleting, the list of values are: " << endl;
    PrintList(aList);

    return 0;
}

void BuildList(List &aList) {

    ItemType value;

    cout << "Enter a value (^d to stop): " ;
    while (!aList.IsFull() && (cin >>value))  {
        aList.InsertAtFront(value);
    }
    cin.clear();  // skips over the '^d' character
}

void PrintList(List& aList) {

    aList.Reset();
    cout << aList.Length() << " values in the list:" << endl;
    for (int i=0; i<aList.Length(); i++)   {
        cout << aList.GetNextItem() << endl;
    }
}
