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
    ~mammal();

    // member functions
    void setWeight(int w);
    void setHeight(int h);
    int returnWeight() const;
    int returnHeight() const;

    void speak() const;

    // overloaded relational operators
    // A mammal is considered < then the other one if  it is lighter
    bool operator < (const mammal& rhs) const;

    // Two mammals are considered equal if they have the same height and weight
    bool operator == (const mammal& rhs) const;

    // overload the input/output operators
    friend ostream & operator << (ostream & os, const mammal & rhs);
    friend istream & operator >> (istream & is, mammal & rhs);

private:
    int weight;
    int height;
    int age;
};
#endif
