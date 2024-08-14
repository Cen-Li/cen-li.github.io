#ifndef PERSONCLASS_H
#define PERSONCLASS_H

#include <string>
using namespace std;

class personClass
{
public:
	personClass();
	personClass(string n, int a, int i, float g);
	personClass(const personClass& p);
	
	// accessors
	string GetName() const;
	int  GetAge() const;
	int GetID() const;
	float GetGPA() const;
	
	// mutators
	void UpdateName(string n);
	void UpdateAll(string n, int a, int i, float g);
	void UpdateAge(int a);
	
	// other methods
	void Display() const;
	bool SameName(string n);
	bool SamePerson(const personClass &p);
	bool Younger(const personClass &p);
	
	// overloaded operators
	bool operator < (personClass rhs);
	bool operator == (personClass rhs);
 
	~personClass();
	
private:
	string name;
	int    age;
	int    id;
	float  gpa;
};

#endif // PERSONCLASS_H
