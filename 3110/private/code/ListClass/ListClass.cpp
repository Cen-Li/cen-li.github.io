// File:  ListClass.cpp
// This file is the implementation file for a safe array class.
//
//The list class contains a default constructor, a
//copy constructor, a method to access the length of the
//list, an insert method to always insert at the beginning of
//the list, and overloaded assignment, comparison equals, and
//square brackets.
//
//The overloaded square brackets test to make sure the value 
//of the index is not out-of-bounds.

#include "ListClass.h"
#include <cstdlib>
using namespace std;


//default constructor
ListClass::ListClass():size(0)
{}

//copy constructor
ListClass::ListClass(const ListClass& list)
{
	size = list.size;
	for (int i = 0; i < size; i++)
		items[i] = list.items[i];
}

//print the list of items
void ListClass::printList()const
{
	for (int i=0; i < size; i++)
		cout << items[i] << "  ";
	cout << endl;
}

//determine the length of the list 
int ListClass::listLength()const
{
	return size;
}

//Put an item into the list at the ith location.
//No shifting takes place. If the ith location already has a value,
//it will be replaced with the new value
void ListClass::insert(const ListItemType &value, int i)
{
	if (i >=0 && i < size)                       //Are we just changing an already existing item?
	{
		items[i] = value;
	}
	else if (i >= size && size < MAX_LIST - 1)   //Are we adding an item after size?
	{
		items[i] = value;
		size++;
	}
	else                                         //Is size too big?
	{	
		cout << "Fatal Error -- Index out of bounds\n";
		exit (0);
	}
}

//overloaded comparison equal operator
bool ListClass::operator==(const ListClass& rhs)
{
	if (size != rhs.size)
		return false;
	else
	{
		for(int i=0; i < size; i++)
		{
			if(items[i] != rhs.items[i])
				return false;
		}
	}
	return true;
}

//overloaded assignment equal
ListClass ListClass::operator =(const ListClass &rhs)
{
	size = rhs.size;
	for (int i=0; i < rhs.size; i++)
		items[i] = rhs.items[i];
	return *this;
}

//overloaded []
ListItemType& ListClass::operator[](int index)
{
	//Is the index out-of-bounds?
	if (index < 0 || index >= MAX_LIST)
	{
		cout << "Error -- index out of bounds\n";
		exit (0);
	}

	//If index > size (inserting at this item for the first time),
	//insert anything at that index to increase the size
	if (index >= size)
		insert (0, index);

	//Now return an l-value so items[index] can be filled
	//or retrieved
	return items[index];
}
