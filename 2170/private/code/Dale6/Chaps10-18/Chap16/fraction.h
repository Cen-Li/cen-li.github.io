// Header file Fraction.h declares class Fraction.

class Fraction
{
public:
  Fraction  Add(Fraction  frac1) const;
  // Pre:  frac1 and self have been initialized.
  // Post: self + frac1 is returned.

  Fraction  Sub(Fraction  frac1) const;
  // Pre:  frac1 and self have been initialized.
  // Post: self - frac1 is returned.

  Fraction  Mult(Fraction  frac1) const;
  // Pre:  frac1 and self have been initialized.
  // Post: self * frac1 is returned.

  Fraction  Div(Fraction  frac1) const;
  // Pre:  frac1 and self have been initialized.
  // Post: self / frac1 is returned.

  int  NumIs() const;
  // Pre:  frac1 has been initialized.
  // Post: Numerator of frac1 is returned.

  int  DenomIs() const;
  // Pre:  frac1 has been initialized.
  // Post: Denominator of frac1 is returned.

  void  Set(int  num, int  denom);
  // Post:  self has been set to num / denom.

private:
  int  numerator;
  int  denominator;
};


