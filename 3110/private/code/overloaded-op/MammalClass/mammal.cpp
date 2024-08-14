#include "mammal.h"
#include <iostream>
using namespace std;

mammal::mammal()
{
    weight=1;
    height=1;
age=1;

cout <<"Mammal's default constructor" << endl;
}

mammal::mammal(int W, int H, int A)
{
    weight=W;
    height=H;
    age = A;
cout <<"Executing mammal's value constructor\n";
} 

mammal::~mammal()
{
    cout <<"Executing mammal's destructor\n";
}

void mammal::setWeight(int w)
{
    weight = w;
}

void mammal::setHeight(int h)
{
    height = h;
}

int mammal:: returnWeight() const
{
    return (weight);
}

int mammal::returnHeight() const
{
    return (height);
}

void mammal::speak()const
{
    cout <<"Mammal is speaking" << endl;
}

