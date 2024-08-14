// *********************************************************
#include "List.h" //header file
#include <iostream>
using namespace std;

List::List()
{
    size=0;
} // end default constructor

/*
List::List(ListItemType values[], int number)
{
    int i;

    for (i=0; i<MAX_LIST&&i<number; i++)
        items[i] = values[i];
    size = i;
}
*/

bool List::isEmpty() const
{
   return bool(size == 0);
} // end isEmpty


int List::getLength() const
{
   return size;
} // end getLength

void List::insert(int index, ListItemType newItem, bool& success)
{
   success = bool((index >= 0) && (index <= size) && (size < MAX_LIST));

   if (success)
   {  // make room for new item by shifting all items at
      // positions >= index toward the end of the
      // list (no shift if index == size+1)
      for (int pos = size-1; pos >= index; pos--)
         items[pos+1] = items[pos];

      // insert new item
      items[index] = newItem;
      size++; // increase the size of the list by one

   } // end if
   else 
      cerr << "insert: Index out ot bound. Operation not carried out" << endl;;
} // end insert

void List::remove(int index, bool& success)
{
   success = bool( (index >= 0) && (index < size) );

   if (success) {  // delete item by shifting all items at positions >
      // index toward the beginning of the list
      // (no shift if index == size)
      for (int fromPosition = index+1; fromPosition < size; fromPosition++)
         items[fromPosition-1] = items[fromPosition];

      size--; // decrease the size of the list by one
   } // end if
   else 
      cerr << "remove: Index out ot bound. Operation not carried out" << endl;

} // end remove


void List::retrieve(int index, ListItemType& dataItem, bool& success) const
{
   success = bool( (index >= 0) && (index < size) );

   if (success)
      dataItem = items[index];
} // end retrieve


int List::find(const ListItemType & item)
{
	for (int i=0; i<size; i++) {
		if (items[i] == item)
			return i;
	}
	
	return -1;
}
// End of implementation file.
