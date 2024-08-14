#include <iostream>
#include <string>
using namespace std;

const int SIZE = 10;

int main(int argc, char **argv)
{
    string input;
	int counts[SIZE]={0};
	
	cout << "Enter a long sequence of digits:";
	cin >> input;
	
	for (int i=0; i<input.size(); i++)
	{
		counts[input[i] - '0'] ++;
	}
	
	// display result
	for (int i=0; i<SIZE; i++)
	{
		cout << i << " : " << counts[i] << endl;
	}
	
    return 0;
}
