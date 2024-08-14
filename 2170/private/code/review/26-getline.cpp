//File: 26-getline.cc
//Purpose:  To read in a city and print out if it is a small city,
//		a medium sized city or a large city.
//		small 0 - 9,999
//		medium 10,000 - 99,999 
//		large >= 100,000 

#include <iostream>
#include <string>
using namespace std;

struct city
{
	string name;
	int population;
	string size;
};

int main()
{
	city mycity;
	char trash; //used for getting the line feed after the popsize

	cout << "input your city\n";
	getline(cin, mycity.name);
	cout << "input your city's population size\n";
	cin >> mycity.population;
	cin.get(trash);

	if(mycity.population < 10000)
		mycity.size = "small";
	else if(mycity.population >= 10000 && mycity.population < 100000)
		mycity.size = "medium";
	else
		mycity.size = "large";

	cout <<mycity.name << " is a " << mycity.size << " city with a populataion of " << mycity.population << endl;
	return 0;
}
