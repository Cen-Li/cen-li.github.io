// Specification file for the the IntegerList class.
#ifndef INTEGERLIST_H
#define INTEGERLIST_H

class IntegerList
{
private:
   int *list;                 // Pointer to the array.
   int numElements;           // Number of elements.
   bool isValid(int) const;   // Validates subscripts.

public:
   IntegerList();             // default constructor
   IntegerList(int);          // Constructor
   //IntegerList(int, int);
   // how to add a copy constructor for this class?

   ~IntegerList();            // Destructor necessary for this class

   int getLength() const;   // return the capacity of the list

   void setElement(int value, int loc); 
    // Sets an array element (at location "loc") to a value
    // If the location is not valid, setElement exits the program

   int getElement(int loc) const; 
    // Returns an element at array location "loc"
    // If the location is not valid, getElement exits the program
};
#endif