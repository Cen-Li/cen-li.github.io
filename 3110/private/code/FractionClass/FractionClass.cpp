#include "FractionClass.h"

//The default constructor sets the fraction to 0.
FractionClass::FractionClass():numer(0), denom(1)
{}

//This constructor receives the numerator and denominator of a fraction
//and sets the corresponding data members to these values.
FractionClass::FractionClass(int numerator, int denominator): 
	numer(numerator), denom(denominator)
{}

void FractionClass::SetValues(int numerator, int denominator)
{
       numer=numerator;
       denom=denominator;
}

//The overloaded prefix operator adds one to the fraction and
//then returns the object.
FractionClass& FractionClass::operator++ ()     //prefix ++
{
	numer = numer + denom;
	return *this;
}

//The overloaded postfix operator makes a copy of the object, 
//activates the prefix operator, and then returns the copy.
//
//The argument i is just a dummy argument used to tell the difference
//between the two operators.
FractionClass FractionClass::operator++ (int)   //postfix ++
{
	FractionClass f1 = *this;                   //create a copy of the current object
	++(*this);                                  //call the prefix ++ on the current object
	return f1;                                  //return the copy before the ++
}
