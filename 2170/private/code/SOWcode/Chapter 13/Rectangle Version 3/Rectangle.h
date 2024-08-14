// Specification file for the Rectangle class
// This version has a constructor.
#ifndef RECTANGLE_H
#define RECTANGLE_H

class Rectangle
{
   private:
      double width;
      double length;
   public:
      Rectangle();              // default Constructor
      Rectangle(double w, double l); // value constructor
      Rectangle(const Rectangle &r);  // copy constructor

      void setWidth(double);
      void setLength(double);
      
      double getWidth() const
         { return width; }

      double getLength() const
         { return length; }

      double getArea() const
         { return width * length; }

      bool IsSmallerThan(const Rectangle & rhs);

      ~Rectangle();   // Destructor
};
#endif
