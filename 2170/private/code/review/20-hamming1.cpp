//File:   20-hamming1.cc
//Purpose:  Read in the 7 bits of a hamming code word and determine
//		if there is an error or not using a value returning function

#include <iostream>
using namespace std;


int findCode(int b1, int b2, int b3, int b4, int b5, int b6, int b7);

int main()
{
	int b1, b2, b3, b4,b5,b6,b7; //The seven bits
	int ans;  //the answer

	cout << "Input the seven bits ";
	cin >> b1 >> b2 >> b3 >> b4 >> b5 >> b6 >> b7;

	//Find error location
	ans = findCode(b1,b2,b3,b4,b5,b6,b7);

    	// output error location
	cout << "The error location is " << ans << endl;

	return 0;
}

//findError: takes 8 pass by value bits and returns the error location
int findCode(int b1, int b2, int b3, int b4, int b5, int b6, int b7)
{
	int c1, c2, c3; //intermediate values
	int answer;

	c1 = (b1+b3+b5+b7)%2;
	c2 = (b2+b3+b6+b7)%2;
	c3 = (b4+b5+b6+b7)%2;
    	answer = c1 + 2*c2 + 4*c3; 

	return answer;
}	
