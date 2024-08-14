#ifndef LIST_H
#define LIST_H

struct itemStruct
{
    char  value;
    bool  show;

    bool operator != (itemStruct rhs)
    {     
        return (value != rhs.value);
    }
};

const int MAX_LENGTH=100;
typedef itemStruct ItemType;

class List
{
public:
    // Constructor
    // Post: Empty list has been created
    List();

    // Pre: List is not full and item is not in the list
    // Post: item is in the list and length has been incremented
    void Insert(ItemType item);

    // Delete the "item" from the list
    void Delete(ItemType item);

    // The current position is reset to access the first item in the list
    void ResetList();

    // Assumption: No transformers are called during the iteration.
    // There is an item to be returned; that is, HasNext is true when
    // this method is invoked
    // Pre: ResetList has been called if this is not the first iteration
    // Post: Returns item at the current position.
    ItemType GetNextItem();

    // This function modifies the "show" field of the item from "false" to "true"
    // Pre: the "value" field of the parameter "item" is set to the character to be modified
    // Post: the "show" field of the array element corresponding to "item" is changed to "true"
    void Modify(ItemType item);

    // This function returns the length of the list
    int GetLength()  const;

    // This function returns true if list is empty; false otherwise
    bool IsEmpty()  const;

    // This function returns true if the list is full; false otherwise
    bool IsFull() const;

    // This function checks to see if the "item" passed in to the function is in 
    // "data" array
    bool IsThere(ItemType item) const;
    
    // The function returns true if there is another valid item in the list, i.e.,
    // the iterator has not reached the end of the list
    bool HasNext() const;

private:
    int  length;
    int  currentPos;
    ItemType  data[MAX_LENGTH];
};

#endif
