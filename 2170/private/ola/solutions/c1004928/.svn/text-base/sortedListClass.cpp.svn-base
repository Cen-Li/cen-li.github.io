#include "sortedListClass.h"

#include <cstddef>	//NULL
#include <cassert>	//assert()
#include <iomanip>
using namespace std;

//Default constructor
sortedListClass::sortedListClass()
{
	Size = 0;
	Head = NULL;
}

//Copy constructor
sortedListClass::sortedListClass(const sortedListClass& L)
{
   Size = L.Size;
   if (L.Head == NULL)
      Head = NULL;  // original list is empty

   else
   {  // copy first node
      Head = new Node;
      assert(Head != NULL);  // check allocation
      Head->info = L.Head->info;

      // copy rest of list
      nodePtr NewPtr = Head;  // new list pointer
      // NewPtr points to last node in new list 
      // OrigPtr points to nodes in original list
      for (nodePtr OrigPtr = L.Head->next;
                   OrigPtr != NULL; 
                   OrigPtr = OrigPtr->next)
      {  NewPtr->next = new Node;
         assert(NewPtr->next != NULL);
         NewPtr = NewPtr->next;
         NewPtr->info = OrigPtr->info;
      }  // end for

      NewPtr->next = NULL;
   }  // end if
}

//Destructor
sortedListClass::~sortedListClass()
{
	nodePtr curr;
	//Cyces through and deletes the entire list
	while (Head != NULL)
	{
		curr = Head;
		Head = Head -> next;
		curr -> next = NULL;
		delete curr;
		curr = NULL;
	}
}

//Retries the information based on the index
listItemType& sortedListClass::operator[] (int index)
{
	nodePtr cur=Head;
	int count=0;
	while (cur!=NULL && count < index)
	{
		cur=cur->next;
		count++;
	}
	return cur->info;
}

//Similar to the copy cnstructor
sortedListClass& sortedListClass::operator = (const sortedListClass&rhs)
{
	nodePtr Cur;

	Size = rhs.Size;

	// if the current list is not empty, deallocate its memory space
	// by freeing all its nodes
	while (Head!=NULL)
	{
		Cur=Head;
		Head=Head->next;
		Cur->next = NULL;
		delete Cur;
		Cur=NULL;
	}

	// now, copy the list over with deep copy
	if (rhs.Head==NULL)
		Head = NULL;
	else
	{
		// make a copy of the first node in the list
		Head = new Node;
		assert(Head!=NULL);
		Head-> info = rhs.Head-> info;
		
		// make copies of the rest of the nodes in the list
		Cur=Head;
		for (nodePtr origPtr=rhs.Head->next; origPtr!=NULL; origPtr=origPtr->next)
		{
			Cur->next = new Node;
			Cur = Cur->next;
			Cur-> info = origPtr-> info;
			Cur->next=NULL;
		}
	}

	return *this;  // send back the current object by reference
}

//
bool sortedListClass::operator == (const sortedListClass & rhs)
{
	if (Size != rhs.Size)
		return false;
	else
	{
		for (nodePtr lhsPtr=Head, rhsPtr=rhs.Head; 
				(lhsPtr!=NULL)&&(rhsPtr!=NULL); 
			lhsPtr=lhsPtr->next, rhsPtr=rhsPtr->next)
		{
			if 	(!(lhsPtr->info == rhsPtr-> info))
				return false;
		}
		
		return true;
	}
}


//Inserts a link into the list in ascending order of destination city
//Pre-Condition: define newinfo of type flightRec
//Post-Condition: newinfo is inserted, Size++
void sortedListClass::ListInsert(const listItemType& newinfo, bool& success)
{
	nodePtr newPtr, curr, prev; //Used to trace the list
	newPtr = new Node;
	assert(newPtr);
	success = bool(newPtr != NULL);
	newPtr -> info = newinfo;
	newPtr -> next = NULL;
	
		//If the list is empty or the new info is smaller than the list
		if((Head==NULL)||(Head!=NULL && (newinfo < Head->info)))
		{
			//place the new info in front of the list
			newPtr -> next = Head;
			Head = newPtr;
			Size++;
		}
		else
		{
			prev = Head;
			curr = Head;
			//move curr and prev to the desired place to insert the info
			while(curr != NULL && curr -> info < newinfo)
			{
				prev = curr;
				curr = curr -> next;
			}

	//if (curr==NULL)
	//cerr << "insert, find NULL" << endl;
			//make the new pointer part of the DLL
			newPtr -> next = curr;
			prev -> next = newPtr;

			//increment size
			Size++;
		}
}

