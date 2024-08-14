#include <cstdlib>
#include <iostream>
#include <iomanip>

using namespace std;

class Parent
{
public:	
	Parent()
	{
	}

	virtual void func( int x = 10 )
	{
		cout << "Parent: ";
		cout << x << endl;
	}
};

class Child : public Parent
{
public:
	Child()
	{
	}

	void func( int x = 20 ) override
	{
		cout << "Child: ";
		cout << x << endl;
	}
};

int main()
{
	Parent	*ptr = new Child;
	
	ptr->func();
	
	return 0;
}
