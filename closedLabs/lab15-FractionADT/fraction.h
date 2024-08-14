#ifndef FRACTION_H
#define FRACTION_H

// Header file fraction.h declares class Fraction.
class Fraction
// Class Fraction represents the numerator and
// denominator of a fraction.
{
public:
  
  // Constructors

  // default constructor
  // Post: Numerator and denominator have been set to zero
  Fraction();

  // copy constructor
  // Post: Numerator has been set to the Numerator of the right-hand-side object
  //       denominator has been set to the Denominator of the right-hand-side object
  Fraction(const Fraction& rhs);

  // accessors
  int GetNumerator() const;

  int GetDenominator() const;

  // mutators
  void SetNumerator(int num);

  void SetDenominator(int denom);

  // Define the "Display" method
  // Display the fraction in the format :  numerator/denominator

  // Define the "Read" method
  // Prompt user to enter the values for the numerator and the denominator

  // Define the method that adds two fraction. This function returns the resulting fraction object
  // Post: A fraction corresponding to "self object + rhs object" is returned.
  Fraction Add(const Fraction & rhs);

  // Define the method "LessThan". 
  // Post: whether the self fraction is less than the rhs fraction is returned
  bool LessThan(const Fraction & rhs) const;

  
  // Define the overloaded > operator
  // The method returns the boolean value corresponding to whether the first fraction is greater than the second fraction object


  // Define the overloaded != operator
  // The method returns the boolean value corresponding to whether the first fraction is equal to the second fraction object

  

private:
  int numerator;
  int denominator;
};

#endif
