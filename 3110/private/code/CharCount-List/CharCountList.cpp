//******************************************************************
// IMPLEMENTATION FILE (CharCountList.cpp)
// This file implements the list class member functions needed
// to count characters in text
// List representation: a one-dimensional array, a length variable,
// and a current position for traversals.
//******************************************************************
#include "CharCountList.h"
#include <iostream>

using namespace std;

//******************************************************************

CharCountList::CharCountList()
{
  length = 0;
  currentPos = 0;
}


//******************************************************************

void CharCountList::Store(char character)
{
  ItemType item;
  item.count = 1;
  item.letter = character;
  data[length] = item;
  length++;
}

//******************************************************************

void CharCountList::IncrementCount(char character)
// Uses linear search
{
  int index = 0;    // Index variable
  while (index < length && character != data[index].letter)
	 index++;
  data[index].count++;
}

//******************************************************************

void CharCountList::ResetList()
{
  currentPos = 0;
}

//******************************************************************

ItemType CharCountList::GetNextItem()
{
  ItemType item;
  item = data[currentPos];
  currentPos++;
  return item;
}


//******************************************************************

bool CharCountList::HasNextItem()
{
  return currentPos != length;
}

//*****************************************************************

bool CharCountList::IsThere(char character)
{
  int index = 0;    // Index variable
  while (index < length && character != data[index].letter)
	 index++;
  return index != length;
}

//*****************************************************************

bool CharCountList::IsFull() const
{
  return length==MAX_LENGTH;
}
