#include "mammal.h"
#ifndef DOG_H
#define DOG_H

enum BREED {LAB, COLLIE, DACHOUND, COCKER, PUG, POODLE, TERRIER};

class dog : public mammal
{
    public:
        dog();
        dog(int H, int W, int A, BREED  B);
        dog(const dog&other);
        
        ~dog();
        void printBreed() const;
        void speak()const;
    private:
        BREED itsBreed;
};
#endif
