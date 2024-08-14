// mammal.h
// Notice: use Protected data 

#include <iostream>
using namespace std;

#ifndef MAM_H
#define MAM_H

class mammal
{
public:
    // constructors and destructor
    mammal();
    mammal (int W, int H, int A);
    mammal (const mammal & other);
    virtual ~mammal();

    // member functions
    void setWeight(int w);
    void setHeight(int h);
    int returnWeight() const;
    int returnHeight() const;

    // force dynamic binding for classes derived this class
    virtual void print() const;
    virtual void speak() const;

    // overloaded relational operators
    // A mammal is considered < then the other one if  it is lighter
    bool operator < (const mammal& rhs) const;
    mammal & operator = (const mammal & rhs);

    // Two mammals are considered equal if they have the same height and weight
    bool operator == (const mammal& rhs) const;

    // overload the input/output operators
    friend ostream & operator << (ostream & os, const mammal & rhs);
    friend istream & operator >> (istream & is, mammal & rhs);

protected:
    int weight;
    int height;
    int age;
};
#endif
