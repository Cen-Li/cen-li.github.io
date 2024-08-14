#include <iostream>
using namespace std;

#include "list.h"

List::List()
{
   count = 0;
   lastIndex = -1;
}

void List::Display()   const
{
   for (int i=0; i<count; i++)
       cout << items[i] << endl;
}

bool List::IsFull()  const
{
   return (count == SIZE);

   /*
   if (count == SIZE) 
      return true;
   else 
      return false;
   */
}

bool List::IsEmpty() const
{
   return (count==0);
}

bool List::ReturnLast(int &returnVal) 
{
   if (!IsEmpty())
   {
      returnVal = items[lastIndex];
      return true;
   }
   else
      return false;
}

int List::Search(int v) const
{
   for (int i=0; i<count; i++)
   {
      if (items[i] == v)
          return i;
   }

   return -1;
} 


bool List::Insert(int v)
{
    int i;
    int loc;

    if (IsFull())
       return false;
    else
    {
       // search for the right location
       for (i=0; i<count; i++)
       {
           if (v < items[i])
              break;
       }
       
       loc = i;
       for (int j=count; j>loc; j--)
       {
            items[j] = items[j-1];
       }
  
       items[loc] = v;

       count ++;
       lastIndex = count-1;

       return true;
    }
}








































