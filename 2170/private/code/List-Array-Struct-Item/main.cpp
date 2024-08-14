#include "List.h"
#include <iostream>
#include <string>
using namespace std;

void AddName(List & aList);
void Display (const List & aList);
void DeleteName(List & aList);

int main()
{
	List  nameList;
	char  choice='1';
	
	while (choice != '3') {
		
		cout << "Enter your choice (1:Add, 2:Delete, 3:Exit): ";
		cin >> choice;
		
		if (choice == '1') {   // adding name
			
			AddName(nameList);
			Display(nameList);
			
		} else if (choice == '2') {  // deleting name
			
			DeleteName(nameList);
			Display(nameList);
		}
	}
		
	return 0;
}

void AddName(List & aList)
{
	string name;
	ListItemType  anItem;
	int index;
	bool success;
	
	cout << "Enter the name to add: ";
	cin >> name;
	anItem.name = name;
	anItem.count = 1;  // 
	
	index = aList.find(anItem);
	
	if (index >= 0) {  // name already in the list 
		aList.retrieve(index, anItem, success);
		anItem.count++;
		aList.remove(index, success);
		aList.insert(index, anItem, success);
	}
	else {  // this is a new name
		aList.insert(aList.getLength(), anItem, success);
	}

}

void DeleteName(List & aList) 
{
	string name;
	ListItemType  anItem;
	int index;
	bool success;
	
	cout << "Enter the name to delete: ";
	cin >> name;
	anItem.name = name;
	anItem.count = 1;  // 
	
	index = aList.find(anItem);
	
	if (index >= 0) {  // name already in the list 
		aList.retrieve(index, anItem, success);
		
		if (anItem.count > 1)  {  // there are more than one appearance of name in the list
		    anItem.count --;
			aList.remove(index, success);
			aList.insert(index, anItem, success);
		}
		else {  // only one appearance of name in the list
			aList.remove(index, success);
		}
	}
	else { // name not in the list
		cout << "name was not in the list." << endl;
	}
}

void Display (const List & aList)
{
	ListItemType anItem;
	bool success;
	
	cout << endl << "Name \t Count" << endl;
	for (int i=0; i<aList.getLength(); i++)
	{
	    aList.retrieve(i, anItem, success);	
		cout << anItem.name << '\t' << anItem.count << endl;
	}
}