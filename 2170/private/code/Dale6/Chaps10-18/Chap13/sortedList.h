const int MAX_ITEMS = 20;
#include <string>
typedef string ItemType;

class SortedList
{
public:
  SortedList ();
  // Constructor
  // Post: Empty list is created.

  // Action responsibilities
  void Insert(ItemType item);
  // Pre:  The list is not full;
  // Post: item is in the list; list is stored in
  //       increasing order.
 
  void PrintList();
  // Post: If the list is not empty, the elements are
  //       printed on the screen in increasing order;
  //       otherwise "The list is empty" is
  //       printed on the screen.

  // Knowledge responsibilities
  int GetLength();
  // Post: return value is the number of items in the list.
  bool IsEmpty();
  // Post: returns true if list is empty; false otherwise.
  bool IsFull();
  // Post: returns true if there is no more room in the
  //       list; false otherwise.
private:
  int length;
  ItemType values[MAX_ITEMS];
};

