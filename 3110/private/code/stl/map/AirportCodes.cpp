/*
 * File: AirportCodes.cpp
 * ----------------------
 * This program looks up a three-letter airport code in a map object.
 */

#include <fstream>
#include <iostream>
#include <string>
#include <cassert>
#include <map>
using namespace std;

/* Function prototypes */

void readCodeFile(string filename, map<string,string> & m);
void toUpperCase(string & s);
bool containsKey(map<string,string> & m, string k);
void displayMap(map<string,string> & codeMap);

/* Main program */

int main() {
   map<string,string> airportCodes;
   readCodeFile("AirportCodes.txt", airportCodes);
   //displayMap(airportCodes);

   while (true) {
      string code;
      cout << "Airport code: ";
      getline(cin, code);
      if (code== "") break;

      toUpperCase(code);
      if (containsKey(airportCodes, code)) {
         cout << code << " is in " << airportCodes[code] << endl;
      } else {
         cout << "There is no such airport code" << endl;
      }
   }
   return 0;
}

/*
 * Function: readCodeFile
 * Usage: readCodeFile(filename, map);
 * -----------------------------------
 * Reads a data file representing airport codes and locations into the
 * map, which must be declared by the client.  Each line must consist of
 * a three-letter code, an equal sign, and the city name for that airport.
 */

void readCodeFile(string filename, map<string,string> & m) {
   ifstream infile(filename);
   assert(infile);

   string line, code;
   while (infile) {
      getline(infile, line);
      if (infile.fail()) break;

      if (line.length() < 4 || line[3] != '=') {
         cerr << "Illegal data line: " + line << endl;
      }
      code = line.substr(0, 3);
      toUpperCase(code);
      m[code] =  line.substr(4);
   }
   infile.close();
}

void toUpperCase(string & s) {
   // only change the first three letters
   for (int i=0; i<3; i++) {
        s[i] = toupper(s[i]);
   }
}

bool containsKey(map<string,string> & codeMap, string k) {
    map <string, string>::iterator  mi;
    for (mi=codeMap.begin(); mi!=codeMap.end(); mi++)  {
        if (mi->first == k)
            return true;
    }
    return false;
}

void displayMap(map<string,string> & codeMap) {
    map <string, string>::iterator  mi;
    for (mi=codeMap.begin(); mi!=codeMap.end(); mi++)  {
        cout << mi->first << " : " << mi->second << endl;
    }
}

