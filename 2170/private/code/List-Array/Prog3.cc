// this example shows array of objects
#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

const int SIZE=4;

// user defined functions
void AddToList(List&oneList, const ListItemType &newItem, bool&success);
void PrintList(const List& list);

int main()
{
   int 			i;
   List         aList;
   ListItemType dataItem;
   bool         success=true;
   List         arrayOfLists[SIZE];

   i=1;
   do 
   {
   		cout << "Enter list item " << i << ": ";
		cin >> dataItem;
    	AddToList(aList, dataItem, success);
	    i++;
   }
   while (cin && success);

   cout << endl << endl;
   cout << "the original list has " << aList.getLength() << " items." <<  endl;
   PrintList(aList);

   for (int i=1; i<=aList.getLength(); i++)
   {   
       aList.retrieve(i, dataItem, success);
       arrayOfLists[(i-1)%4].insert((i-1)/4+1, dataItem, success);
   }

   for (int i=0; i<SIZE; i++)
   {
       cout << "list " << i+1 << " has " << arrayOfLists[i].getLength() << " items." << endl;
       PrintList(arrayOfLists[i]);
   }

   return 0;
}

void AddToList(List&oneList, const ListItemType &newItem, bool&success)
{
   int  index;
   int  length=oneList.getLength();
   ListItemType  item;

   if (oneList.isEmpty())
	  oneList.insert(1, newItem, success);
   else
   {
      index=1;
      oneList.retrieve(index, item, success);
      while (success && item < newItem)
      {
		index++;
		oneList.retrieve(index, item, success);
      }

      oneList.insert(index, newItem, success);
      if (!success)
	      cerr << "insertion failed." << endl;
   }
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
