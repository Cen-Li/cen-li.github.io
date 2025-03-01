//// PROGRAMMER:    Joo Kim
// Assignment:      Open Lab Assignment 6
// Class:           CSCI 2170-003
// Course Instructor: Dr. Cen Li
// Due Date: 		Soft Copy: Midnight, Sunday, 4/17/2011
//                  Hard Copy: Monday, 4/18/2011
// Description:     Header file for sortedListClass

#include <iostream>
#include <fstream>
using namespace std;

#ifndef SORTEDLISTCLASS_H
#define SORTEDLISTCLASS_H

#include "type.h"

struct Node{
	flightRec record;
	Node* next;
};

typedef Node* NodePtr; 	//pointer to flightRec

class SortedListClass
{
	public:
		//constructors and destructors
		SortedListClass();
		//default constructor
	
		SortedListClass(const SortedListClass& s);
		//copy constructor
	
		~SortedListClass();
		//Destructor
	
		//overloaded operators:
		friend ostream& operator << (ostream & os, const SortedListClass & s);
		//overloaded output operator for sortedListClass
		
		flightRec& operator [] (int index);   
		// subscript operator
	
		SortedListClass& operator = (const SortedListClass & s);
		// assignment operator
	
		bool operator == (const SortedListClass & rhs);
		// equal to operator
	
		//sortedListClass operations
		void Insert(const flightRec newRec, bool& success);
		//Insert a flight record in ascending order by destination city
		//Pre-condition: SortedListClass object is declared
		//				 zero or more flightRec are in the list
		//				 in ascending order
		//Post-condition: new record is added to the list in ascending order
		//				  size is increased by 1.
	
		void Delete(const flightRec delRec, bool& success);
		//Delete a flight record that matches with origin and destination
		//as parameter values
		//Pre-condition: SortedListClass object is declared
		//				 one or more flightRec are in the list
		//Post-condition: flightRec that contains the given origin and dest
		//				  is deleted
		//				  return false by reference if < 0 flightRec
		//				  or no match is in the list.
		//				  size is decreased by 1.
		
		void Find(flightRec& rec, bool& success);
		//Finds and returns a flight record with given originand dest
		//Pre-condition: SortedListClass object is declared
		//				 one or more flightRec are in the list
		//Post-condition: flightRec is returned  by ref. if finds the match
		//				  otherwise return false by reference if < 0 flightRec
		//				  or no match is in the list.

		int GetLength() const;
		//returns the size of the list
		//Pre-condition: SortedListClass object is declared
		//Post-condition: size(length) of the list is returned
		
		bool IsEmpty() const;
		//check if the list is empty
		//Pre-condition: SortedListClass object is declared
		//Post-condition: returns true is one or more flightRec is in the list
		//				  otherwise return false
		
	private:
		int size;				//length of the list
		NodePtr head;			//pointer to the flightRec in the list
}; //end list

#endif
