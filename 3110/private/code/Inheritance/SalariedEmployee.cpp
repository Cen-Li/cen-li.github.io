//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the file salariedemployee.cpp 
//This is the implementation for the class SalariedEmployee.
//The interface for the class SalariedEmployee is in 
//the header file salariedemployee.h.
#include <iostream>
#include <string>
#include "SalariedEmployee.h"
using std::string;
using std::cout;
using std::endl;

SalariedEmployee::SalariedEmployee( ) : Employee( ), m_salary(0)
{
	cout << "SalariedEmployee default constructor executing" << endl;
}

SalariedEmployee::SalariedEmployee(string newName, string newNumber,
                                  double newWeeklyPay)
    : Employee(newName, newNumber), m_salary(newWeeklyPay)
{
	cout << "SalariedEmployee non-default constructor executing" << endl;
}

double SalariedEmployee::getSalary( ) const 
{
	return m_salary;
}

void SalariedEmployee::setSalary(double newSalary)
{
	m_salary = newSalary;
}

void SalariedEmployee::printCheck( ) const
{
    cout << "\n__________________________________________________\n";
    cout << "Pay to the order of " << getName( ) << endl;
    cout << "The sum of " << getNetPay( ) << " Dollars\n";
    cout << "_________________________________________________\n";
    cout << "Check Stub NOT NEGOTIABLE \n";
    cout << "Employee Number: " << getSsn( ) << endl;
    cout << "Salaried Employee. Regular Pay: " 
         << m_salary << endl; 
    cout << "_________________________________________________\n";
}

void showEmployeeData(const Employee object);

#include "HourlyEmployee.h"

int main()
{
	HourlyEmployee	joe("Mighty Joe", "111-11-1111", 20.50, 40);
	SalariedEmployee	boss("Mr. Big shot", "222-22-2222", 10500.50);
	
	showEmployeeData(joe);
	showEmployeeData(boss);
	system("pause");
	return 0;
}
	
void showEmployeeData(const Employee object)
{
	cout << "Name: " << object.getName() << endl;
	cout << "SSN: " << object.getSsn() << endl;
}

