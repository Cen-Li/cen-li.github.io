#ifndef Type_H
#define Type_H

struct ComplexStruct
{
   float real;
   float imaginary;

   bool operator < (const ComplexStruct & rhs) const;
   bool operator == (const ComplexStruct & rhs) const;
   
};

#endif
