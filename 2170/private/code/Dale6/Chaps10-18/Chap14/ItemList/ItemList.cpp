// This is the implementation file for class ItemList

#include <iostream>
#include <cstddef>		// to access NULL
#include "ItemList.h"
using namespace std;

typedef NodeType* NodePtr;

struct NodeType
{
  ItemType item;
  NodePtr  next;
};

ItemList::ItemList()
// Post: listPtr is set to NULL.
{
  // FILL IN Code.
}

//***********************************************************

ItemList::ItemList(const ItemList& otherList)
{
  // FILL IN Code.
}

//***********************************************************


bool  ItemList::IsThere(ItemType  item) const
{
  // FILL IN Code.
}

//***********************************************************
  
void  ItemList::Insert(ItemType  item)
{
  // FILL IN Code.
}

//***********************************************************

void  ItemList::Delete(ItemType  item)
{
  // FILL IN Code.
}

//***********************************************************
 
void  ItemList::Print() const
{
  // FILL IN Code.
}

//***********************************************************

int  ItemList::GetLength() const
// Post: Number of items have been counted; result returned.
{
  // FILL IN Code.
}

//***********************************************************

ItemList::~ItemList()
// Post: All the components are deleted.
{
  // FILL IN Code.
}

