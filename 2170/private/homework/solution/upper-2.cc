#include <iostream>
#include <string>
using namespace std;

int main()
{
	string line;
	string fstr=" ";
	
	int found;
	
	//get the user input
	cout<<"Please Enter Your Sentence: "<<endl;
	getline(cin,line);
	
	found=line.find(fstr);
	while(found!=string::npos)
	{
		//cout<<found<<endl;
		line[found+1]=toupper(line[found+1]);
		found=line.find(fstr,found+1);
	}

	cout<<line<<endl;
	
	return 0;
}