// INHERITANCE EXAMPLE
// FILE: mammal.h
// Author:  Cen Li
// This file is the header file for the Mammal class.

#include <iostream>
using namespace std;

#ifndef MAMMAL_H
#define MAMMAL_H

class Mammal {
public:
  // the default constructor
  Mammal();

  // A constructor that receives the mammal's
  // weight, height, and age
  Mammal(int W, int H, int A);

  // copy constructor
  Mammal(const Mammal &m);

  // the destructor
  ~Mammal();

  // accessor methods for weight, height, & age
  int getWeight() const; // important to set as const for object to be passed by
                         // const reference
  int getHeight() const;
  int getAge() const;

  // set methods for weight, height, & age
  void setWeight(int w);
  void setHeight(int h);
  void setAge(int a);

  // the mammal "speaks"
  // virtual void speak() const; // support dynamic binding
  void speak() const;

  // print a mammal
  void printMammal() const;

  // friend to output a mammal
  friend ostream &operator<<(ostream &os, const Mammal &m) {
    m.printMammal();
    return os;
  }

protected:
  int age;    // the mammal's age
  int weight; // the mammal's weight
  int height; // the mammal's height
};
#endif
