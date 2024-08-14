/*
 * File: IsBalanced.cpp
 * --------------------
 * This program checks to see whether the standard bracketing operators
 * (parentheses, square brackets, and curly braces) are correctly matched.
 */

#include <iostream>
#include <string>
#include <stack>
using namespace std;

/* Function prototypes */

bool isBalanced(string exp);
bool operatorMatches(char open, char close);

/* Main program */
int main() {
   string str;
   while (true) {
      cout << "Enter String: ";
      getline(cin, str);

      if (str == "") 
        break;
      if (isBalanced(str)) {
         cout << "Brackets are properly nested" << endl;
      } else {
         cout << "Brackets are incorrect" << endl;
      }
   }
   return 0;
}

/*
 * Function: isBalanced
 * Usage: if (isBalanced(str)) . . .
 * ---------------------------------
 * Returns true if the bracketing operators (parentheses, square
 * brackets, and curly braces) are correctly paired in the input string.
 */

bool isBalanced(string str) {
   stack<char> aStack;
   char topItem;

   for (int i = 0; i < str.length(); i++) {
      char ch = str[i];
      switch (ch) {
        case '{': 
        case '[': 
        case '(': aStack.push(ch); 
                  break;
        case '}': 
        case ']': 
        case ')': if (aStack.empty()) 
                    return false;
                  topItem = aStack.top();
                  if (!operatorMatches(topItem, ch)) 
                    return false;
                  else
                    aStack.pop();
                  break;
      }
   }
   return aStack.empty();
}

/*
 * Function: operatorMatches
 * Usage: if (operatorMatches(open, close)) . . .
 * ----------------------------------------------
 * Returns true if the characters open and close represent matching operators.
 * If op is not a bracketing operator, this function returns false.
 */

bool operatorMatches(char open, char close) {
   switch (open) {
     case '{': return close == '}';
     case '[': return close == ']';
     case '(': return close == ')';
     default: return false;
   }
}
