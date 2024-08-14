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
      Rectangle();   // Default constructor
      Rectangle(double, double);   // Value Constructor

      void setWidth(double);
      void setLength(double);
      
      double getWidth() const
         { return width; }

      double getLength() const
         { return length; }

      double getArea() const
         { return width * length; }

      bool Lessthan(const Rectangle &oneHouse);

      bool operator < (const Rectangle &oneHouse);

      //bool Equal(const Rectangle &oneHouse);
      //bool Greaterthan(const Rectangle &oneHouse);

      ~Rectangle();
};
#endif
