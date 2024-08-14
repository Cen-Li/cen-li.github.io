// Program Money manipulates instances of class Money.
#include <iostream>
using namespace std;

class Money 
{
public:
  void Initialize(long dollars, long cents);
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

// Everything up to this point should be in the .h file
//**********************************************************

int main ()
{
  Money  money1;
  Money  money2;
  Money  money3;
  money1.Initialize(10, 59);
  money2.Initialize(20, 70);
  money3 = money1.Add(money2);
  cout << "$" << money3.GetDollars() << "."  
       << money3.GetCents() << endl;
  return 0;
}

// Everything below this point should be in the .cpp file
//********************************************************

void  Money::Initialize(long newDollars, long newCents)
{
  dollars = newDollars;
  cents = newCents;
}

//********************************************************
long  Money::GetDollars() const
{
  return dollars;
}

//********************************************************

long  Money::GetCents() const
{
  return cents;
}

//********************************************************

Money Money::Add(Money  otherMoney) const
{
  Money  result;
  result.cents = cents + otherMoney.cents;
  result.dollars = dollars + otherMoney.dollars;
  return result;
}

