// main.cc
// Compile with: aCC mammal.cpp dog.cpp showdog.cpp main.cc
// Dynamic binding with Polymorphism
// Need to use reference

#include <iostream>
#include "showdog.h"
using namespace std;

void WhatDoesItSay(mammal * who);

int main()
{
    mammal *general;

    mammal animal;
    dog myDog(2, 10, 2, COLLIE);
    showdog precious(10, 20, 3, TERRIER, OPEN);

    for (int i=0; i<3; i++)
    {
       if (i==0)  general = &animal;
       else if (i==1) general = &myDog;
       else general = &precious;

       WhatDoesItSay(general);
    }

    return 0;
}

void WhatDoesItSay(mammal * who)
{
    who->speak();
    cout << endl;
}
