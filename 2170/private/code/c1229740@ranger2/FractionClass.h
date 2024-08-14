
//take care of multiple inclusions
#ifndef FRACTION_CLASS_H
#define FRACTION_CLASS_H

#include <iostream>
using namespace std;

class FractionClass
{
public:
	//The default constructor sets the fraction to 0.
	FractionClass();  

	//This constructor receives the numerator and denominator of a fraction
	//and sets the corresponding data members to these values.
	FractionClass(int numerator, int denominator);

        // Assigns values to fraction object data
	void SetValues(int numerator, int denominator);

	//This is the overloaded output operator.  It is not a member of
	//the class.  It is a friend of the class.
	friend ostream& operator << (ostream &ostr, const FractionClass &f)
	{
		ostr << f.numer << "/" << f.denom;
		return ostr;
	}

	//The overloaded prefix operator adds one to the fraction and
	//then returns the object.
	FractionClass& operator++ ();      

	//The overloaded postfix operator makes a copy of the object, 
	//activates the prefix operator, and then returns the copy.
	//
	//The argument i is just a dummy argument used to tell the difference
	//between the two operators.
	FractionClass operator++ (int i);  
private:
	int numer,   //the numerator of the fraction 
	    denom;   //the denominator of the fraction
};
#endif
