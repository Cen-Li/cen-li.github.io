#include <iostream>
using namespace std;

struct StudentType
{
   int id;
   string name;
   int age;
   float gpa;
};

void DisplayStudent(StudentType oneStudent);
void ReadStudent(StudentType & oneStudent);
void ReadAllStudents(StudentType allStudents[], ifstream & myIn, int &size);
void DisplayAllStudents(const StudentType allStudents[], int size);

const int MAX_SIZE = 500;

int main()
{
   StudentType allStudents[MAX_SIZE];
   ifstream myIn;
   int size;

   myIn.open("students.dat");
   assert(myIn);
   
   ReadAllStudents(allStudents, myIn, size);

   DisplayAllStudents(allStudent, size); 
   
   // display names of all students having gpa >= 3.5
   for (int i=0; i<size; i++)
   {
       if (allStudents[i].gpa >= 3.5)
       {
            cout << allStudents[i].name << endl;
       }
   }

   return 0;
}

void ReadAllStudents(StudentType allStudents[], ifstream & myIn, int &size)
{
   size = 0;  // count number of records read; serve as array index
   while (size < MAX_SIZE && myIn >> allStudents[size].id)
   {
   	myIn.ignore(100, '\n');
 	getline(myIn, allStudents[size].name);
	myIn >> allStudents[size].gpa;
	myIn >> allStudents[size].age;

        size++;
   }
} 


void DisplayAllStudents(const StudentType allStudents[], int size)
{
   for (int i=0; i<size; i++)
   {
      DisplayStudents(allStudents[i]);
   }
}


void ReadStudent(StudentType & oneStudent)
{
  cout << "Enter the name:";
  getline(cin, oneStudent.name);

  cout << "Enter age: ";
  cin >> oneStudent.age;

  cout << "Enter gpa: ";
  cin >> oneStudent.gpa;

  cout << "Enter id: ";
  cin >> oneStudent.id;
}

void DisplayStudent(StudentType oneStudent)
{
  cout << "Name : " << oneStudent.name << endl;
  cout << "ID: " << oneStudent.id<< endl;
  cout << "Age: " << oneStudent.age<< endl;
  cout << "GPA: " << oneStudent.gpa<< endl;
}
