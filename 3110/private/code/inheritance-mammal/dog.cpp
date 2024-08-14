// FILE: dog.cpp
// Author:  Cen Li
// This file is the implementation file for the Dog class.

#include "dog.h"
#include "mammal.h"
#include <iostream>
#include <string>
using namespace std;

// This is the default constructor.  It explicitly activates
// the mammal's default constructor.
Dog::Dog() : Mammal() {
  cout << "Executing Dog() constructor\n";
  itsBreed = COLLIE;
}

// The Dog constructor explicitly activates the
// mammal constructor and sets the breed of the
// dog
Dog::Dog(BREED B) : Mammal(), itsBreed(B) {
  cout << "Executing Dog(int) constructor\n";
}

// This constructor receives the height (H), weight (W), and
// age (A) which is sent on the the base class.  The breed (B) is
// then set.
Dog::Dog(int H, int W, int A, BREED B) : Mammal(W, H, A), itsBreed(B) {
  cout << "Executing Dog(int,, int, BREED) constructor\n";
}

// This is the copy constructor
Dog::Dog(const Dog &d) : Mammal(d), itsBreed(d.itsBreed) {}

// This method allows a Dog to "speak".
void Dog::speak() const { cout << "BOW-WOW" << endl; }

Dog &Dog::operator=(Dog &d) {
  setHeight(d.getHeight());
  setWeight(d.getWeight());
  setAge(d.getAge());
  itsBreed = d.itsBreed;
  return *this;
}

Dog &Dog::operator=(Mammal &m) {
  setHeight(m.getHeight());
  setWeight(m.getWeight());
  setAge(m.getAge());
  itsBreed = LAB;
  return *this;
}



// This method prints the dog's breed.
void Dog::printBreed() const {
  cout << "The breed is ";
  switch (itsBreed) {
  case COLLIE:
    cout << "Collie\n";
    break;
  case DACHOUND:
    cout << "Dachound\n";
    break;
  case COCKER:
    cout << "Cocker\n";
    break;
  case LAB:
    cout << "Labrador Retriever\n";
  }
}

// This is the destructor for a Dog.
Dog::~Dog() { cout << "Executing Dog destructor\n"; }
