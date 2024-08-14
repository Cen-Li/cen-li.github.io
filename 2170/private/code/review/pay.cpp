#include <iostream>
using namespace std;

int main()
{
	float payRate;
	int   hoursWorked;
	float pay;
	
	// Prompt for input
	cout << "Enter the pay rate: $";
	cin >> payRate;
	
	cout << "Enter the number of hours worked: ";
	cin >> hoursWorked;
	
	// Compute the pay
	if(hoursWorked>40)
		pay=(payRate*40)+(1.5*payRate)*(hoursWorked-40);
	else
		pay=hoursWorked*payRate;
	
	// Display output
	cout << "You worked " << hoursWorked << " hours, at $" << payRate << " per hour." << endl;
	cout << "The pay is $" << pay << endl;
	
	return 0;
}