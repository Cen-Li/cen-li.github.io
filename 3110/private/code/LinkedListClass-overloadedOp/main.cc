#include "List.h"
#include <iostream>
#include <iomanip>
using namespace std;

void PrintList(listClass & );

int main()
{
	listClass  firstList;
	bool success;
	
	// build firstList with 3 items
	firstList.ListInsert(1, 4, success);
	firstList.ListInsert(2, 6, success);
	firstList.ListInsert(3, 3, success);

	// display first list
	cout << "First List: " << endl;
	PrintList(firstList);

	// create secondList as a copy of the first List
	listClass secondList(firstList);
	cout << "Second List: " << endl;
	PrintList(secondList);

	// modify secondList
	secondList.ListInsert(4, 7, success);
	secondList.ListDelete(1, success);
	cout << "After Insert and Delete operations " << endl;
	cout << "Second List: " << endl;
	PrintList(secondList);

	// compare the two lists
	if (firstList==secondList)
		cout << endl << "two lists are the same"<< endl;
	else
		cout << endl << "two lists are different" << endl;
	cout << endl;

	// use assignment operator
	firstList = secondList;

	cout << "after assignment operator is used on firstList, " << endl;
	cout << "First List: " << endl;
	PrintList(firstList);
	
	// compare the two lists
	if (firstList==secondList)
		cout << endl << "two lists are the same"<< endl;
	else
		cout << endl << "two lists are different" << endl;


	return 0;
}

void PrintList(listClass & list)
{
	for (int i=0; i<list.ListLength(); i++)
	{
		cout << setw(4) << list[i];
	}
	cout << endl;
}
