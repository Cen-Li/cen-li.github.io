#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

void Print(const List &aList);
void SortList(List& aList);
void Swap(List& aList, int index1, int index2);

int main()
{
   List         aList;
   ListItemType item;
   bool         success;
   int 		i=0;

   while (cin)
   {
	cout << "Enter list item " << i << ": ";
        cin >> item;
	if (cin) 
	   aList.insert(i, item, success);
	i++;
   }  

   cout << "before sorting: " << endl;
   Print(aList);

   SortList(aList);

   cout << "after sorting: " << endl;
   Print(aList);

   return 0;
}

void Print(const List & aList)
{

   ListItemType  item;
   bool 	 success;

   if (aList.getLength() >= 1) {
       cout << "The list of items are: " << endl;

       for (int i=0; i<aList.getLength(); i++) {
           aList.retrieve(i, item, success);
	   if (success)
	      cout << item << endl;
       }
   }
   else 
      cout << "The list is empty." << endl;
}
  	     
void SortList(List& aList)
{
    ListItemType   item1, item2;
    bool	   success;
    int  	   minIndex;

    for (int i=0; i<aList.getLength()-1; i++) {
        
	minIndex = i;
	for (int j=i+1; j<aList.getLength(); j++) {
            aList.retrieve(j, item1, success);
            aList.retrieve(minIndex, item2, success);

            if (item1 < item2) {
	    	minIndex = j;
            }
         }

	 if (minIndex != i) 
	 	Swap(aList, minIndex, i);
    }
}

void Swap(List& aList, int index1, int index2)
{
    ListItemType temp1, temp2;
    bool success;
   
    aList.retrieve(index1, temp1, success);
    aList.retrieve(index2, temp2, success);

    // replace item at index1 position
    aList.remove(index1, success);
    aList.insert(index1, temp2, success);

    aList.remove(index2, success);
    aList.insert(index2, temp1, success);
}
