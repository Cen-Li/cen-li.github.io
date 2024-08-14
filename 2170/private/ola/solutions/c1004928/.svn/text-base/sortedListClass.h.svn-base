#ifndef sortedListClass_h
#define sortedListClass_h

#include <fstream>
#include <iostream>
using namespace std;

//Struct that contains a flight record
struct flightRec
{
	string origCity;
	int flightNum;
	int cost;
	string destCity;

	//Comparative operators
	bool operator < (const flightRec & rhs) const;
	bool operator == (const flightRec & rhs) const;
};

//the Node's struct
struct Node
{
	flightRec info;
	Node* next;
};

typedef Node* nodePtr;

typedef flightRec listItemType;

class sortedListClass
{
	public:
		sortedListClass();	//Default constructor
		sortedListClass(const sortedListClass& F);	//Copy Constructor
		~sortedListClass();	//Destructor
	
		// overloaded operators:
		listItemType & operator [] (int);   // subscript operator
		sortedListClass& operator = (const sortedListClass& rhs);  // assignment operator
		bool operator == (const sortedListClass & rhs); // equal to operator
	
		//Inserts a flight record in ascending order by DESTINATION CITY
		void ListInsert(const listItemType& newItem, bool& success);

		//Deletes a flight record with the same origin and destination cities
		void ListDelete(const listItemType& delItem, bool& success);

		//Returns flight record with the provided origin and destination cities
		void ListRetrieve(listItemType& retinfo, bool& success);

		//Print the entire list
		friend ostream& operator <<(ostream& os, const sortedListClass &  rhs);

		//Returns the length of the list
		int getLength();

		//returns whether the list is empty
		bool isEmpty();
	
	private:
		nodePtr Head;	//The beginning of the DLL
		int Size;	//Number of links
}; //end Class

#endif
