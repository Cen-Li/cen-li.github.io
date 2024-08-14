// Implementation file array-based list (list.cpp)

#include "list.h"
#include  <iostream>
using namespace std;

List::List ()
// Constructor
// Post: length == 0
{
      length = 0;
}

bool  List::IsEmpty ()  const
// Post: Return value is true if length is equal
//  to zero and false otherwise
{
      return (length == 0);
}

bool  List::IsFull ()  const
// Post: Return value is true if length is equal
//  to MAX_LENGTH and false otherwise
{
      return (length == MAX_LENGTH);
}
      
int  List::Length ()  const
// Post: Return value is length
{    
      return  length;
}

void List::Insert (/* in */  ItemType  item)
// Pre: length < MAX_LENGTH && item is assigned
// Post: data[length@entry] == item && 
//       length == length@entry + 1
{
     data[length] = item;
     length++;
}


bool List::IsPresent( /* in */ ItemType item) const   
// Searches the list for item, reporting  whether found
// Post: Function value is true, if item is in 
//   data[0 . . length-1] and is false otherwise
{    
    int index  =  0;
    while (index < length && item != data[index])
          index++;

    return  (index < length);
}

void  List::Delete ( /* in */  ItemType  item) 
// Pre: length > 0  &&  item is assigned
// Post: IF item is in data array at entry
//      First occurrence of item is no longer 
//   in array
//         && length == length@entry - 1
//      ELSE
//       length and data array are unchanged
{    
    int  index  =  0;
    
    while (index < length  && item != data[index])
          index++;

    // IF item found, move last element into 
    //  item’s place
    if (index < length)
    {
          data[index] = data[length - 1];
          length--;
    }
}

void List::Reset()
// Post: currentPos has been initialized.
{
    currentPos = 0;
}

ItemType List::GetNextItem ()
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

void  List::SelSort () 
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
