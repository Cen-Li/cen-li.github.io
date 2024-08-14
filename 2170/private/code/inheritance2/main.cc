// main1.cc
// Compile with: aCC mammal.cc dog.cc main1.cc
// Look at the order of execution for the contructors and destructors

#include <iostream>
#include "dog.h"
using namespace std;

int main()
{
    mammal animal;
    dog myDog(2, 10, 2, COLLIE);

    cout << endl;
    cout << "My dog's weight is " << myDog.returnWeight() << " pounds\n";
    cout <<"My dog's height is " << myDog.returnHeight() << " inches\n";
    cout << endl;

    cout <<"The animal's weight is " << animal.returnWeight() << " pounds\n" << endl;

    cout <<"My dog says :\t";
    myDog.speak();

    cout <<"Animal says :\t";
    animal.speak();
    cout << endl;

    dog  newAdopt(myDog);
    newAdopt.setWeight(105);
    if (myDog < newAdopt)
    {
        cout << "Our newly adopted dog: " << endl;
        cout << newAdopt;
        cout << endl;
    }
    else 
    {
        cout << "Our newly adopted dog is lighter." << endl;
    }

    return 0;
}
