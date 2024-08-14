#include <iostream>
#include "mammal.h"
using namespace std;

int main()
{
    mammal baby;
    mammal mama(124, 30, 18);

    cout << "baby is born." << endl;
    cin >> baby;  // overloaeded >> operator
    cout <<"The baby animal's weight is " << baby.returnWeight() << " pounds." << endl << endl;

    baby.setWeight(35);
    baby.setHeight(24);
    cout << "3 months later ... " << endl;
    cout << baby; // overloaed << operator
    cout << endl;

    if (baby < mama)   // overloaed < operator
    {
        cout << "The baby animal says :\t";
        baby.speak();   
        cout << endl;
    }
    else {
        cout << "That's not possible" << endl;
    }

    return 0;
}
