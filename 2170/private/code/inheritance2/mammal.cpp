#include "mammal.h"
#include <iostream>
using namespace std;

mammal::mammal()
{
    cout << "Executing mammal's default constructor" << endl;
    weight=1;
    height=1;
    age=1;
}

mammal::mammal(int W, int H, int A)
{
    cout << "Executing mammal's value constructor" << endl;
    weight=W;
    height=H;
    age = A;
} 

mammal::mammal(const mammal& other)
{
    cout << "Executing mammal's copy constructor" << endl;

    weight = other.weight;
    height = other.height;
    age = other.age;
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
    return weight;
}

int mammal::returnHeight() const
{
    return height;
}

void mammal::speak()const
{
    cout <<"WaaWa  WaaWa" << endl;
}

// one mammal is considered < then the other one if 
// it is lighter 
bool mammal::operator < (const mammal& rhs) const
{
    return (weight < rhs.weight);
}

// two mammals are considered equal if they have the same
// height and weight
bool mammal::operator == (const mammal& rhs) const
{
    return ((height==rhs.height)&&(weight == rhs.weight));
}

// note: there is no scope resolution operator here
ostream & operator << (ostream & os, const mammal & rhs)
{
    os << "The height is " << rhs.height << endl;
    os << "weight is " << rhs.weight << endl;

    return os;
}

// note: there is no scope resolution operator here
istream & operator >> (istream & is, mammal & rhs)
{
    cout << "Please enter the height: ";
    is >> rhs.height;

    cout << "Please enter the weight: ";
    is >> rhs.weight;

    return is;
}
