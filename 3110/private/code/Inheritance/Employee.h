//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp
//This is the header file employee.h. 
//This is the interface for the class Employee.
//This is primarily intended to be used as a base class to derive
//classes for different kinds of employees.
#ifndef EMPLOYEE_H
#define EMPLOYEE_H

#include <string>

class Employee
{
public:
    Employee( );
    Employee(std::string theName, std::string theSsn);

    std::string getName( ) const;
    std::string getSsn( ) const;
    double getNetPay( ) const;
        
    void setName(std::string newName); 
    void setSsn(std::string newSsn);
    void setNetPay(double newNetPay);
    virtual void printCheck( ) const;

private:
    std::string m_name; 
    std::string m_ssn; 
    double m_netPay;
};

#endif //EMPLOYEE_H
