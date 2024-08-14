#include "dog.h"
#include <iostream>
using namespace std;

dog::dog()
{
    cout <<"Executing dog’s default constructor\n";
    itsBreed=COLLIE;
}

dog::dog(int W, int H, int A, BREED B) : mammal(W, H, A), itsBreed(B)
{
    cout << "Executing dog\'s value constructor\n";
}

dog::dog(const dog & other) : mammal(other), itsBreed(other.itsBreed)
{
    cout << "Executing dog\'s copy constructor\n";
}

dog::~dog()
{
    cout <<"Executing dog destructor\n";
}

void dog::printBreed() const
{
    cout <<"The breed is " ;
    switch (itsBreed)
    {
    case COLLIE: cout <<"COLLIE\n"; break;
    case DACHOUND: cout <<"Dachound\n"; break;
    case COCKER:  cout <<"COCKER\n"; break;
    case LAB:   cout <<"LABRADOR RETRIEVER\n";  break;
    case POODLE:   cout <<"POODLE\n";  break;
    case TERRIER:   cout <<"TERRIER\n";  break;
    }
}

void dog::speak()  const
{
    cout <<"BOW-WOo BoW-Woo" << endl;
}
