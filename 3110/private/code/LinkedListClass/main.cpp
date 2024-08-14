#include <iostream>
using namespace std;
#include "ListP.h"

void DisplayList(const listClass & aList);

int main()
{
	listClass   oneList;
   	 bool   success;
	listItemType item, retrieved;
	
	for (int i=1; i<=10; i++)
	{
		cout << "Enter data " << i << " : ";
		cin >> item;
	    oneList.ListInsert(i, item, success);
	}

 	oneList.ListRetrieve(5, retrieved, success);
	cout << "The 5th item in the list is " << retrieved << endl;

        DisplayList(oneList);
	oneList.ListDelete(8, success);
    	cout << "After deleting item 8 ... " << endl;
    
    	if (success)
        	DisplayList(oneList);

	return 0;
}

void DisplayList(const listClass & aList)
{
    int length;
    listItemType retrieved;
    bool success;

    cout << "Display the list:" << endl;
    length=aList.ListLength();
    for (int i=0; i<length; i++)
    {
        aList.ListRetrieve(i+1, retrieved, success);
        cout << i+1 << ": " <<  retrieved << endl;
    }
}
