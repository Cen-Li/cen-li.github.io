/* This example contains only current file.
 * This file show the calling sequence of constructors
 * and destructors when a derived class has member
 * object.
 *	Result:
 *		Calling sequence of constructors
 *			1. parent's constructor
 *			2. member data's constructor
 *			3. its own constructor
 *		calling sequence of destructors
 *			(Thumb rule: it is always the reverse order
 *						 of constructor calls.
 *			1. its own destructor
 *			2. member data's destructor
 *			3. parent's destructor
 */

#include <iostream>

using namespace std;

class Component1
{
public:
	Component1() 	{
		cout << "Component1 Constructor" << endl;
	}

	~Component1() 	{
		cout << "Component1 destructor" << endl;
	}
};


class Component2
{
public:
	Component2() 	{
		cout << "Component2 Constructor" << endl;
	}

	~Component2() 	{
		cout << "Component2 destructor" << endl;
	}
};

class Parent
{
public:
	Parent()	: m_com() 	{
		cout << "Parent Constructor" << endl;
//		m_com = Component1();
	}

	Parent ( int x ) 	{
		cout << "Parent non-Constructor" << endl;
	}


	~Parent() 	{
		cout << "Parent destructor" << endl;
	}
private:
	Component1	m_com;
};

class Child : public Parent
{
public:
	Child() //	: Parent(4)
	{
		cout << "Child Constructor" << endl;
	}

	~Child()
	{
		cout << "Child destructor" << endl;
	}
private:
	Component2	m_comp;
};

int main( )
{
	Child	temp;

	cout << "___________________________" << endl << endl;

	return 0;
}
