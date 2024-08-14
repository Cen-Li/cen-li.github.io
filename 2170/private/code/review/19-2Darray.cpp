//File: 25-2Darray1.cc
//Purpose: Read in a class of 3 student records of the form
//	id,testAvg,quizAvg,progAvg
//	A student's course average is calculated by the following:
//		testAvg*0.5 + quizAvg*0.2 + progAvg*0.3
//	This program will calculate the course average for all
//	students.  It will also calculate the average testAvg,
//	the average quizAvg, and the average progAvg and then
//	print all records in table format as follows:
//	id	testAvg		quizAvg		progAvg		courseAvg
//	00	75			68			85			76
//	01	95			89			100			95
//	03	55			70			70			62
//	avg	75 			75			85

#include <iostream>
using namespace std;
int main()
{
	int students[3][5];
	int i,j;
	int avg[5] = {0,0,0,0,0};

	//read in the students
	for(i=0;i<3;i++)
		for(j=0;j<4;j++)
			cin >> students[i][j];	

	//calculate each student's average
	for(i=0;i<3;i++)
	{
		students[i][4] = students[i][1]*0.5 + students[i][2]*0.2 + students[i][3]*0.3;
	}

	//calculate the average of the tests, the quizzes, the programs, and the course average
	for(i=1;i<5;i++)
	{
		for(j=0;j<3;j++)
		{
			avg[i] += students[j][i];
		}
		avg[i] /= 3;
	}

	//print the table of values
	cout << "id testAvg quizAvg progAvg courseAvg\n";
	for(i=0;i<3;i++)
	{
		for(j=0;j<5;j++)
			cout << students[i][j] << " ";
		cout << endl;
	}
	cout << "avg " << avg[1] << " " << avg[2] << " " << avg[3] << " " << avg[4] << endl;	

	return 0;
}
