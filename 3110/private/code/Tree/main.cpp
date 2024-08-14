#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <cstdlib>
#include "BST.h"

using namespace std;

void iprint(int & x) {
	cout << x << endl;
}

void sprint(string & x) {
	cout << x << endl;
}

BinarySearchTree<string> insertFile() {
	BinarySearchTree<string>	tree;

	ifstream	ifs("main.cpp");	//open this file
	string		value;
	
	cout << "inserted words: ";
	while (ifs >> value) {
		if (!isalpha(value[0]))
			continue;
		if (!tree.searchTreeRetrieve(value)) {
			tree.searchTreeInsert(value);
			cout << value << " ";
		}
	}
	ifs.close();

	return tree;
}

int main()
{
	//construct a BST of ints
	BinarySearchTree<int>	tree;
	int						value;

	srand(time(NULL));
	cout << "inserted integers: ";
	for (int i = 0; i < 20; ++i) {
		value = rand() % 100 + 1;
		if (!tree.searchTreeRetrieve(value)) {
			tree.searchTreeInsert(value);
			cout << value << " ";
		}
	}
	cout << endl << " in order traverse: " << endl;
	tree.inorderTraverse(iprint);

	BinarySearchTree<string>	words = insertFile();
	cout << endl << " in order traverse: " << endl;
	words.inorderTraverse(sprint);

	
}
