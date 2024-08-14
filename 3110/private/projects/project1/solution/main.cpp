#include <iostream>
#include <fstream>
#include <iomanip>
#include <cassert>
#include "type.h"
using namespace std;

const int MAX_SIZE = 100;
int ReadData(ifstream &myIn, StudentStruct students[]);
void DisplayAllStudents(StudentStruct students[], int count);
bool IsValid(StudentStruct students[], int count, string id);
void DisplayOneStudent(StudentStruct students[], int count, string id);
void Sort(StudentStruct students[], int count) ;

int main() {

  StudentStruct roster[MAX_SIZE];
  ifstream myIn("grades.dat");
 
  int numStudents;
  string id;
  
  assert(myIn);
  numStudents = ReadData(myIn, roster);

  // display all students
  DisplayAllStudents(roster, numStudents);

  // prompt for class id and perform search
  do {
    cout << endl << "Enter a valid class ID:";
    cin >> id;
  } while (! IsValid(roster, numStudents, id));
  DisplayOneStudent(roster, numStudents, id);
   
  // sort all students
  Sort(roster, numStudents);
  cout << "sorting student records by name ...." << endl;

   // display all students
  DisplayAllStudents(roster, numStudents);
  
  // display all students
  myIn.close();
}

void Sort(StudentStruct students[], int count) {
  bool sorted = false; // indicates whether additional comparison passes are needed
  int last = count - 1; // the index of the last item in the remaining part of the array

  StudentStruct tmp;

  while (!sorted) {
    // assuming the remaining array is sorted.
    sorted = true;
    for (int i = 0; i < last; i++) {
      if (students[i].name > students[i + 1].name) {
        // swap the two records
        tmp = students[i];
        students[i] = students[i + 1];
        students[i + 1] = tmp;

        // the remaining array is not sorted, need at least another pass
        // of pairwise comparison
        sorted = false;
      }
    }

    last--;
  }

  return;
}

void DisplayOneStudent(StudentStruct students[], int count, string id)
{
    for (int i=0; i<count; i++)
      if (students[i].id == id)  {
        cout << "Information for student with ID "
         << students[i].id << ":" << endl;
         cout << "Name : " << students[i].name << endl
         << "CLA : " << students[i].cla << endl
        << "OLA : " << students[i].ola << endl
        << "Quiz: " << students[i].quiz << endl
        << "Homework : "<< students[i].homework << endl
        << "Exam : " << students[i].exam << endl
        << "Bonus : " << students[i].bonus << endl << endl;
      }
}

bool IsValid(StudentStruct students[], int count, string id)
{
    for (int i=0; i<count; i++)
      if (students[i].id == id)
        return true;

    return false;
}

void DisplayAllStudents(StudentStruct students[], int count)
{
  cout << left;
  cout << "Here are the information of the " << count << " students: " <<endl << endl;
  cout << setw(10) << "ClassID" 
       << setw(15) << "Name"
       << setw(5) << "CLA"
       << setw(5) << "OLA"
       << setw(5) << "Quiz"
       << setw(10) << "Homework"
       << setw(6) << "Exam"
       << setw(8) << "Bonus" << endl << endl;
  
  for (int i=0; i<count; i++) {
    cout << setw(10) << students[i].id
         << setw(15) << students[i].name 
         << setw(5) << students[i].cla
        << setw(5) << students[i].ola
        << setw(5) << students[i].quiz
        << setw(10) << students[i].homework
        << setw(6) << students[i].exam
        << setw(8) << students[i].bonus << endl ;
  }
}

int ReadData(ifstream &myIn, StudentStruct students[])
{
  int count=0;

  myIn.ignore (100, '\n');
  while (myIn>>students[count].id){
    myIn >> students[count].name;
    myIn >> students[count].cla;
    myIn >> students[count].ola;
    myIn >> students[count].quiz;
    myIn >> students[count].homework;
    myIn >> students[count].exam;
    myIn >> students[count].bonus;
    count++;
  }

  return count;
}
