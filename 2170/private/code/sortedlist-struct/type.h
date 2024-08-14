#ifndef Type_H
#define Type_H

#include <iostream>
using namespace std;

struct ComplexStruct
{
   float real;
   float imaginary;

   bool operator < (const ComplexStruct & rhs) const;
   bool operator == (const ComplexStruct & rhs) const;
};

ostream & operator << (ostream & os, const ComplexStruct & rhs);
#endif
