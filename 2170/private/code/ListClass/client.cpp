//File:        client.cpp
//
//The purpose of this program is to test ListClass. 
//
//There is no input.
//
//Output includes the data inserted into the ListClass.
//
//This program does limited testing of the ListClass.

#include "ListClass.h"
#include <cstdlib>
using namespace std;

int main()
{
	ListClass l1, l2;                   //Create two lists for testing
	l1.insert(1, 0);                    //insert 1 at the beginning of the two lists
	l2.insert(1, 0);
	

	l1.insert(2, 1);                    //Now insert 2 at index 1 in the two lists
	l2.insert(2, 1);


	ListClass l3;
    l3 = l1;


	if (l1 == l2)                       //Are the two lists the same?
		cout << "same lists" << endl;   //If so print a message

	l1.insert(3, 0);                    //change the value at index 0 to 3

	cout << "List l1 contains: ";       //print list l1
	l1.printList();                     

	l1[0] = 5;                          //Put the value 5 at index 0
	cout << "After l1[0]=5, l1 contains: ";
	l1.printList();                     //Print the list to see what the elements are

	//Now use the square brackets to retrieve a value from the list
	cout << "Using [] to retrieve index 0 in l1 is: " << l1[0] << endl;

	//add an element to l1 at location 2 and print the list again
	l2[2] = 20;
	cout << "After l2[3] = 20, l2 contains: ";
	l2.printList();

	return 0;
}
