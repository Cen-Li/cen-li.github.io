template<class ItemType>
class List
{
public:
  // Action respnsibilities
  bool IsEmpty() const;
  // Post: Returns true if list is empty; false otherwise
  bool IsFull() const;
  // Post: Returns true if list if full; false otherwise  
  void Insert(ItemType item);
  // Pre:  List is not full and item is not in the list
  // Post: item is in the list and length has been incremented
  void Delete(ItemType item);
  // Post: item is not in the list
  bool IsThere(ItemType item ) const;
  // Post: Returns true if item is in the list and 
  //       false otherwise
   void ResetList();
  // The current position is reset to access the first item 
  // in the list
  bool HasNext() const;
  // Returns true if there is another item to be returned; false
  // otherwise
  ItemType GetNextItem();
  // Pre:  No transformers are called during the iteration.
  //       There is an item to be returned; that is, hasNext is 
  //       true when this method is invoked
  // Post: Returns item at the current position.

  // Knowledge responsibility
  int GetLength() const;
  // Post: Returns the length of the list

  List();
  // Constructor
  // Post: Empty list has been created
  
  private:
  int length;
  int currentPos;
  ItemType data[MAX_LENGTH];
};

