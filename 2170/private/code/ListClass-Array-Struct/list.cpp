// *********************************************************
// Implementation file ListA.cpp for the ADT list
// Array-based implementation
// *********************************************************
#include "list.h" //header file

List::List() : size(0)
{
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
   success = bool( (index >= 1) &&
                   (index <= size+1) &&
                   (size < MAX_LIST) );
   if (success)
   {  // make room for new item by shifting all items at
      // positions >= index toward the end of the
      // list (no shift if index == size+1)
      for (int pos = size; pos >= index; --pos)
         items[translate(pos+1)] = items[translate(pos)];

      // insert new item
      items[translate(index)] = newItem;
      ++size; // increase the size of the list by one
   } // end if
} // end insert

void List::remove(int index, bool& success)
{
   success = bool( (index >= 1) && (index <= size) );

   if (success)
   {  // delete item by shifting all items at positions >
      // index toward the beginning of the list
      // (no shift if index == size)
      for (int fromPosition = index+1;
               fromPosition <= size; ++fromPosition)
         items[translate(fromPosition-1)] =
                             items[translate(fromPosition)];
      --size; // decrease the size of the list by one
   } // end if
} // end remove


void List::retrieve(int index, ListItemType& dataItem,
                    bool& success) const
{
   success = bool( (index >= 1) &&
                   (index <= size) );

   if (success)
      dataItem = items[translate(index)];
} // end retrieve


int List::translate(int index) const
{
   return index-1;
} // end translate
// End of implementation file.
