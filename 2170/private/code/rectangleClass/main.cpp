// This program calls the Rectangle class constructor.
#include <iostream>
#include <iomanip>
#include "Rectangle.h"
using namespace std;

void Display(const Rectangle & oneHouse);

int main()
{
   double houseWidth,   // To hold the room width
          houseLength;  // To hold the room length

   Rectangle firstHouse;  // object is created with default constructor

   firstHouse.setWidth(100.5);  // using the mutator methods to change the object's data
   firstHouse.setLength(20.3);

   // Get the width of the house.
   cout << "In feet, how wide is your house? ";
   cin >> houseWidth;

   // Get the length of the house.
   cout << "In feet, how long is your house? ";
   cin >> houseLength;
   
   // Create a Rectangle object.
   Rectangle house(houseWidth, houseLength ); // object created with value constructor

   // Display the two objects here
   cout << "First object:" << endl;
   Display(firstHouse);

   cout << "Second object:" << endl;
   Display(house);

   // Compare the two houses
   //if (firstHouse.Lessthan(house))
   if (house.Lessthan(firstHouse))
      cout << "First house is smaller" << endl;
   else 
      cout << "First house is bigger" << endl;
  
   return 0;
} 

void Display(const Rectangle & oneHouse)
{
   // Display the house's width, length, and area.
   cout << setprecision(2) << fixed;
   cout << "The house is " << oneHouse.getWidth()
        << " feet wide.\n";
   cout << "The house is " << oneHouse.getLength()
        << " feet long.\n";
   cout << "The house has " << oneHouse.getArea()
        << " square feet of area.\n";

   return;
}
