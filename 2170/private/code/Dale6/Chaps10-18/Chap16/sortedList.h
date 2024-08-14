const int MAX_ITEMS = 20;
typedef int ItemType;

class SortedList
{
public:
  SortedList();
  // Constructor
  
  void Insert(ItemType item);
  // Pre:  List is sorted in increasing order;
  //       item is not in the list; 
  //       the list is not full. 
  // Post: Item is in the list; list is still sorted. 
  void PrintList();
  // Post: If the list is not empty, the elements are
  //       printed on the screen in increasing order; 
  //       otherwise "The list is empty" is
  //       printed on the screen.
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
}

