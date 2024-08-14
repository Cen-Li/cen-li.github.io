#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

const int SIZE=4;

// user defined functions
void PrintList(const List& list);
void SortList(List& aList);
void Swap(List& aList, int index1, int index2);

int main()
{
   int 			i;
   List         aList;
   ListItemType dataItem;
   bool         success;

   i=1;
   cout << "Enter list item " << i << ": ";
   while (cin>>dataItem)
   {
	    aList.insert(i, dataItem, success);
	    i++;
        cout << "Enter list item " << i << ": ";
   }

   PrintList(aList);

   cout << "after sorting..." << endl;
   SortList(aList);
   PrintList(aList);

   return 0;
}

void PrintList(const List& oneList)
{
	ListItemType oneItem;
	bool   success;

	cout << endl << endl;
    if (oneList.getLength() >= 1)
       cout << "The list of items are: " << endl;
    else
    {
       cout << "The list is empty." << endl;
       return;
    }

	for (int i=1; i<=oneList.getLength(); i++)
	{
		oneList.retrieve(i, oneItem, success);
		if (success)
			cout << oneItem << endl;
	}
	cout << endl << endl;;
}

void SortList(List& oneList)
{
    ListItemType   item1, item2;
    bool 		   success;
    bool           sorted = false;
    int            last=oneList.getLength();

    while (!sorted)
    {
         sorted = true;
         for (int i=1; i<last; i++)
         {
               oneList.retrieve(i, item1, success);
               oneList.retrieve(i+1, item2, success);

               if (item1 < item2)
               {
                   Swap(oneList, i, i+1);
                   sorted = false;
               }
         }

         last --;
    }
}

void Swap(List& oneList, int index1, int index2)
{
    ListItemType temp1, temp2;
    bool success;
   
    oneList.retrieve(index1, temp1, success);
    oneList.retrieve(index2, temp2, success);

    // replace item at index1 position
    oneList.remove(index1, success);
    oneList.insert(index1, temp2, success);

	oneList.remove(index2, success);
    oneList.insert(index2, temp1, success);
}
