#include "CheckingAcct.h"

int main()
{
	CheckingAcct	john("John", 1234, 3456.43, 1000);
	cout << "Jason's checking account: "
		<< john.getAcctNO()
		<< " : " << john.getBalance()	<< endl << endl;

	CheckingAcct	david("David");
	cout << "David's checking account: "
		<< david.getAcctNO()
		<< " : " << david.getBalance()<< endl << endl;

  david.withdraw(20);  // david's  m_balance has been changed
   
  // copy constructor is activated 
	CheckingAcct	newCustomer1 = david;
	cout << newCustomer1.getName()<< "'s checking account: "
		<< newCustomer1.getAcctNO() << " : " << newCustomer1.getBalance() << endl<<endl;

  // overloaded assignment operator is activated
  david = john;
  
  //static member function (and data) must be accessed through class name
  cout << endl << "Jason " << endl;
  CheckingAcct Jason = CheckingAcct::createAcct("Jason", 456.34, 100); 
  // what account number is used for this customer?
  cout << endl;
  
	CheckingAcct	newCustomer2 = CheckingAcct::createAcct("Joe", 23436.34, 5654);
  // what account number is used for this customer?
	cout << newCustomer2.getName()<< "'s checking account: "
		<< newCustomer2.getAcctNO()<< " : " << newCustomer2.getBalance() << endl;

  // Access the static data member
  cout << endl;
  cout << "The next available account number is: " << endl;
  cout << CheckingAcct::getNextAvlAcctNO() << endl;
}