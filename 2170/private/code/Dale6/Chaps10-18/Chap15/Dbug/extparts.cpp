// Implementation file for ExtParts.

#include "extParts.h"
#include <iostream>
using namespace std;

long  ExtParts::NumInStockIs() const
{
  return  inStock;
}

void  ExtParts::Print() const
{
  Parts::Print();
  cout  << "Number in stock: "  << inStock  << endl;
}

ExtParts::ExtParts
  (long  numParts, long  newId, float newPrice)
  : Parts(newId, newPrice)
{
  inStock  = numParts;
}

ExtParts::ExtParts()
{
  inStock = 0;
}

void ExtParts::Initialize(long  numParts, long  newId,  float  newPrice)
{
  inStock = numParts;
  Parts::Initialize(newId, newPrice);
}


