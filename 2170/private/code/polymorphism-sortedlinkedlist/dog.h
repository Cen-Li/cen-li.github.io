#include "mammal.h"

#ifndef DOG_H
#define DOG_H

enum BREED {LAB, COLLIE, DACHOUND, COCKER, PUG, POODLE, TERRIER};

class dog : public mammal
{
    public:
        dog();
        dog(int W, int H, int A, BREED  B);
        dog(const dog&other);
        ~dog();

        void printBreed() const;
        BREED returnBreed() const;
        virtual void speak() const;
        virtual void print() const;

        // need to redefine overloaded operators for derived class
        dog & operator = (const dog& rhs);

        // need to redefine friend functions for derived class
        friend ostream & operator << (ostream & os, const dog& rhs);
        friend istream & operator >> (istream & is, dog & rhs);

    protected:
        BREED itsBreed;
};
#endif
