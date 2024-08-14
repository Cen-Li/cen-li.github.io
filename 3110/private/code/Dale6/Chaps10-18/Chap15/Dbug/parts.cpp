// Implementation file for class Parts.

#include "Parts.h"
#include <iostream>
using namespace std;


long Parts::IdNumIs() const
{
  return  idNum;
}

float  Parts::PriceIs() const
{
  return  price;
}

void  Parts::Print() const
{
  cout  << fixed  << showpoint;

  cout  << "Id Num: "  << idNum  << endl;
  cout  << "Price: "  << price  << endl;
}

void  Parts::Initialize(long  newId,  float  newPrice)
{
  idNum = newId;
  price = newPrice;
}

Parts::Parts()
{
  idNum = 0;
  price = 0.0;
}

Parts::Parts(long  newId, float  newPrice)
{
  idNum = newId;
  price = newPrice;
}

