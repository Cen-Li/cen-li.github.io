#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

void PrintInReverse(List aList);
void SortList(List aList);
void Swap(List aList, int index1, int index2);

int main()
{
   List         aList;
   ListItemType item;
   bool         success;

   for (int i=1; i<=MAX_LIST; i++)
   {
	cout << "Enter list item " << i << ": ";
        cin >> item;
    	aList.insert(i, item, success);
   }

   SortList(aList);

   return 0;
}

void PrintInReverse(List aList)
{

   ListItemType  item;
   bool 		 success;

   if (aList.getLength() >= 1)
       cout << "The list of items are: " << endl;
   else
   {
       cout << "The list is empty." << endl;
       return;
   }

   for (int i=aList.getLength(); i>=1; i++)
   {
        aList.retrieve(i, item, success);
	if (success)
		cout << item << endl;
   }
}
  	     
void SortList(List aList)
{
    ListItemType   item1, item2;
    bool	   success;
    bool           sorted = false;
    int            last=aList.getLength();

    while (!sorted)
    {
         sorted = true;
         for (int i=1; i<=last; i++)
         {
               aList.retrieve(i, item1, success);
               aList.retrieve(i+1, item2, success);

               if (item1 < item2)
               {
                   Swap(aList, i, i+1);
                   sorted = false;
               }
         }

         last --;
    }
}

void Swap(List aList, int index1, int index2)
{
    ListItemType temp1, temp2;
    bool success;
   
    aList.retrieve(index1, temp1, success);
    aList.retrieve(index2, temp2, success);

    // replace item at index1 position
    aList.remove(index1, success);
    aList.insert(index1, temp2, success);

    aList.insert(index2, temp1, success);
}
