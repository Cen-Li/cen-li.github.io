#include <iostream>
using namespace std;

#ifndef LIST_H
#define LIST_H

const int SIZE = 100;

class List
{
   public:
      List();  // default constructor
      //List(const List& l);   // copy constructor

      void Display() const;
     
      bool Insert(int v);
      //bool Delete(int v);

      bool IsEmpty() const;
      bool IsFull()  const;

      int Search(int v)  const;
      //void Swap(int x, int y);
      
      bool ReturnLast(int & rv);

   private:
      int  items[SIZE];
      int  count;
      int  lastIndex;
};

#endif