//Deletes a flight record with the same origin and destination cities
//Pre-Condition: delinfo must be defined
//Post-Condition: an info is deleted and size-- or nothing happens
void sortedListClass::ListDelete(const listItemType & item, bool& Success)
{
   nodePtr Cur, Prev;

    if (Head==NULL)
    {
        cout << "list empty, deletion failed." << endl;
        Success=false;
    }
    else if (Head->info== item)
    {
        Cur = Head;
        Head=Head->next;
        Success=true;
    }
    else
    {
        Cur = Prev = Head;
        while ((Cur != NULL)&&(!(Cur->info== item)))
        {
            Prev=Cur;
            Cur = Cur->next;
        }

        if (Cur == NULL)
        {
            cout << "item not in the list, delete failed." << endl;
            Success = false;
        }
        else
        {
            Prev->next = Cur->next;
            Success=true;
        }
    }
    if (Success)
    {
        Cur->next = NULL;
        delete Cur;
        Cur = NULL;

        Size--;
    }
}  // end ListDelete

//Returns flight record with the provided origin and destination cities
//Pre-Condition:retinfo must be declared
//Post-Condition: the link with the desired info is sent back pass-by-reference
void sortedListClass::ListRetrieve(listItemType& retinfo, bool& success)
{
	success = false;
	nodePtr curr = Head;
	//Traverse the entire list
	//for(int i =0; i < Size; i++)
	while (curr!=NULL)  // changed
	{
		//if any link matches the desired cities
		if(retinfo == curr -> info)
		{	
			//assign the retrieved info to be the link's info
			retinfo = curr -> info;
			success = true;
			break;
		}
		//move down the list one more link
		curr = curr -> next;
	}
	//if a match was not found
	if(!success)
		cout << "No flights available." << endl;
}
		
//Print the entire list
//Pre-Condition: none
//Post-Condition: none
ostream& operator << (ostream& os, const sortedListClass &  rhs)
{
	nodePtr curr = rhs.Head;	//to traverse the list
	
	//Print the table heading
	os << "Flight    Origin         Destination    Price" << endl;
	os << "======================================================" << endl;
	
	//Cycle through the entire list
	//for( int i = 0; i < rhs.Size; i++)
	while (curr != NULL)
	{
		//print each piece of information
   		//os << left << setw(10) << curr ;
		os << left << setw(10) << curr -> info.flightNum;
		os << left << setw(15) << curr -> info.origCity;
		os << left << setw(15) << curr -> info.destCity;
		os << left << setw(15) << curr -> info.cost << endl;
		
		//move another link down the list
		curr = curr -> next;
	}
	//print the size
	os << endl << "There are " << rhs.Size << " items in the list" << endl;

	return os;  // changed
}

//compare the two destination cites
//Pre-Condition: none
//Post-Condition: true/false
bool flightRec::operator < (const flightRec & rhs) const
{
	return(destCity < rhs.destCity);
}

//compare the origin city and the destination city
//Pre-Condition: none
//Post-Condition: true/false
bool flightRec::operator == (const flightRec & rhs) const
{
	return((origCity == rhs.origCity)&&(destCity == rhs.destCity));
}

//Returns the length of the list
//Pre-Condition: Size must have a value
//Post-Condition: none
int sortedListClass::getLength()
{
	return Size;
}

//returns whether the list is empty
//Pre-Condition: none
//Post-Condition: true/false
bool sortedListClass::isEmpty()
{
	//if the head contains nothing
	if(Head == NULL)
		return true;
	else 
		return true;
}
