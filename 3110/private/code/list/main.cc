#include <iostream>
using namespace std;
#include "list.h"

int main()
{
    List l1;
    int value;

    for (int i=0; i<10; i++)
    {
       cin >> value;
       if (! l1.Insert(value)) 
          cout << "List is full, can add more" << endl;
    }

    l1.Display();
 
    return 0;
}
