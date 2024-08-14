// FILE: mammal.cpp
// This is the implementation file for the Mammal class.

#include "mammal.h"
#include <iostream>
using namespace std;

// This is the default constructor.  It sets all
// the data members to zero and announces that
// it was called.
Mammal::Mammal() : age(0), weight(0), height(0) {
  cout << "Mammal's default constructor\n";
}

// This is a constructor that receives the weight(W),
// the height (H), and the age(A) of the animal.
Mammal::Mammal(int W, int H, int A) {
  setWeight(W);
  setHeight(H);
  setAge(A);
  cout << "Executing mammal's int constructor\n";
}

// This is the copy constructor
Mammal::Mammal(const Mammal & m) {
  setWeight(m.getWeight());
  setHeight(m.getHeight());
  setAge(m.getAge());
  cout << "Executing mammal's copy constructor\n";
}

// This is the destructor.  There is no dynamically allocated
// storage so it does nothing but announce that it was activated.
Mammal::~Mammal() { cout << "Executing mammal's destructor\n"; }

// These are the accessor methods for the weight, height, and age.
int Mammal::getWeight() const { return weight; }
int Mammal::getHeight() const { return height; }
int Mammal::getAge() const { return age; }

// These functions allow the user to set the values
// of a mammal's weight, height, and age.
void Mammal::setHeight(int h) { height = h >= 0 ? h : 0; }

void Mammal::setWeight(int w) { weight = w >= 0 ? w : 0; }

void Mammal::setAge(int a) { age = a >= 0 ? a : 0; }

// This function allows a mammal to "speak".
void Mammal::speak() const { cout << "Mammal is speaking\n"; }
