//file: 10-nestedwhile-1.cc
//Purpose: compute the average test grade for N students.

#include <iostream>
using namespace std;
int main()
{
	int numTests, numStudents; //n is the number of tests per student, m is number of students
	int i, j; //loop counters
	float average;  //the average test grade for each student
	int testgrade;  //the individual test grades

	//get m and n
	cout << "How many students are there? ";
	cin >> numStudents;
	cout << "How many tests does each student have? ";
	cin >> numTests;

	//loop through all students
	i = 0;
	while(i < numStudents)
	{
		//compute average for a student
		j = 0;
		average = 0;

		//loop through the student's test grades
		cout << "input student " << i+1 << "'s test grades\n";
		while(j < numTests)
		{
                        cout << "Enter test grade " << j+1 << ": ";
			cin >> testgrade;
			average += testgrade;

			j++;
		}
		//output their average 
		cout << "student " << i << "'s average grade is " << average/numTests << endl << endl;
	
		//go to next student
		i++;
	}

	return 0;
}
