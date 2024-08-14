// Header file fraction.h declares class Fraction.
class Fraction
// Class Fraction represents the numerator and
// denominator of a fraction.
{
public:
  
  // Constructors
  Fraction();
  // Post: Numerator and denominator have been set to zero
  Fraction(initNumerator, initDenominator);
  // Post: Numerator has been set to initNumerator;
  //       denominator has been set to initDenominator. 
  Fraction Add(Fraction frac1) const;
  // Post: self + frac1 is returned.
  Fraction Subtract(Fraction frac1) const;
  // Post: self - frac1 is returned.
  Fraction Multply(Fraction frac1) const;
  // Post: self * frac1 is returned.
  Fraction Divide(Fraction  frac1) const;
  // Post: self / frac1 is returned.
  int GetNumerator() const;
  // Post: Numerator of frac1 is returned.
  int GetDenominator() const;
  // Post: Denominator of frac1 is returned.

private:
  int numerator;
  int denominator;
};


