//File:  ListClass.cpp
//
//This file is the header file for a safe array class.
//
//The list class contains a default constructor, a
//copy constructor, a method to access the length of the
//list, an insert method, and overloaded assignment, 
// comparison equals, and square brackets.
//
//The overloaded square brackets test to make sure the value 
//of the index is not out-of-bounds.

#include <iostream>
using namespace std;

//use a generic name for the type
typedef int ListItemType;

#ifndef LISTCLASS_H
#define LISTCLASS_H

//the maximum size of the list
const int MAX_LIST=200;

class ListClass
{
public:
	//default constructor
	ListClass();

	//copy constructor
	ListClass(const ListClass& anotherList);

	//insert an item at the ith location in the list
	void insert(const ListItemType& value, int i);

	//these three are overloaded operators
	bool operator==(const ListClass& rhs);
	ListClass operator=(const ListClass& rhs);
	ListItemType& operator[](int index);

	//print the list of items
	void printList()const;

	//determine the length of the list
	int listLength()const;

private:
	ListItemType items[MAX_LIST];   //contains the items in the list
	int size;                       //contains the number of items in the list
};

#endif
