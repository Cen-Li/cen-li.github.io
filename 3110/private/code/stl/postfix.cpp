// This program implements the postfix evaluation process
// using the STL stack
// Limitations: This program only works for operators: +, -, *, and /

#include <string>
#include <stack>
#include <iostream>
#include <cctype>
using namespace std;

// Function declaration
void SkipSpaces();

int main() 
{
    string line;
    stack<int> intStack;
    int num1, num2, res;
    char op;
    
    cout << "Enter a postfix expression: ";
    cout.flush();

    // optional : SkipSpaces();
    char ch = cin.peek();
    while (ch != '\n') {
        if ( isdigit(ch)) {  // operand
		cin >> num1;
		//cout <<"push " << num1 << endl;
		intStack.push(num1);
	}
	else  {  // operator
		cin >> op;
		num2 = intStack.top();
		//cout <<"*pop* " << num2 << endl;
		intStack.pop();
		num1 = intStack.top();
		//cout <<"*pop* " << num1 << endl;
		intStack.pop();

		switch (op) {
		case '+':  res=num1+num2; break;
		case '-':  res=num1-num2; break;
		case '*':  res=num1*num2; break;
		case '/':  res=num1/num2;
		}
		intStack.push(res);
		//cout << "push res " << res << endl;
	}
	SkipSpaces();
	ch = cin.peek();
    }

    res = intStack.top();
    cout << "Result: " << intStack.top() << endl;
    intStack.pop();

    return 0;
}

// This function skips over the blank spaces between input data and operators
void SkipSpaces()
{
    char ch=cin.peek();
    while (ch == ' ') {
        ch=cin.get();
	ch=cin.peek();
    }
}
