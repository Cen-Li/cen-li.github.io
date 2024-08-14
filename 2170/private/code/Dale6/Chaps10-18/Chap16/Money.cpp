#include "money.h"
#include <iostream>
using namespace std;


//********************************************************

Money::Money()
// Default constructor.
{
  dollars = 0;
  cents   = 0;
}

//********************************************************

Money::Money(long newDollars, long newCents)
// Parameterized constructor;
{
  dollars = newDollars;
  cents = newCents;
}

//********************************************************


long  Money::GetDollars() const
// Post: Class member dollars is returned.
{
  return dollars;
}

//********************************************************

long  Money::GetCents() const
// Post: Class member cents is returned.
{
  return cents;
}

//********************************************************

Money Money::operator+(const Money& otherMoney) const
{
  Money  result;
  result.cents = cents + otherMoney.cents;
  result.dollars = dollars + otherMoney.dollars;
    return result;
}

//********************************************************

bool Money::operator<(const Money& otherMoney) const
{
  if (dollars < otherMoney.dollars)
    return true;
  if (cents < otherMoney.cents)
    return true;
  return false;
}
