// Implementation file array-based list ("list.cpp")

#include "slist.h"
#include  <iostream>
using namespace std;

SortedList::SortedList ()
// Constructor
// Post: length == 0
{
      length = 0;
      currentPos = 0;
}

bool  SortedList::IsEmpty ()  const
// Post: Return value is true if length is equal
//  to zero and false otherwise
{
      return (length == 0);
}

bool  SortedList::IsFull ()  const
// Post: Return value is true if length is equal
//  to MAX_LENGTH and false otherwise
{
      return (length == MAX_LENGTH);
}
      
int  SortedList::Length ()  const
// Post: Return value is length
{    
      return  length;
}

void SortedList::Insert (/* in */  ItemType  item)
// Pre: length < MAX_LENGTH && item is assigned
//    && data[0 . . length-1] are in ascending order
// Post: item is in the list && length == 
//    length@entry + 1 && data[0 . . length-1] are 
//    in ascending order
{
    int index;

    // start from the last item in the list
    index  =  length-1;

    // Starting at bottom of array shift down
    //  values larger than item to make room for new item
    while (index >= 0  &&  item <= data[index]) {   
    	data[index+1] = data[index];
    	index--;
    }   

    if (index<0) 
        data[0] = item;  // item should be at the front of the list
    else 
    	data[index+1] = item; // Insert item into array
    
    length++;
}


bool SortedList::IsPresent( /* in */ ItemType item) const   
// Searches the list for item, reporting  whether found
// Post: Function value is true, if item is in 
//   data[0 . . length-1] and is false otherwise
{    
    int index  =  0;
    while (index < length && item != data[index])
          index++;

    return  (index < length);
}

void  SortedList::Delete ( /* in */  ItemType  item) 
//  Deletes item from list, if it is there
//  Pre: 0 < length <= INT_MAX/2 && item is assigned
//     && data[0 . . length-1] are in ascending order
//  Post: IF item is in data array at entry
//   First occurrence of item is no longer in array
//   && length == length@entry-1
//   && data[0 . . Length-1] are in ascending order
//     ELSE
//     length and data array are unchanged
{    
    bool found;  // true, if item is found
    int  position; // Position of item, if found
    int  index;

    // Find location of element to be deleted
    BinSearch (item, found, position);
    if (found)  {
       // Shift elements that follow in sorted list
       for (index = position; index < length + 1;  index++)
           data[index ] = data[index  + 1];

       length--;
   }
}

void  SortedList::BinSearch (ItemType  item,   bool&  found,  int&  position)   const
// Searches sorted list for item, returning position of item,
//  if item was found
{   
    int middle;
    int first  =  0;
    int last  = length - 1;
    found = false;

    while (last >= first  &&   !found) {  
         middle = (first + last)/2; // Index of middle element

         if (item  <  data[middle])     
             last = middle - 1;  // Look in first half next 
         else if (item  >  data[middle])     
            first = middle + 1;  // Look in second half next
         else
            found = true;        // Item  has been found
     }
     if  (found) 
         position = middle;
}

void SortedList::Reset()
// Post: currentPos has been initialized.
{
    currentPos = 0;
}


ItemType SortedList::GetNextItem ()
// Pre: No transformer has been executed since last call
// Post:Return value is currentPos@entry
//   Current position has been updated
//   If last item returned, next call returns first item
{
    ItemType item;
    item = data[currentPos];
    if (currentPos == length - 1)
        currentPos = 0;
    else
        currentPos++;
    return item;    
}

void  SortedList::SelSort () 
// Sorts list into ascending order 
{   
    ItemType temp;
    int sIndx;
    int minIndx; // Index of minimum so far    
    
    for (int passCount = 0; passCount < length - 1; passCount++) {

       minIndx = passCount;

       // Find index of smallest value left
       for (sIndx = passCount + 1; sIndx < length; sIndx++)  {
          if (data[sIndx] < data[minIndx])
                minIndx = sIndx;
       }

       temp = data[minIndx];     // Swap 
       data[minIndx] = data[passCount];
       data[passCount] = temp;
   }
}

void SortedList::Print()  const
// display the list of items
{
   cout << "The list of items are: " << endl;
   for (int i=0; i<length; i++) {
       cout << data[i] << endl;
   }
   cout << endl;
}
