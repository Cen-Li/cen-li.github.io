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

Money Money::Add(Money value) const
// Pre:  Both operands have been initialized.
// Post: value + self are returned.
{
  Money  result;
  result.cents = cents + value.cents;
  result.dollars = dollars + value.dollars;
    return result;
}

//********************************************************

void Money::Print() const
{
  cout  << dollars  << '.'  << cents;
}

