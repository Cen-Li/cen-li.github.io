#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
using namespace std;

const int ARRAY_SIZE=50;
void DisplayNames(const string names[], int count);
int ReadNames(ifstream & myIn, string names[]);
void CheckName(const string names[], int count);
int LinearSearch(const string names[], int count, string oneName);

int main()
{
    string names[ARRAY_SIZE]; // store popular babynames
	ifstream myIn;
	int count;
	string oneName;
	
	// open data file for read names
	myIn.open("../names.dat");
	assert(myIn);
	
	count = ReadNames(myIn, names);
	
	DisplayNames(names, count);
	
	CheckName (names, count);
		
	myIn.close();
	
    return 0;
}

void CheckName(const string names[], int count)
{
	string oneName="start";
	int position;
	
	while (oneName != "")
	{
		// prompt for a name
		cout << "Enter a name: ";
		cin >> oneName;
		
		position=LinearSearch(names, count, oneName);

		if (position >= 0)
			cout << "name is popular with ranking " << position+1 << endl;
		else
			cout << "Name is not popular" << endl;
	}
}

// 
int LinearSearch(const string names[], int count, string oneName)
{
	// Check if the name is popular
	for (int i=0; i<count; i++)
	{
		if (oneName == names[i])
		{
			return i;
		}
	}
	
	return -1;
}
// 
int ReadNames(ifstream & myIn, string names[])
{
	int count;
	string oneName;
	
	// read the names from file and store in the array
	count=0;
	while (count < ARRAY_SIZE && myIn >> oneName)
	{
		names[count] = oneName;
		count++;
	}
	return count;
}	
	
void DisplayNames(const string names[], int count)
{
	// print all the names
	for (int i=0; i<count; i++)
	{
		cout << i+1 << " : " << names[i] << endl;
	}
}

