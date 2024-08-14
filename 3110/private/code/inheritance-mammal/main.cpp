// FILE: maindog.cpp
// Programmer: Cen Lis
// Due Date:
// Class:      3110
// The purpose of this client is to test the dog and mammal
// classes.

#include "dog.h"
#include "mammal.h"
#include <iostream>
using namespace std;

void LetThemSpeak(const Mammal& animal1, const Mammal & animal2);

int main() {
  // declare a dog and a mammal
  Mammal Animal1(30, 54, 2);
  Dog MyDog(30, 60, 3, LAB);

  cout << "MyDog's age is: " << MyDog.getAge() << endl;
  cout << "MyDog's height is: " << MyDog.getHeight() << endl;
  cout << "MyDog's weight is: " << MyDog.getWeight() << endl;
  MyDog.printBreed();

  // Let the Mammal speak -- static binding -- no pointers
  cout << "\nThe Animal says: \n";
  Animal1.speak();

  // Let the Dog speak -- static binding -- no pointers
  cout << "\nMy dog says:\n";
  MyDog.speak();

  
  //LetThemSpeak(Animal1, MyDog);

  /*
  Mammal* mamPtr = &Animal1;
  Mammal* dogPtr = &MyDog;
  //Static binding -- pointers
  cout << endl << "Using Mammal Pointer to speaks\n";
  mamPtr -> speak();
  cout << endl<< "Using dog Pointer to speak\n";
  dogPtr -> speak();
  */
  cout << endl;

  return 0;
}

// try changing speak method to virtual and observe the difference from this function
void LetThemSpeak(const Mammal& animal1, const Mammal & animal2)
{
  cout << "First animal says: ";
  animal1.speak();

  cout << "Second animal says: ";
  animal2.speak();
}