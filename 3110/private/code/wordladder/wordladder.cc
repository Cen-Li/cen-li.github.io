/* File: wordladder.cpp 
 */

#include <cctype>
#include <cmath>
#include <fstream>
#include <iostream>
#include <string>
#include <set>
#include <queue>
#include <stack>
#include <map>
#include <cstdlib>
#include <cassert>

using namespace std;

//Function prototypes

// Helper Function prototypes
bool containsKey(map<string,string> & codeMap, string k);
bool contains(set<string> & dictionary, string word);
void displayMap(map<string,string> & codeMap);
void trimInPlace (string & s);
void printLadder(stack<string>& ladder);
string toLowerCase(string s);

// Application function prototypes
void printWelcomeMessage();
void uploadDictionary(set<string>& dict);
void processWords(string w1, string w2, set<string>& dict);
void makeWordLadder(string w1, string w2, set<string>& dict);

//Main
int main() {
    set<string> dict;
    string word1, word2;

    printWelcomeMessage();
    uploadDictionary(dict);

    char again = 'y';
    while (again == 'y') {
        cout << "Word #1: ";
        cin>>word1;

        cout << "Word #2: ";
        cin>>word2;

        processWords(word1, word2, dict);

        cout << "Another one? (y for yes, n for no):" << endl;
        cin >> again;
    }
    cout << "Have a nice day." << endl;
    return 0;
}


// This function prints the initial welcome message to the console.
void printWelcomeMessage(){
    cout << "Welcome to the Word Ladder." << endl;
    cout << "Please give me two English words, and I will change the" << endl;
    cout << "first into the second by changing one letter at a time." << endl << endl;
}


// Read all the words from a data file and store these words in a "set" data structure
void uploadDictionary(set<string>& dict){
    ifstream input;
    string filename;

    // prompt for data and open data file
    cout << "Dictionary file name? ";
    cin >> filename;
    input.open(filename.c_str());
    assert(input);

    string word;
    while (input>>word){
        //trimInPlace(word);
        dict.insert(word);
    }

    input.close();
}


// Determine if a ladder may be possible between two words 
// If so, "madeWordLadder" function is called to actuall find the word ladder between the two words
void processWords(string w1, string w2, set<string>& dict){
    w1 = toLowerCase(w1);
    w2 = toLowerCase(w2);
    if (w1 == w2){
        cout << "The two words must be different." << endl << endl;
    } else if (w1.length() != w2.length()){
        cout << "The two words must be the same length." << endl << endl;
    } else if (!(contains(dict, w1) && contains(dict, w2))){
        cout << "The two words must be found in the dictionary." << endl << endl;
    } else {
        makeWordLadder(w1, w2, dict);
    }
}

/* Precondition: the pair will be valid, since it will only be called
 * when the input words are the same length, in the dictionary, and not identical.
 */
void makeWordLadder(string w1, string w2, set<string>& dict){
    queue<stack<string> > ladders;
    set<string> usedWords;
    stack<string> w1Stack;

    usedWords.insert(w1);
    w1Stack.push(w1);
    ladders.push(w1Stack);
    bool done = false;
    while (!ladders.empty() && !done){
        stack<string> partialLadder; 
        partialLadder=ladders.front();
        ladders.pop();
        string topWord = partialLadder.top();

        // Perform one level of breath first search
        // For each letter of the "topWord", one may substitue it with any of the 26 alphabets
        for (int i = 0; i < topWord.size() && !done; i++) {
            for (char c = 'a'; c <= 'z' && !done; c++) {
                string oneLetterChanged = topWord;
                oneLetterChanged[i] = c;
                if (contains(dict, oneLetterChanged) && !contains(usedWords, oneLetterChanged)){
                    if (oneLetterChanged == w2){
                        partialLadder.push(oneLetterChanged);
                        cout << "A ladder from " << w2 << " back to " << w1 << ":" << endl;
                        printLadder(partialLadder);
                        done = true;
                    } else {
                        stack<string> newStack = partialLadder;
                        newStack.push(oneLetterChanged);
                        ladders.push(newStack);
                        usedWords.insert(oneLetterChanged);
                    }
                }
            }
        }

    }
    if (!done){
        cout << "No word ladder found from " << w2 << " back to " << w1 << "." << endl << endl;
    }
}

// ********************************************************
//                Helper Functions 
// ********************************************************

// Checks to see if "k" is a key value in the "map" data structure "codeMap"
bool containsKey(map<string,string> & codeMap, string k) {
    map <string, string>::iterator  mi;
    for (mi=codeMap.begin(); mi!=codeMap.end(); mi++)  {
        if (mi->first == k)
            return true;
    }
    return false;
}

// Displays all the items in a map data structure 
// in the format key : value pairs
void displayMap(map<string,string> & codeMap) {
    map <string, string>::iterator  mi;
    for (mi=codeMap.begin(); mi!=codeMap.end(); mi++)  {
        cout << mi->first << " : " << mi->second << endl;
    }
}

// This function removes the leading and trailing blanks in string "s"
// s (IN): a string to be trimmed
void trimInPlace (string & s) {
    string str="";
    int count=0;
    while (s[count] == ' ')
        count ++;

    while (count <s.length() && (s[count]!=' '))
        str += s[count++];

    s=str;
}

// Prints all the items in the stack
// ladder (IN): the stack containing items to be displayed
void printLadder(stack<string>& ladder){
    while (!ladder.empty()){
        cout << ladder.top() << " ";
        ladder.pop();
    }
    cout << endl << endl;
}

// Changes all the letters in a string to lower case
// s (IN): a string to be modified
string toLowerCase(string s)  {
    for (int i=0; i<s.length(); i++) 
        s[i] = tolower(s[i]);

    return s;
}

// Checks to see if "word" appears in the set "dictionary"
bool contains(set<string> & dictionary, string word) {
    if (dictionary.count(word) != 0) {
        return true;
    }
    else
        return false;
}
