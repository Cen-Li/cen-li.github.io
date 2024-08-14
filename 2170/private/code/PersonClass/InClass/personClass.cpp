#include "personClass.h"
#include <iostream>
using namespace std;

personClass::personClass()
{
	name = "";
	id = 0;
	age = 0;
	gpa = 0.0;
}

personClass::personClass(string n, int a, int i, float g)
{
	name = n;
	age = a;
	id = i;
	gpa = g;
}

personClass::personClass(const personClass &p)
{
	name = p.name;
	id = p.id;
	age = p.age;
	gpa = p.gpa;
	cout << "copy constructor used" << endl;
}

string personClass::GetName() const
{
	return name;
}

int personClass::GetID() const
{
	return id;
}

float personClass::GetGPA() const
{
	return gpa;
}

int personClass::GetAge() const
{
	return age;
}

void personClass::UpdateAge(int a)
{
	age = a;
}

void personClass::UpdateAll(string n, int a, int i, float g)
{
	name = n;
	age = a;
	id = i;
	gpa = g;
}

void personClass::UpdateName(string n)
{
	name = n;
}

void personClass::Display() const
{
	cout << "Student " << name << endl;
	cout << "Age " << age << endl;
	cout << "ID " << id << endl;
	cout << "GPA " << gpa << endl;
}

bool personClass::SameName (string n)
{
	return (name == n);
}

bool personClass::SamePerson(const personClass &p)
{
	return ((name == p.name) && (id == p.id)
	        && (gpa == p.gpa) && (age == p.age));
}

bool personClass::Younger(const personClass &p)
{
	return (age < p.age);
}

bool personClass::operator< (personClass p)
{
	return (age < p.age);
}

bool personClass::operator == (personClass p)
{
	return ((name == p.name) && (id == p.id)
	        && (gpa == p.gpa) && (age == p.age));
}

personClass::~personClass()
{
	cout << "one object exits the scope" << endl;
}

