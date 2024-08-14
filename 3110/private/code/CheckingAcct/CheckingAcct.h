/*
* This example includes two files: CheckingAcct.h and CheckingAcct.cpp.
* This example is used to present how to define and implement a class.
* It also demonstrates the usage of static member data, static
* member functions, and function overloading.
*/


#ifndef CHECKING_H
#define CHECKING_H

#include <string>
#include <iostream>

using namespace std;

class A {
public:
	A() {
		cout << "class A constructor" << endl;
	}
};

class CheckingAcct
{
public:
	//multiple constructors can be defined as long as they have different parameters
	CheckingAcct(string name, long acctNO, double balance, double mbalance);
	
	//default constructor: the one doesn't take any parameter
	CheckingAcct();

	//another constructor
	CheckingAcct(string name);

	//copy constructor syntax:
	//The paramter must be a reference to an object of the same class
	CheckingAcct(const CheckingAcct& rhs);
	
	//move constructor: introduced in C++ 11.
	/*constructor with only one parameter can be used as type conversion function
	For example, if the following constructor is defined:
	CheckingAcct(int);
	When an integer is provided although a CheckingAcct object is expected, such interger 
	will be converted to a CheckingAcct object using the above constructor.
	For example: 
		CheckingAcct	boa;
		boa = 12;		//12 will be converted to CheckingAcct object
	
	To diable such behavior, use explicit key word like the following:
	explicit CheckingAcct(int);
	*/

  	// overloaded assignment operator
  	CheckingAcct & operator = (CheckingAcct & rhs);
	//Destructor: 
	~CheckingAcct();

	//member functions

	//accessor or getters
	//You are not allowed to change value of any member data or invoke 
	//any non-constant member function in a constant member function
	string	getName() const;
	long	getAcctNO() const;
	double	getBalance() const;

	//setters or mutators
	void setName(string newName);
	double withdraw(double amount);
	double deposit(double amount);

	//static member functions
	static long getNextAvlAcctNO(void);
	static CheckingAcct createAcct(string name,	double balance, double mbalance);


private:
	//All non-static member data can be initialized when it is declared

	//instance variables: every object has its own copy
	string		m_name = "unknown";
	long		  m_acctNO = 5656767;
	double		m_balance = 123.79;

	//instance constant variable: each object has its own copy. Such copy 
	//is initialized in initializer list and is treated as constant
	const	double	MinBalance = 100;	//minimum balance requirement
										//Different type of checking account may have
										//different minimum balance requirement

	//class variables: all objects share the same copy
	static long m_nextAvlAcctNO;
	//A			a;

};

#endif
