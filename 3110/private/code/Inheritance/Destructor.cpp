/*
 * This example shows why destructors should be declared virtual.
 * Also please pay attentation to the sequence of constructor calls.
 */

#include <iostream>

using namespace std;

// Animal is a base class
class Animal
{
public:
	// constructor
	Animal()
	{
		cout << "Animal constructor executing." << endl;
	}

	
	//~Animal()
	virtual ~Animal()
	{
		cout << "Animal destructor executing." << endl;
	}
};


class Dog : public Animal
{
public:
	// constructor
	Dog()
	{
		cout << "Dog constructor executing." << endl;
	}

	~Dog()
	{
		cout << "Dog destructor executing." << endl;
	}
};

int main()
{
	//create a Dog object, referenced by an Animal pointer
	Animal *pet = new Dog;

	// delete the dog object
	delete pet;
	return 0;
}
