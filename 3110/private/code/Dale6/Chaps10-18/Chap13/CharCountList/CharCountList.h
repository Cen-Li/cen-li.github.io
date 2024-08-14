//******************************************************************
// SPECIFICATION FILE (charCountList.h)
// This file gives the specification of the list needed to
// count characters in a list.
// The list components are not assumed to be in order by value.
//******************************************************************

#include "type.h"

#ifndef CharCountList_H
#define CharCountList_H

class CharCountList
{
public:
  CharCountList();
  
  void Store(char character);
  // Puts character in the list with a count of one
  
  // Action responsibilities
  void IncrementCount(char character);
  // Increments count field accosicated with character

  void ResetList();
  // Initializes for client iteration
 
  // Knowledge responsibilities
  ItemType GetNextItem();
  // Returns next item in the traversal.
  // Assumes no transformer called since last class to function

  bool HasNextItem();
  // Returns true if next item exists; false otherwise 

  bool IsThere(char character);
  // Returns true if character is in the list; false otherwise  

  bool IsFull() const;
  // Returns true when there are MAX_LENGTH items in the list
  // Otherwise, return false
        
private:
    int length;
    int currentPos;
    ItemType data[MAX_LENGTH];
};

#endif
