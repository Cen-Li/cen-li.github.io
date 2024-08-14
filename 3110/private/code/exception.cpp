/* This files demonstrate the usage of exceptions */
/* Function calling sequence: 
 * main --> catchStringException --> catchIntException --> throwExceptionFunc
 */

#include <iostream>
#include <string>
#include <stdexcept>

using namespace std;

class MyException
{
}; // Userdefined Exception

void throwExceptionFunc( int num )
{
	cout << "\t\t\t throwExceptionFunc: Enter" << endl;
	if ( num == 1 )
		throw num;
	else if ( num == 2 )
		throw string("Exception: the parameter cannot be 2");
	else if ( num == 3 )
		throw runtime_error("Exception: runtime error");
	else if ( num == 4 )
		throw MyException(); // throw an user defined exception.
							 // The parenthesis is necessary
	cout << "\t\t\t throwException: Exit" << endl;
	return;
}

void catchIntException( int num )
{
	cout << "\t\tcatchIntException: Enter" << endl;
	try {
		cout << "\t\tcatchIntException: before calling throwExceptionFunc" << endl;
		throwExceptionFunc( num );
		cout << "\t\tcatchIntException: after calling throwExceptionFunc" << endl;
	} catch ( int x ) {
		cout << "\t\tcatchIntException: int exception handler  --- x = " << x << endl;
	}
	cout << "\t\tcatchIntException: Exit" << endl;
	return;
}

void catchStringException( int num )
{
	cout << "\tcatchStringException : Enter " << endl;
	try {
		cout << "\tcatchStringException: before calling catchIntException" << endl;
		catchIntException( num );
		cout << "\tcatchStringException: after calling catchIntException" << endl;
	} catch ( string x ) {
		cout << "\tcatchStringException: string exception handler  --- " << x << endl;
	}
	cout << "\tcatchStringException: Exit" << endl;
	return;
}

int main( int argc, char** argv )
{
	int		param;
	
	if ( argc == 2 )
		param = atoi(argv[1]);
	else
	{
		cout << "Usage: exception int" << endl;
		return -1;
	}
	
	cout << "main: Enter" << endl;
	try {
		cout << "main: before calling catchStringException" << endl;
		catchStringException( param );
		cout << "main: after calling catchStringException" << endl;
	} catch ( int x ) {
		cout << "main: an int exception is caught" << endl;
	} catch ( string x ) {
		cout << "main: an string exception is caught" << endl;
	} catch ( MyException x ) {
		cout << "main: an MyException exception is caught" << endl;
	} catch ( runtime_error x ) {
		cout << "main: an runtime exception is caught:" << x.what() << endl;
	} catch ( ... ) { // an ellipses (three dots) match any exception type
		cout << "main: an exception is caught" << endl;
	}
	cout << "main: Exit" << endl;
	return 0;
}


