#include <iostream>
#include <string>
#include <typeinfo>

/* This is an example file to show how the function template works in C++*/

using namespace std;

/*
 * The following is a function template, which gets the largest value.
 * T is declared as a type parameter,
 */
template <typename T>
T largest(T first, T second, T third)
{
	if ( first < second )
		return (second>third)?second : third;
	else
		return (first>third)?first : third;
}

/*
 * The following is a function template, which prints a two dimensional array.
 * T is declared as a type parameter,
 * COL is a value, which will be treated as a constant within the function.
 */
template <typename T, int COL>
void print( T val[][COL], int row )
{
	for (int i=0; i<row; i++)
	{
		for(int j=0; j<COL; j++)
			cout << val[i][j] << " ";
		cout << endl;
	}
}

/*
 * The following is a function template.
 * T is declared as a type parameter,
 * To call this function, the value for type parameter must be provided
 * since T is not used in the function parameters and compiler has no clue
 * which type should be used.
 */

template <typename T>
void donothing()
{
	/* typeid().name() is defined in the header file typeinfo. 
	   It is compiler implementation dependent.
	*/
	cout << "The type of the type parameter T is " << typeid(T).name() << endl;
}

int main()
{
	cout << "The largest one of 10, 20, and 30 is " << largest<int>(10, 20, 30) << endl;

	//The following line is also ok. If the value to the type parameter is omitted,
	//the compiler will choose an appropriate one from the passing parameters
	cout << "The largest one of 10, 20, and 30 is " << largest(10, 20, 30) << endl;


	cout << "The largest one of 10.5, 20.1, and 30.8 is " << largest<double>(10.5, 20.1, 30.8) << endl;
	cout << "The largest one of 10.5, 20.1, and 30.8 is " << largest(10.5, 20.1, 30.8) << endl;

	/******************************************************************/

	int scores1[2][3] = {10, 20, 30, 40, 50, 60};
	int scores2[3][2] = {10, 20, 30, 40, 50, 60};
	string name[2][3] = {"first", "second", "third", "fourth", "fifth", "sixth"};

	print<int, 3>(scores1, 2);
	print<int, 2>(scores2, 3);
	print<string, 3>(name, 2);

	/******************************************************************/

	donothing<int>();		//ok
	donothing<string>();		//ok

	/*
	donothing();			// you get compiler error on this line.
	*/
	
	

	return 0;
}
