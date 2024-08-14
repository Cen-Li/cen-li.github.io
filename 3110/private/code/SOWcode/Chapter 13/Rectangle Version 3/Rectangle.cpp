// Implementation file for the Rectangle class.
// This version has a constructor.
#include "Rectangle.h"   // Needed for the Rectangle class
#include <iostream>      // Needed for cout
#include <cstdlib>       // Needed for the exit function
using namespace std;

//***********************************************************
// The constructor initializes width and length to 0.0.     *
//***********************************************************

Rectangle::Rectangle()
{
   width = 0.0;
   length = 0.0;
}

// define value constrctor
Rectangle::Rectangle(double w, double l)
{
   if (w>=0)
      width = w;
   else 
      width = 0.0;

   if (l>=0)
     length = l;
   else
     length = 0;
}

//define copy constructor 
Rectangle::Rectangle(const Rectangle & r)
{
   width = r.width;
   length = r.length;
}

//***********************************************************
// setWidth sets the value of the member variable width.    *
//***********************************************************

void Rectangle::setWidth(double w)
{
   if (w >= 0)
      width = w;
   else
   {
      cout << "Invalid width\n";
      exit(EXIT_FAILURE);
   }
}

//***********************************************************
// setLength sets the value of the member variable length.  *
//***********************************************************

void Rectangle::setLength(double len)
{
   if (len >= 0)
      length = len;
   else
   {
      cout << "Invalid length\n";
      exit(EXIT_FAILURE);
   }
}

bool Rectangle::IsSmallerThan(const Rectangle & rhs)
{
  if (getArea() < rhs.getArea())
     return true;
  else
     return false;
}


// define destructor
Rectangle::~Rectangle()
{
   cout << "An object left its scope " << endl;
}
