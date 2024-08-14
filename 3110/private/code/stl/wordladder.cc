/* File: wordladder.cpp *
 ************************
 *
 * BASE VERSION WITH NO EXTRA FEATURES!
 * ------------------------------------
 * This program
 *
 * Sources Cited:
 * --------------
 * Source1:
 *
 * Names: Joyce Kang and Julia Alison
 * Due Date: Friday, April 17th 11:59pm
 * Section Leader: Justin Salloum
 */

#include <cctype>
#include <cmath>
#include <fstream>
#include <iostream>
#include <string>
#include "console.h"
#include "set.h"
#include "queue.h"
#include "stack.h"
#include "filelib.h"
#include "simpio.h"
#include "strlib.h"

using namespace std;

//Function prototypes
void printWelcomeMessage();
void uploadDictionary(Set<string>& dict);
void processWords(string w1, string w2, Set<string>& dict);
void makeWordLadder(string w1, string w2, Set<string>& dict);
void printLadder(Stack<string>& ladder);

//Main
int main() {
    printWelcomeMessage();
    Set<string> dict;
    uploadDictionary(dict);
    string word1, word2;
    while (true){
        word1 = getLine("Word #1 (or Enter to quit): ");
        if (word1 == "") break;
        word2 = getLine("Word #2 (or Enter to quit): ");
        if (word2 == "") break;
        processWords(word1, word2, dict);
    }
    cout << "Have a nice day." << endl;
    return 0;
}

/* This function prints the initial welcome message to the console. */
void printWelcomeMessage(){
    cout << "Welcome to CS 106B Word Ladder." << endl;
    cout << "Please give me two English words, and I will change the" << endl;
    cout << "first into the second by changing one letter at a time." << endl << endl;
}

void uploadDictionary(Set<string>& dict){
    ifstream input;
    promptUserForFile(input, "Dictionary file name? ");
    string word;
    while (getline(input, word)){
        trimInPlace(word);
        dict.add(word);
    }
    input.close();
    cout << endl;
}

void processWords(string w1, string w2, Set<string>& dict){
    w1 = toLowerCase(w1);
    w2 = toLowerCase(w2);
    if (w1 == w2){
        cout << "The two words must be different." << endl << endl;
    } else if (w1.length() != w2.length()){
        cout << "The two words must be the same length." << endl << endl;
    } else if (!(dict.contains(w1) && dict.contains(w2))){
        cout << "The two words must be found in the dictionary." << endl << endl;
    } else {
        makeWordLadder(w1, w2, dict);
    }
}

/* Precondition: the pair will be valid, since it will only be called
 * when the input words are the same length, in the dictionary, and
 * not identical.
 */
void makeWordLadder(string w1, string w2, Set<string>& dict){
    Queue<Stack<string> > ladders;
    Set<string> usedWords;
    usedWords.add(w1);
    Stack<string> w1Stack;
    w1Stack.push(w1);
    ladders.enqueue(w1Stack);
    bool done = false;
    while (!ladders.isEmpty() && !done){
        Stack<string> partialLadder = ladders.dequeue();
        string topWord = partialLadder.peek();
        for (int i = 0; i < topWord.length() && !done; i++){
            for (char c = 'a'; c <= 'z' && !done; c++){
                string oneLetterChanged = topWord;
                oneLetterChanged[i] = c;
                if (dict.contains(oneLetterChanged) && !usedWords.contains(oneLetterChanged)){
                    if (oneLetterChanged == w2){
                        partialLadder.push(oneLetterChanged);
                        cout << "A ladder from " << w2 << " back to " << w1 << ":" << endl;
                        printLadder(partialLadder);
                        done = true;
                    } else {
                        Stack<string> newStack = partialLadder;
                        newStack.push(oneLetterChanged);
                        ladders.enqueue(newStack);
                        usedWords.add(oneLetterChanged);
                    }
                }
            }
        }
    }
    if (!done){
        cout << "No word ladder found from " << w2 << " back to " << w1 << "." << endl << endl;
    }
}

void printLadder(Stack<string>& ladder){
    while (!ladder.isEmpty()){
        cout << ladder.pop() << " ";
    }
    cout << endl << endl;
}


