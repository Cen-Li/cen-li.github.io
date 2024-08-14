#include <iostream>
#include <string>
using namespace std;

int main()
{
	string line;
	string fstr="and";
	
	int firstp,secondp,thirdp;
	
	//get the user input
	cout<<"Please Enter Your Sentence: "<<endl;
	getline(cin,line);
	
	//finding the first position
	firstp=line.find(fstr);
	if(firstp!=string::npos)
	{
		cout<<"first: "<<firstp<<endl;
		
		//finding the second position
		secondp=line.find(fstr,firstp+3);
		if(secondp!=string::npos)
		{
			cout<<"second: "<<secondp<<endl;
			
			//finding the third position
			thirdp=line.find(fstr,secondp+3);
			if(thirdp!=string::npos)
				cout<<"third: "<<thirdp<<endl;
			else
					cout<<"third: no position"<<endl;
		}
		else
		{
			cout<<"second: no position"<<endl;
			cout<<"third: no position"<<endl;
		}
	}
	else
	{
		cout<<"first: no position"<<endl;
		cout<<"second: no position"<<endl;
		cout<<"third: no position"<<endl;
	}
	return 0;
}