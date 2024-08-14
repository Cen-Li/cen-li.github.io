//*******************************************************

// Implementation file fraction.cpp implements the member 
// functions of class Fraction.

#include "fraction.h"
 
Fraction::Fraction()
{
    numerator = 0;
    denominator = 1;
}

// accessors 
int Fraction::GetNumerator( ) const
{
	return numerator;
}

int Fraction::GetDenominator( ) const
{
	return denominator;
}

// mutators
void Fraction::SetNumerator(int num)
{
	numerator = num;
}

void Fraction::SetDenominator(int denom)
{
	denominator = denom;
}

Fraction::Fraction(const Fraction & rhs)
{
  // FILL IN Code for copy constructor.
}

// define the method "Display" here
									// <-- write function heading here
{
  // FILL IN Code.
}    

// define the method "Read" here
									// <-- write function heading here
{
  // FILL IN Code.
}   

Fraction Fraction::Add(const Fraction &  rhs) 
{
  // FILL IN Code.
}

bool Fraction::LessThan(const Fraction &  rhs) const
{
  // FILL IN Code.
}    

// define the overloaded < operator
									// <-- write function heading here
{
  // FILL IN Code.
}    

// define the overloaded != operator
									// <-- write function heading here
{
  // FILL IN Code.
}    

