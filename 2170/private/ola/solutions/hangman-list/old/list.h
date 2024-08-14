#ifndef LIST_H
#define LIST_H

const int MAX_LENGTH=100;

struct itemStruct
{
    char  value;
    bool  show;

    bool operator != (itemStruct rhs);
    bool operator == (itemStruct rhs);
};

bool itemStruct::operator != (itemStruct rhs)
{
    return (value!= rhs.value);
}

bool itemStruct::operator == (itemStruct rhs)
{
    return (value == rhs.value);
}

typedef itemStruct ItemType;

class List
{
public:
    List();
    // Constructor
    // Post: Empty list has been created

    void Insert(ItemType item);
    // Pre: List is not full and item is not in the list
    // Post: item is in the list and length has been incremented

    void Delete(ItemType item);
    // Post: item is not in the list

    void ResetList();
    // The current position is reset to access the first item in the list

    ItemType GetNextItem();
    // Assumption: No transformers are called during the iteration.
    // There is an item to be returned; that is, HasNext is true when
    // this method is invoked
    // Pre: ResetList has been called if this is not the first iteration
    // Post: Returns item at the current position.

    void Modify(ItemType item);

    int GetLength()  const;
    // Post: Returns the length of the list

    bool IsEmpty()  const;
    // Post: Returns true if list is empty; false otherwise

    bool IsFull() const;
    // Post: Returns true if the list is full; false otherwise

    bool IsThere(ItemType item) const;
    
    bool  HasNext() const;

private:
    int  length;
    int  currentPos;
    ItemType  data[MAX_LENGTH];
};

#endif
