#include "sortedListClass.h"
#include <iostream>
#include <fstream>
#include <cstddef>
#include <cassert>
#include <iomanip>
using namespace std;

SortedListClass::SortedListClass()
{
	size = 0;
	head = NULL;
}

SortedListClass::SortedListClass(const SortedListClass & s)
{
	size = s.size;
	
	if(s.head == NULL)
		head = NULL;		//original list is empty
	
	else
	{
		//copy first node
		head = new Node;
		assert(head!=NULL); //check allocation
		head->record = s.head->record;
		
		//copy rest of list
		NodePtr NewPtr = head;
		
		//NewPtr points to last node in new list
		//OrigPtr points to nodes in original list
		for(NodePtr OrigPtr = s.head->next; OrigPtr!=NULL; 
			OrigPtr=OrigPtr->next)
		{
			NewPtr->next = new Node;
			assert(NewPtr->next != NULL);
			NewPtr = NewPtr->next;
			NewPtr->record = OrigPtr->record;
		}
		
		NewPtr->next = NULL;
	}
}

SortedListClass::~SortedListClass()
{
	NodePtr curr=head;
	NodePtr prev=head;
	
	//delete every nodes in the list
	while(curr!=NULL)
	{
		prev=curr;
		curr=curr->next;
		
		prev->next = NULL;
		delete prev;
		prev = NULL;
	}
}

ostream & operator << (ostream & os, const SortedListClass & s)
{
	//for traversing down the list
	NodePtr curr = s.head;

	//display every node
	//while the curr is not pointing the end of the list
	while(curr!=NULL)
	{
		os << curr->record.flightNum
		<< setw(4) << "$" << setw(3) << curr->record.price << endl;
		
		curr = curr->next;
	}
	
	cout << endl;
	
	//print the length of the list
	cout << "Number of records: " << s.size << endl << endl;
}

flightRec& SortedListClass::operator [] (int index)
{
	NodePtr curr = head;
	int count=0;
	
	//traverse the list
	while(curr!=NULL && count < index)
	{
		curr=curr->next;
		count++;
	}
	return curr->record;
}

SortedListClass& SortedListClass::operator = (const SortedListClass & s)
{
	size = s.size;
	
	if(s.head == NULL)
		head = NULL;		//original list is empty
	
	else
	{
		//copy first node
		head = new Node;
		assert(head!=NULL); //check allocation
		head->record = s.head->record;
		
		//copy rest of list
		NodePtr NewPtr = head;
		
		//NewPtr points to last node in new list
		//OrigPtr points to nodes in original list
		for(NodePtr OrigPtr = s.head->next; OrigPtr!=NULL; 
			OrigPtr=OrigPtr->next)
		{
			NewPtr->next = new Node;
			assert(NewPtr->next != NULL);
			NewPtr = NewPtr->next;
			NewPtr->record = OrigPtr->record;
		}
		NewPtr->next = NULL;	//last node's next assigns NULL
	}
	
	return *this;
}

bool SortedListClass::operator == (const SortedListClass & rhs)
{
	if(size != rhs.size)
		return false;
	else
	{
		for (NodePtr lhsPtr=head, rhsPtr=rhs.head; 
				(lhsPtr!=NULL)&&(rhsPtr!=NULL); 
			lhsPtr=lhsPtr->next, rhsPtr=rhsPtr->next)
		{
			if 	( !(lhsPtr->record == rhsPtr->record) ) // !=
				return false;
		}
		
		return true;
	}
}

void SortedListClass::Insert(const flightRec newRec, bool& success)
{
	//for traversing down the list and finding the insertion point
	NodePtr prev, curr;
	
	NodePtr newNode = new Node;			//create new node
	assert(newNode);					//check allocation
	
	success = bool(newNode!=NULL);
	
	//if the memory has been allocated,
	//insertion will be successful
	if(success)
	{
		newNode->record = newRec;		//copy data to new node
		newNode->next = NULL;
		
		//if the list is empty, make newNode as head
		if(head==NULL)
			head = newNode;
		
		//else if the new data's destination comes before the first node,
		//insert the new node in the first position
		else if(newRec < head->record)
		{
			newNode->next = head;
			head = newNode;
		}
		
		//else traverse down the list to find the insertion point
		//and insert in that position
		else
		{
			prev = head;
			curr = head;
			
			while(curr!=NULL && curr->record < newRec)
			{
				prev=curr;
				curr=curr->next;
			}
			
			newNode->next = curr;
			prev->next = newNode;
		}
		
		size++;							//increase the size by one
	}
}

void SortedListClass::Delete(const flightRec delRec, bool& success)
{
	//for traversing down the list and finding the match to delete
	NodePtr prev, curr;
	
	//if the list is empty, cannot perform the deletion
	if(IsEmpty())
	{
		cout << "The list is empty." << endl;
		success = false;
	}
	
	//else if the first node matches with the record that the
	//user wants to delete, delete the first node
	else if(head->record == delRec)
	{
		curr = head;
		head = head->next;
		curr->next = NULL;
		delete curr;
		curr = NULL;
		
		success = true;
		size--;
	}
	
	//else, traverse down the list and find the match to perform delete
	else
	{
		prev = head;
		curr = head;
		
		while(curr!=NULL && !(curr->record == delRec))
		{
			prev = curr;
			curr = curr->next;
		}
		
		//if found, curr should be at the deletion point
		//delete the node
		if(curr!=NULL)
		{
			prev->next = curr->next;
			curr->next = NULL;
			delete curr;
			curr = NULL;
			
			success = true;
			size--;
		}
		
		//if not found, then the curr should be equal to NULL
		//display appropriate message and the deletion fails
		else
		{
			cout << "No match is in the list." << endl;
			success = false;
		}
	}
}

void SortedListClass::Find(flightRec& rec, bool& success)
{
	//for traversing down the list and finding the match
	NodePtr curr;
	
	//if the list is empty, no match is in the list
	if(IsEmpty())
	{
		cout << "The list is empty." << endl;
		success = false;
	}
	
	//else, traverse down the list and find the match
	else
	{
		curr = head;
		
		while(curr!=NULL && !(curr->record == rec))
			curr = curr->next;
		
		//if found, return the record by reference
		if(curr!=NULL)
		{
			success = true;
			rec = curr->record;
		}
		
		//if not found, curr should be equal to NULL
		//match not found
		else
			success = false;
	}
}

int SortedListClass::GetLength() const
{
	return size;
}

bool SortedListClass::IsEmpty() const
{
	//if head is equal to NULL, then the list is empty
	if(head==NULL)
		return true;
	else
		return false;
}
