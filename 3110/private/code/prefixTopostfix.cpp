// This program illustrates conversion from prefix expression to postfix expression
// Limitations: only single digit numbers and single characer variables are considered
//              only +, -, *, /, and % operators are considered

#include <iostream>
#include <string>
#include <stack>
#include <cctype>
using namespace std;

bool isOperator(char ch);
bool isSpace(char ch);
int precedence(char ch);
void PrintStack(stack<char> s);

int main() {
  
  string prefix, postfix="";
  stack<char> aStack;
  char ch;
  
  // prompt for prefix expression
  cout << "Enter a prefix expression: ";
  getline(cin, prefix);

  // check each character of the expression and determine which
  // action is appropriate
  for (int i=0; i<prefix.length(); i++) {
    ch = prefix[i];   
	  if (ch == '(') {
      aStack.push(ch);
    }
    else if (ch == ')' ) {
      while(aStack.top ( ) != '(')  {
					postfix += aStack.top( );
          postfix += ' ';
					aStack.pop();
    	}
 			aStack.pop();  // pop ‘(‘
    }
    else if (isOperator(ch)) {  // is operator
      while(!aStack.empty() && aStack.top( ) != '(' && (precedence(ch) <= precedence(aStack.top())))  {
					postfix += aStack.top(); 	
          postfix += ' ';
          aStack.pop();
				} // end while
				aStack.push(ch);		
    }
    else if (!isSpace(ch)) {  // is operand
      postfix += ch;
      postfix += ' ';
    }
  }  // end for

  while (!aStack.empty())  { 
	  postfix += aStack.top();
    postfix += ' ';
    aStack.pop();
  }

  cout << "The corresponding postfix expression is : " << postfix << endl; 
  return 0;
}

bool isOperator(char ch) {
  return (ch=='+'||ch=='-'||ch=='*'||ch=='%'||ch=='/');
}

bool isSpace(char ch) {
  return (ch=='\t'||ch==' '||ch=='\n');
}

int precedence(char ch) {
  switch (ch) {
    case '*':
    case '/':
    case '%': return 2; break;
    case '+': 
    case '-': return 1; break;
  }
}

void PrintStack(stack<char> s)
{
  stack<char> aux;
  char ch;
  
  while (!s.empty()) {
    ch = s.top();
    s.pop();
    cout << ch << " ";
  }
  cout << endl;
}