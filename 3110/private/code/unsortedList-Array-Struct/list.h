#include <string>
using namespace std;

struct bookType
{
   string title;
   string author;

   bool operator != (const bookType & rhs) { return title!=rhs.title || author != rhs.author;}
   bool operator < (const bookType & rhs) { return title<rhs.title;}
};

// Specification file array-based list (list.h)
const  int  MAX_LENGTH  =  50;
typedef bookType ItemType;

#ifndef List_H
#define List_H

class List           // Declares a class data type
{                       

public:               // Public member functions

    List();           // constructor
    bool IsEmpty () const;
    // Post: Return value is true if length is equal
    //  to zero and false otherwise

    bool IsFull ()  const;              
    // Post: Return value is true if length is equal
    //  to MAX_LENGTH and false otherwise

    int  Length ()  const; // Returns length of list 
    // Post: Return value is length

    void Insert (ItemType  item);   
    // Pre: length < MAX_LENGTH && item is assigned
    // Post: data[length@entry] == item &&
    //       length == length@entry + 1

    void Delete (ItemType  item);   
    // Pre: length > 0  &&  item is assigned
    // Post: IF item is in data array at entry
    //      First occurrence of item is no longer
    //   in array
    //         && length == length@entry - 1
    //      ELSE
    //       length and data array are unchanged

    bool IsPresent(ItemType  item)  const;
    // Post: currentPos has been initialized.

    void SelSort ();
    // Sorts list into ascending order

    void Reset ();
    // Post: currentPos has been initialized.

    ItemType GetNextItem ();  
    // Pre: No transformer has been executed since last call
    // Post:Return value is currentPos@entry
    //   Current position has been updated
    //   If last item returned, next call returns first item

private:          // Private data members
    int length; // Number of values currently stored
    ItemType data[MAX_LENGTH]; 
    int  currentPos;  // Used in iteration       
};  

#endif

// Practice: Add a method to the class that can replace a value with a new
// value specified by user
