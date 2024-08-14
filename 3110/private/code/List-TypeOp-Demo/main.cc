#include <iostream>
using namespace std;
#include "ListP.h"

int main()
{
	listClass   oneList;
    bool   success;
	int    item, retrieved;
	
	for (int i=1; i<=10; i++)
	{
		cout << "Enter data " << i << " : ";
		cin >> item;
	    oneList.ListInsert(i, item, success);
	}

 	oneList.ListRetrieve(5, retrieved, success);
	cout << "The 5th item in the list is " << retrieved << endl;

	return 0;
}
