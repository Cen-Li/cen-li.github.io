#include "type.h"

// implement the overloaded operator 
bool ComplexStruct::operator < (const ComplexStruct & rhs) const
{
		return (real < rhs.real);
}

// implement the overloaded operator 
bool ComplexStruct::operator == (const ComplexStruct & rhs) const
{
		return (real == rhs.real && imaginary == rhs.imaginary);

}

ostream & operator << (ostream & os, const ComplexStruct & rhs)
{
		os << "Real = " << rhs.real << "   , Imaginary = " << rhs.imaginary << endl;
		return os;
}
