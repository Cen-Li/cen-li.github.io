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
//	00	75		68		85		76
//	01	95		89		100		95
//	03	55		70		70		62
//	avg	75 		75		85

const int NUM_STUDENTS=3;
const int NUM_AVGS=5;

#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
	int students[NUM_STUDENTS][NUM_AVGS];   // 2D array to store all grades
	int i,j;
	int avg[NUM_AVGS] = {0,0,0,0,0};   // 1D array to store the average across the students

	//read in the students
	for(i=0; i<NUM_STUDENTS; i++)  {
		cout << endl << "Input for Student : " << i+1 << endl;
  		cout << "====================" << endl;
		cout << "Enter ID : ";
 		cin >> students[i][0];
		for(j=1; j<NUM_AVGS-1; j++)  {
 			cout << "Enter Average : " << j << ": ";
			cin >> students[i][j];	
     		}
	}

	//calculate each student's average
	for(i=0; i<NUM_STUDENTS; i++) {
		students[i][NUM_AVGS-1] = students[i][1]*0.5 + students[i][2]*0.2 + students[i][3]*0.3;
	}

	//calculate the average of the tests, the quizzes, the programs, and the course average
	for(i=1;i<NUM_AVGS;i++) {
		for(j=0;j<NUM_STUDENTS;j++) {
			avg[i] += students[j][i];
		}
		avg[i] /= NUM_STUDENTS;
	}

	//print the table of values
	cout << endl << endl;
	cout << "id    testAvg quizAvg progAvg courseAvg\n";
	for(i=0;i<NUM_STUDENTS;i++) {
		cout << setw(3) << students[i][0];
		for(j=1;j<NUM_AVGS;j++)  {
			cout << setw(8) << students[i][j]; 
                }
		cout << endl;
	}
	cout << setw(3) << "avg" << setw(8) <<  avg[1] << setw(8) << avg[2] 
 		<< setw(8)<< avg[3] << setw(8) << avg[4] << endl;	

	return 0;
}
