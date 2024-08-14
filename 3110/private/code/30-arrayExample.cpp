// This is the code developed in class Oct 9th, 2018
#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
using namespace std;
void Display(string names[], int count);
void Sort(string names[], int count);
int LinearSearch(string names[], int count, string aName);
void Insert(string arr[], int &size, string aName);
void Delete(string arr[], int &size, int location);

const int SIZE = 100;

int main(int argc, char **argv)
{
	string names[SIZE];
	string oneName;
	ifstream myIn;
	int count;
	int index;
	
	myIn.open("../names.dat");
	assert(myIn);
	
	count=0;
	// read names and store in array
	while (getline(myIn, names[count]))
	{
		count ++;
	}
	
	Sort(names, count);
	
	Display(names, count);
	
	cout << "Position of name to delte: ";
	cin >> index;
	
	Delete(names, count, index-1);
	/*
	cout << "Enter the name to add: ";
	getline (cin, oneName);
	
	Insert(names, count, oneName);
	*/
	
	Display(names, count);
	/*
	cout << "Enter a name: ";
	getline (cin, oneName);
	index = LinearSearch(names, count, oneName);
	if (index >= 0)
		cout << "person found" << endl;
	else
		cout << "person not in the list" << endl;
	*/
	myIn.close();
    
    return 0;
}

void Delete(string arr[], int &size, int location)
{
	if (location >=0 && location < size)
	{
		for (int i=location; i<size-1; i++)
		{
			arr[i] = arr[i+1];
		}
		size --;
	}
	else
		cout << "Can not delete" << endl;
}

void Insert(string arr[], int &size, string aName)
{
	int k;
	int position;
	
	if (size < SIZE)
	{
		for (k=0; k<size; k++)
		{
			if (arr[k] > aName)
				break;
		}
		position = k;
	
		for (int i=size; i>position; i--)
		{
			arr[i] = arr[i-1];
		}
		arr[position] = aName;
		size ++;
	}
	else
		cout << "not inserted." << endl;
}

/*
void Insert(string arr[], int &size, string aName, int position)
{
	
	if (position >=0 && position <= size && size < SIZE)
	{
		for (int i=size; i>position; i--)
		{
			arr[i] = arr[i-1];
		}
		arr[position] = aName;
		size ++;
	}
	else
		cout << "not inserted." << endl;
}
*/


int LinearSearch(string names[], int count, string aName)
{
	for (int i=0; i<count; i++)
	{
		if (names[i] == aName)
			return i;
	}
	return -1;
}

void Sort(string names[], int count)
{
	int i, j, minIndex;
	string tmp;
	
	for (i=0; i<count-1; i++)
	{
		minIndex=i;
		for (j=i+1; j<count; j++)
		{
			if (names[j] < names[minIndex])
				minIndex = j;
		}
		
		if (minIndex != i )
		{
			tmp = names[i];
			names[i] = names[minIndex];
			names[minIndex] = tmp;
		}
	}
}

void Display(string names[], int count)
{
	cout << "The names are: " << endl;
	for (int i=0; i<count; i++)
	{
		cout << i+1 << " : " << names[i] << endl;
	}
}
