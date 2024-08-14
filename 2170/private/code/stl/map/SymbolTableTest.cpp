/*
 * File: SymbolTableTest.cpp
 * -------------------------
 * This file implements a simple test of the map class by simulating
 * an assignment statements.
 *
 * The program reads command lines, which must be in one of
 * the following forms:
 *
 *   - A simple assignment statement of the form
 *        var = number
 *   - The name of a variable, which prints the value of that variable
 *   - The command list, which lists all variables and their values
 *   - The command quit, which should exit from the program.
 */

#include <iostream>
#include <string>
#include <map>
using namespace std;

bool containsKey(map<string,double> & myMap, string k);
void displayMap(map<string,double> & myMap);
string trim (string s);
double stringToReal(string s);

/* Main program */

int main() {
   map<string,double> symbolTable;
   string line;
   string key;

   while (true) {

      cout << "> ";
      getline(cin, line);

      if (line == "quit") 
         break;
      if (line == "list") {
         displayMap(symbolTable);
      } 
      else {
         int equals = line.find('=');

         // not an assignment statement, to show the value of a variable
         if (equals == (int) string::npos) {
            string var = line;
            if (containsKey(symbolTable, var)) {
               cout << symbolTable[var] << endl;
            } else {
               cout << var << " is undefined" << endl;
            }
         } 
         // an assignment statement
         else {
            string var = trim(line.substr(0, equals - 1));
            double value = stringToReal(trim(line.substr(equals + 1)));
            symbolTable[var] = value;
         }
      }
   }
   return 0;
}


// This function displays all the key-value pairs in the map object
void displayMap(map<string,double> & myMap) {
    map <string, double>::iterator  mi;
    for (mi=myMap.begin(); mi!=myMap.end(); mi++)  {
        cout << mi->first << " : " << mi->second << endl;
    }
}


// This function checks to see if the string k is in the set of keys in the map object
bool containsKey(map<string,double> & myMap, string k) {
    map <string, double>::iterator  mi;
    for (mi=myMap.begin(); mi!=myMap.end(); mi++)  {
        if (mi->first == k)
            return true;
    }
    return false;
}

// This function removes the leading and trailing blanks in string "s"
// s (IN): a string to be trimmed
string trim (string s) {
    string str="";
    int count=0; 
    while (s[count] == ' ')
        count ++; 
        
    while (count <s.length() && (s[count]!=' '))
        str += s[count++];

    return str;
}

// This function converts a string into the corresponding floating value
// s (IN): the characters in s are all digit letters
double stringToReal(string s)   {
    return (atof(s.c_str()));
}
