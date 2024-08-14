#include <string>
class Money 
{
public:
  // Constructors
  Money();
  Money(long dollars, long cents);
  // Initializes dollars and cents
  
  // Knowledge responsibilities
  long GetDollars() const;
  // Returns dollars
  long GetCents() const;
  // Returns cents
  bool operator<(const Money& otherMoney) const;

  // Action responsibilities
 Money operator+(const Money&  value) const;
  // Returns result of adding self to otherMoney
private:
  long  dollars;
  long  cents;
};
