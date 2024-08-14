#include "List.h" // ADT list operations
#include <iostream>
using namespace std;

int main()
{
   List         aList;
   ListItemType item;
   bool         success;

   // position of the list starts from 1
   // insert 3 values
   aList.insert(1, 5, success);
   aList.insert(1, 7, success);
   aList.insert(1, 10, success);

cout << "length=" << aList.getLength() << endl;

   for (int i=aList.getLength(); i>=1; i--)
   {
        aList.retrieve(i, item, success);
		if (success)
			cout << item << endl;
   }

   return 0;
}
