// Use Stack STL to evaluate postfix expression
// Limitations: 
//    For the expression entered: all the operands and numbers are separated by a single space
//    This program only considers operations involving binary operators
//    All the operands are of integer type
// file: postfix.cpp

#include <stack>
#include <iostream>
#include <string>
using namespace std;

void processPostfix(string line);
void getNextItem(string& line, string& nextItem, bool& success);
void compute(stack<int>&operands, string nextItem);

int main() {

    string line;
    while (true)  {
        cout << "Enter a postfix expression: ";
        getline (cin, line);

        if (line == "")  break;

        processPostfix(line);
    }

    return 0;
}

// This function evaluates a postfix expression in "line" 
// and prints out the result of the expression
void processPostfix(string line) {
    stack <int> operands;
    bool success=false;
    string nextItem;
    int result=0;
    int value;
    int op1, op2;

    getNextItem(line, nextItem, success);
    while (success) {
        compute(operands, nextItem);
        getNextItem(line, nextItem, success);
    }
    compute(operands, nextItem);
    cout << endl << "The result is " << operands.top() << endl << endl;
}

void compute(stack<int>&operands, string nextItem) {
    int op1, op2;
    int result;

    if (nextItem == "+")  {
       op1 = operands.top();
       operands.pop();
       op2 = operands.top();
       operands.pop();
       result = op2 + op1;
       operands.push(result);

       cout << "op1=" << op1 << " op2=" << op2 << " result=" << result << endl;
    }
    else if (nextItem == "-") {
       op1 = operands.top();
       operands.pop();
       op2 = operands.top();
       operands.pop();
       result = op2 - op1;
       operands.push(result);

       cout << "op1=" << op1 << " op2=" << op2 << " result=" << result << endl;
    }
    else if (nextItem == "*") {
       op1 = operands.top();
       operands.pop();
       op2 = operands.top();
       operands.pop();
       result = op2 * op1;
       operands.push(result);

       cout << "op1=" << op1 << " op2=" << op2 << " result=" << result << endl;
    }
    else if (nextItem == "/") {
       op1 = operands.top();
       operands.pop();
       op2 = operands.top();
       operands.pop();
       result = op2 / op1;
       operands.push(result);

       cout << "op1=" << op1 << " op2=" << op2 << " result=" << result << endl;
    }
    else  
       operands.push(atoi(nextItem.c_str()));
}

void getNextItem(string& line, string& nextItem, bool& success) {

    string::size_type pos=line.find(" ");
    if (pos != string::npos) {
        nextItem=line.substr(0, pos);
        line = line.substr(pos+1);
        success = true;
    } else {
        nextItem = line;
        success = false;
    }
    cout << "next item is " << nextItem << endl;
}
