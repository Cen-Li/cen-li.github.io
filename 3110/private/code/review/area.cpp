#include <iostream>
using namespace std;

const float PI=3.1415926;

int main()
{
	float radius;
	float area, circumference;
	
	// 1. promt the user to enter the radius
	cout << "Please enter the radius:";
	cin >> radius;
	
	// 2. compute area
	area = PI * radius;
	
	// 3. compute circumference
	circumference = 2 * PI * radius;
	
	// 4. output results
	cout << "The radius is " << radius << endl;
	cout << "The area is " << area << endl;
	cout << "The circumference is " << circumference << endl;
	
	return 0;
}