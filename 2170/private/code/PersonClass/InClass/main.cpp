#include "personClass.h"
#include <iostream>
using namespace std;

int main()
{
    personClass p1;
	personClass p2("Jack", 20, 150, 3.5);
	
	p1.UpdateAll("Mary", 21, 100, 3.6);
	
	if (p1.GetAge() > p2.GetAge())
		cout << "P1 is older" << endl;
	else
		cout << "Something is wrong" << endl;
	
	p1.Display();
	
	p2.Display();
	
	if (p1 == p2)
		cout << "Wrong answer" << endl;
	else
		cout << "not the same person" << endl;
	
	personClass p3(p2);
	p3.UpdateName("Bob");
	p3.Display();
	
    return 0;
}
