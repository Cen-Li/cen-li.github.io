#include "dog.h"
#include <iostream>
#include <string>
using namespace std;

dog::dog()
{
    //cout <<"Executing dog’s default constructor\n";
    itsBreed=COLLIE;
}

dog::dog(int W, int H, int A, BREED B) : mammal(W, H, A), itsBreed(B)
{
    //cout << "Executing dog\'s value constructor\n";
}

dog::dog(const dog & other) : mammal(other), itsBreed(other.itsBreed)
{
    //cout << "Executing dog\'s copy constructor\n";
}

dog::~dog()
{
    //cout <<"Executing dog destructor" << endl;
}

BREED dog::returnBreed() const
{
    return itsBreed;
}

void dog::printBreed() const
{
    static string breedNames[6]={"COLLIE", "DACHOUND", "COCKER", 
                           "LAB", "POODLE", "TERRIER"};

    cout <<"breed : ";
    cout << breedNames[itsBreed] << endl;
}

void dog::print() const
{
    mammal::print();
    printBreed();
}

void dog::speak()  const
{
    cout <<"BOW-WOo BoW-Woo" << endl;
}

dog & dog::operator = (const dog& rhs)
{
    if (this != &rhs)
    {
        weight = rhs.weight;
        height = rhs.height;
        age = rhs.age;
        itsBreed = rhs.itsBreed;
     }

     return *this;
}

ostream & operator << (ostream & os, const dog& rhs)
{
    static string breedNames[6]={"COLLIE", "DACHOUND", "COCKER", "LAB", "POODLE", "TERRIER"};

    os << "weight: " << rhs.weight<< endl;
    os << "height: " << rhs.height<< endl;
    os << "age:    " << rhs.age << endl;
    os << "breed : " << breedNames[rhs.itsBreed] << endl;

    return os;
}

istream & operator >> (istream & is, dog & rhs)
{
    string s;

    is >> rhs.weight >> rhs.height >> rhs.age;

    is >> s;
    switch (s[0])
    {
    case 'D': rhs.itsBreed = DACHOUND; break;
    case 'L': rhs.itsBreed = LAB; break;
    case 'T': rhs.itsBreed = TERRIER; break;
    case 'P': rhs.itsBreed = POODLE; break;
    case 'C': if (s == "COLLIE")   {
                    rhs.itsBreed = COLLIE; break;
              }
              else if (s == "COCKER") {
                    rhs.itsBreed = COCKER; break;
              }
    }

    return is;
}

