#include <iostream>
#include <string>

using namespace std;

const int SIZE = 26;

int main()
{
    int length;
    string text;
    int frequency[SIZE]={0};

    /*
    for (int i=0; i<SIZE; i++)
        frequency[i] = 0;
    */

    cout << "Enter a text: ";
    getline(cin, text);

    length=text.length();

    for (int i=0; i<length; i++)
	{
        if ((text[i] >= 'a' && text[i] <= 'z' ) ||
            (text[i] >= 'A' && text[i] <= 'Z'))
        {
            text[i] = tolower(text[i]);
            frequency[text[i] - 'a'] ++;
        }
    }
    
    for (int i=0; i<SIZE; i++)
    {
        cout << char('a' + i) << ":\t" << frequency[i] << endl;
    }

    return 0;
}
