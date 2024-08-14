// ***************************************************
// Header file Sphere.h for the class Sphere.
// ***************************************************
const double PI = 3.14159;
#ifndef SPHERE_H
#define SPHERE_H

class Sphere
{
public:
   Sphere();
   // Default constructor: Creates a sphere and
   // initializes its radius to a default value.
   // Postcondition: A sphere of radius 1 exists.

   Sphere(double initialRadius);
   // Constructor: Creates a sphere and initializes its radius.
   // Postcondition: A sphere of radius initialRadius exists.
   // initialRadius (IN) : The radius value assigned to an object when the object is created


   void setRadius(double newRadius);
   // Sets (alters) the radius of an existing sphere.
   // Postcondition: The sphere's radius is newRadius.
   // newRadius (IN): The new radius value to be assigned to the object

   double getRadius() const;
   // Determines a sphere's radius.
   // Postcondition: Returns the radius.

   double getDiameter() const;
   // Determines a sphere's diameter.
   // Postcondition: Returns the diameter.

   double getCircumference() const;
   // Precondition: PI is a named constant.
   // Postcondition: Returns the circumference.

   double getArea() const;
   // Determines a sphere's surface area.
   // Postcondition: Returns the surface area.

   double getVolume() const;
   // Determines a sphere's volume.
   // Postcondition: Returns the volume.

   void displayStatistics() const;
   // Displays statistics of a sphere.
   // Postcondition: Displays the radius, diameter, circumference, area, and volume.

   ~Sphere();
   // destructor

private:
   double theRadius; // the sphere's radius
}; // end class

#endif

// End of header file.
