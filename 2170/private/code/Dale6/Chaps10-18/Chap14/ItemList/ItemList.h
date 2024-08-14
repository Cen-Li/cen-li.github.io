// Header file for class ItemList
// The user must provide a file "DataDefn.h" that includes a
// definition of ItemType, the type of the items in the list.

#include "DataDefn.h"		// to access ItemType

struct NodeType;			// forward declaration

class ItemList
{
public:
  ItemList();
  // Post: List is the empty list.

  ItemList(const ItemList& otherList);
  // Copy-constructor for ItemList.

  bool IsThere(ItemType  item) const;
  // Post: If item is in the list IsThere is   
  //       True; False, otherwise.                      

  void Insert(ItemType  item);
  // Pre:  item is not already in the list.             
  // Post: item is in the list.  

  void Delete(ItemType  item);
  // Pre:  item is in the list.                                  
  // Post: item is no longer in the list. 

  void Print() const;
  // Post: Items on the list are printed on the screen.

  int GetLength() const;
  // Post: Length is equal to the number of items in the 
  //       list. 

  ~ItemList();
  // Post: List has been destroyed.

private:
  NodeType* listPtr;
};

