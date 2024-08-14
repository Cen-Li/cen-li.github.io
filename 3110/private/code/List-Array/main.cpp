#include "List.h"
#include <iostream>
using namespace std;

int main()
{
   List aList;
   bool success;
   ListItemType data;

   aList.insert(0, 45, success);
   aList.insert(0, 30, success);
   aList.insert(0, 50, success);

   for (int i=0; i<aList.getLength(); i++)
   {
	aList.retrieve(i, data, success);
	cout << data << endl;
   }

   aList.remove(1, success);

   cout << "after removing the 2nd item: " << endl;
   for (int i=0; i<aList.getLength(); i++)
   {
	aList.retrieve(i, data, success);
	cout << data << endl;
   }

   return 0;
}
