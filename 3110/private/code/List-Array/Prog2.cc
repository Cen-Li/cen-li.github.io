// this example shows how to build a sorted list from data
#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

const int SIZE=4;

// user defined functions
void InsertInorder(List&oneList, const ListItemType &newItem, bool&success);
void PrintList(const List& list);

int main()
{
   int 			i;
   List         aList;
   ListItemType dataItem;
   bool         success=true;

   i=1;
   do 
   {
   		cout << "Enter list item " << i << ": ";
		cin >> dataItem;
    	InsertInorder(aList, dataItem, success);
	    i++;
   }
   while (cin && success);

   PrintList(aList);

   return 0;
}

void InsertInorder(List&oneList, const ListItemType &newItem, bool&success)
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
