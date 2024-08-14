// File Money.h is the specification file for class Money.
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

  // Action responsibilities
  Money Add(Money otherMoney) const;
  // Returns result of adding self to otherMoney
private:
  long  dollars;
  long  cents;
};


