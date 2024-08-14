// header file for sorted list class

#ifndef LIST_H
#define LIST_H

typedef int ItemType;      // change this line to use a struct type data, instead of integer type data

struct NodeType;            // forward declaration
typedef NodeType * NodePtr;

struct NodeType
{
  ItemType data;
  NodePtr  next;
};

class SortedList
{
public:
  SortedList();
  // Post: List is the empty list.

  SortedList(const SortedList& otherList);
  // Copy-constructor for ItemList.

  void Insert(ItemType  item);
  // Pre:  item is not already in the list.
  // Post: item is in the list.

  void Delete(ItemType  item);
  // Pre:  item is in the list.
  // Post: item is no longer in the list.

  void Reset();
  // Post: The current position is reset to the first item in the list

  ItemType GetNextItem();
  // Assumptions: No transformers are called during the iteration.
  //        There is an item to be returned; that is HasNext is true when
  //        this method is involed.
  // Pre: ResetList has been called if this is not the first iteration
  // Post: Returns item at the current position

  int GetLength() const;
  // Post: Length is equal to the number of items in the list.

  bool IsEmpty() const;
  // Post: Returns true if listis empty: false otherwise

  bool IsFull() const;
  // Post:  Returns true if list is full; false otherwise

  bool IsThere(ItemType item) const;
  // Post: Returns true if item is in the list and false otherwise

  bool HasNext() const;
  // Post: Returns true if there is another item to be returned
  //       false otherwise

  ~SortedList();   // destructor
  // Post: List has been destroyed.

private:
  NodePtr    head;     // pointer to the first node in the list
  int  	     length;   
  NodePtr    lastPtr;  // pointer to the last node in the list
  NodePtr    currPos;  // pointer to the current position in a traversal
};

#endif
