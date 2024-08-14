#include <iostream>
#include <fstream>
#include <string>

using namespace std;

/*
const int SPRING = 1;
const int SUMMER = 2;
const int FALL = 3;
const int WINTER = 4;

void TakeVacation(int season) {
	if (season == 1)
		cout << "do something" << endl;
	else if (season == 2)
		cout << "do something" << endl;
	else if (season == 3)
		cout << "do something" << endl;
	else if (season == 4)
		cout << "do something" << endl;
	else
		cout << "wrong data" << endl;

}

This solution has several major problem:
  1. what's the meaning of 1,2,3,and 4 in the program. It is unclear
     from the context, and hurts readability.
  2. When user call function TakeVacation, any value can be passed, like -1.
     In other words, there is no restriction on the function parameter.

The above problems can be solved using enumeration. 
*/

/*
enumeration:An enumeration is a distinct type whose value is restricted to 
			a range of values (see below for details), which may include several 
			explicitly named constants ("enumerators"). 
			
			The values of the constants are values of an integral type known as 
			the underlying type of the enumeration.
two different enumeration types:
	1. unscoped enumeration
			syntax: enum EnumTypeName { enumerator1, enumerator2, ... };
	2. scoped enumeration:
			syntax: enum class EnumTypeName { enumerator1, enumerator2, ... };
			class can be replaced by struct

*/
//unscoped enum
enum Season { SPRING, SUMMER, FALL, WINTER };

void TakeVacation(Season season) {
	if (season == SPRING)
		cout << "do something" << endl;
	else if (season == SUMMER)
		cout << "do something" << endl;
	else if (season == FALL)
		cout << "do something" << endl;
	else if (season == WINTER)
		cout << "do something" << endl;
	else
		cout << "wrong data" << endl;

}


//unscoped enum
enum class Color { RED, GREEN, BLUE };

void main() {
	//type conversion between enum and integral value
	Season	season1 = SPRING, season2 = FALL;
	int		score;

	season1 = FALL;  //correct
	season1 = season2; //correct
	season1 = 1;  //wrong: integral value cannot be converted to enum implicitly
	season1 = static_cast<Season>(1); //explicit type casting, ok

	season1 = score; //wrong: integral value cannot be converted to enum implicitly
	TakeVacation(1); //wrong: integral value cannot be converted to enum implicitly

	TakeVacation(SPRING); //correct
	TakeVacation(season1); //correct
	score = season1; //correct: season1 is convert to the integral value associated with it.
	score = season1 + 1; //correct: season1 is convert to the integral value for calculation


	
	//scoped enum has all advantages of unscoped enum, but with more strict
	//type checking
	Color	favorite;

	favorite = RED; //wrong: enumerator of a scoped enum must be accessed through the type
					//Treat enum type as a class and enumerators are constants defined within it.
	favorite = Color::RED; //correct

	favorite = 1; //wrong: just like unscoped enum, integer cannot be converted to enum

	//////////////////////////////////////////////////////////////
	//Major difference between unscoped and scoped enum
	//The following statements are ALL WRONG: 
	//	scoped enumerator cannot be converted to integer implicitly
	score = favorite; 
	score = Color::RED;

}
















