#include <iostream>
#include "Employee.h"
#include "HourlyEmployee.h"
#include "SalariedEmployee.h"

void showEmployeeData(const Employee object);

int main() {
	HourlyEmployee	joe("Mighty Joe", "111-11-1111", 20.50, 40);
	SalariedEmployee	boss("Mr. Big shot", "222-22-2222", 10500.50);
	
	showEmployeeData(joe);
	showEmployeeData(boss);
  
	return 0;
}
	
void showEmployeeData(const Employee object) {
	cout << "Name: " << object.getName() << endl;
	cout << "SSN: " << object.getSsn() << endl;
}
