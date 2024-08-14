    char ch = cin.peek();
    while (ch != '\n') {
        if ( isdigit(ch)) {  // operand
             // fill code here
        }
        else  {  // operator
             // fill code here
        }
 
        SkipSpaces(); // optional: skip whilte spaces if there is any
        ch = cin.peek();
    }

