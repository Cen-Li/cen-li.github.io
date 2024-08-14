// Implementation file for the Rectangle class.
// This version has a constructor that accepts arguments.
#include "Rectangle.h"   // Needed for the Rectangle class
#include <iostream>      // Needed for cout
#include <cstdlib>       // Needed for the exit function
using namespace std;

// default constructor definition
Rectangle::Rectangle()
{
   width = 0.0;
   length = 0.0;
}

//***********************************************************
// The constructor accepts arguments for width and length.  *
//***********************************************************
Rectangle::Rectangle(double w, double len)
{
   width = w;
   length = len;
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

Rectangle::~Rectangle()
{
   cout << "object destroyed." << endl;
}


bool Rectangle::Lessthan(const Rectangle & oneHouse)
{
   //cout<< "left side object area :" << getArea() << endl;
   //cout<< "right side object area :" << oneHouse.getArea() << endl;
   return (getArea()< oneHouse.getArea());
}

bool Rectangle::operator < (const Rectangle & oneHouse)
{
   //cout<< "left side object area :" << getArea() << endl;
   //cout<< "right side object area :" << oneHouse.getArea() << endl;
   return (getArea()< oneHouse.getArea());
}







