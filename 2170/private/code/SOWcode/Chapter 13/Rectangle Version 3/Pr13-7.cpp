// This program uses the Rectangle class's constructor.
#include <iostream>
#include "Rectangle.h" // Needed for Rectangle class
using namespace std;

int main()
{
   Rectangle box(1.5, 2.5); // Define an instance of the Rectangle class
   
   // Display the rectangle's data.
   cout << "Here is the rectangle's data:\n";
   cout << "Width: " << box.getWidth() << endl;
   cout << "Length: " << box.getLength() << endl;
   cout << "Area: " << box.getArea() << endl;

   Rectangle newBox(box);
   newBox.setWidth ( newBox.getWidth() + 1);
   cout << "Here is the rectangle's data:\n";
   cout << "Width: " << newBox.getWidth() << endl;
   cout << "Length: " << newBox.getLength() << endl;
   cout << "Area: " << newBox.getArea() << endl;

   if (box.IsSmallerThan(newBox))
      cout << "box is smaller" << endl;
   else
      cout << "box is larger" << endl;
     
   return 0;
}
