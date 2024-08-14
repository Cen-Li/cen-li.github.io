#include <cstdlib>
#include <ctime>
#include <iostream>
#include <string>
using namespace std;

#include "sortedListClass.cpp" //  <== key!!
// The compiler must know the template argument
// in order to generate a function template
// Since this argument is located in the client code
// To make this happen:
//  - combine specification file and implementation file into one
//  - include this file in the client file



int main()
{
    sortedListClass<int> intList;
    sortedListClass<float> floatList;
    sortedListClass<string> stringList;

    srand(time(0));

    // Build a list of integer numbers
    for (int i=0; i<10; i++)
        intList.Insert(rand()%100);
    cout << "Sorted list of integers: " << endl;
    intList.printList();

    for (int i=0; i<10; i++)
    	floatList.Insert(rand()%100+0.5);
    cout << "Sorted list of floating values: " << endl;
    floatList.printList();

    for (int i=0; i<5; i++)  {
    	string name;
        cout << "enter a name:" << endl;
	cin >> name; 
	stringList.Insert(name);
    }
    cout << "Sorted list of names:" << endl;
    stringList.printList();

    return 0;
}
