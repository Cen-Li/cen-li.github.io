// main.cc
// Compile with: aCC mammal.cpp dog.cpp showdog.cpp main.cc
// Dynamic binding

#include "showdog.h"
using namespace std;

void WhatDoesItSay(const mammal & who);

int main()
{
    mammal animal;
    dog myDog(2, 10, 2, COLLIE);
    showdog precious(10, 20, 3, TERRIER, OPEN);

    cout << endl;
    cout << "Here is everything about My Precious:" << endl 
         << precious << endl;
    cout << "My show dog says:\t";
    WhatDoesItSay(precious);
    cout << endl;


    cout <<"My dog says :\t";
    WhatDoesItSay(myDog);
    cout << endl;

    cout <<"Animal says :\t";
    WhatDoesItSay(animal);
    cout << endl;

    if (myDog < precious)
    {
        cout << "My dog: " << endl;
        cout << myDog;
        cout << endl;
    }
    else if (animal < precious)
    {
        cout << "The animal : " << endl;
        cout << myDog;
        cout << endl;
    }

    return 0;
}

void WhatDoesItSay(const mammal & who)
{
    who.speak();
}
