#include <iostream>
using namespace std;

void SolveTowers(int count, char source, char destination, char spare);

int main()
{
    int count=5;
    char source='A', destination='B', spare='C';

	SolveTowers(count, source, destination, spare);
}

void SolveTowers(int count, char source, char destination, char spare)
{
	if (count ==1)
		cout << "moving disk from " << source << " to " << destination << endl;
	else
	{
		SolveTowers(count-1, source, spare, destination);
		SolveTowers(1, source, destination, spare);
		SolveTowers(count-1, spare, destination, source);
	}
}
