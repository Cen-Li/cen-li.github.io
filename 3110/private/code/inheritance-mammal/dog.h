// FILE: dog.h
// Author:  Cen Li
// This file is the header file for a Dog class.

#ifndef DOG_H
#define DOG_H
#include <string>
#include "mammal.h"
using namespace std;

// defines types of dogs
enum BREED { LAB, COLLIE, DACHOUND, COCKER };

class Dog : public Mammal {
public:
  // the default constructor
  Dog();

  // this constructor receives the dog's breed
  Dog(BREED B);

  // this constructor receives the dog's height, weight,
  // age, and breed.
  Dog(int H, int W, int A, BREED B);

  // this is the copy constructor
  Dog(const Dog &d);

  // this is the destructor
  ~Dog();

  // methods to print information about a Dog and
  // let the Dog speak.
  void printBreed() const; 
  void speak() const;  // redefines speak method

  // assignment operator overloaded for objects of two possible classes 
  Dog &operator=(Dog &d);
  Dog &operator=(Mammal &m);

  // overloaded << operator
  friend ostream &operator<<(ostream &os, const Dog &d) {
    d.printMammal();
    d.printBreed();
    return os;
  }

private:
  BREED itsBreed; // the breed of the dog
};
#endif
