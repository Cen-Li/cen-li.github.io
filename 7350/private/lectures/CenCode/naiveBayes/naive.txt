#!/usr/bin/env python

import numpy as np  
import os
import re
import math
import sys
import htmlentitydefs   # contains nbsp, etc.
from math import log

MinimumProb = 1.0e-10

#takes a string and splits it in to a list of words
def SeparateWords(text, stopWords):
    output = []
    isnumeric = re.compile('\\-?\d+')
    splitter = re.compile('\\W*')
    words = splitter.split(text)
    for s in words:
        s = s.strip()
        s = s.lower()
        if s!='' and len(s) > 1 and not isnumeric.match(s) and not (s in stopWords):
           output.append(s)

    return output

def ReadStopWords():
    # read the list of stop words from the file "stopwords"
    stopWords = []
    stopwords = open("stopwords", 'r').readlines();
    for sw in stopwords:
       stopWords.append(sw.strip())

    return stopWords

# Learning Step
def Learn(path):

    # Learning step
    # 1. for K classes (stored in K directories):
    #    1.a for each file in the kth class:
    #        1.a.1 find each word in the file
    #        1.a.2 cumulate the frequency of the word in this class
    #    1.b compute the conditional probabilites of each word in the kth class
    #
    totalFileCount = 0  # total number of files read

    stopWords = ReadStopWords()

    # read and process the data files in each of the class directories 
    dir = os.listdir(path)   # find the classes

    classProbability = {}  # p(Ck)
    model = {}  # P(Wi | Ck) each class has a corresponding table of 
                  # probabilities of the words seen for this class
    wordCounts={}
    Vocabulary= {} 
    fileCounts={}
    for class_i in dir:
 
        termFreq = {}  # collect counts of terms in each document

        # Process class_i
        fileCount = 0 # number of files in this class
        wordCount = 0 # number of valid words in the current document
  
        posPath = os.path.join(path, class_i)
        for fileName in os.listdir(posPath):

            fileCount += 1  # one more document in this class
 
            fileloc = os.path.join(posPath, fileName)
            article = open(fileloc, 'r').read()

            #separate out the list of words
            words = SeparateWords(article, stopWords)

            #remove numbers and single char words
            #compute the term frequency
            findNumber=re.compile('[0-9|-]+')
            for word in words:
               if (findNumber.search(word) == None) and len(word) > 1:

                 wordCount += 1   # found another valid word, add 1 to total word count 
                
                 if (word not in Vocabulary):  # add the word to vocabulary if first seen
                    Vocabulary[word] = 1

                 if (word in termFreq.keys()):  # tally the frequency count for the word
                     termFreq[word] += 1
                 else:  # word first seen, count is 1
                     termFreq[word] = 1  

        # tally the counts for class_i
        fileCounts[class_i] = fileCount
        wordCounts[class_i] = wordCount
        #print "class %s has %d files and %d words" % (class_i, fileCount, wordCount)

        totalFileCount += fileCount # total number of documents in the training data

        model[class_i] = termFreq

    VocabSize = len(Vocabulary)
    #print "vocab size = %d" % VocabSize
    for class_i in model:
        #compute the probabilites based on the termFreq
        classProbability[class_i] = float(fileCounts[class_i]) / totalFileCount

        for word in model[class_i]:
             model[class_i][word] = float((model[class_i][word])+1)/(wordCounts[class_i]+VocabSize)

    return classProbability, model, wordCounts, VocabSize
                
#Classification step
def Classify(path, classProb, model, wordCounts, VocabSize):
  
    stopWords = ReadStopWords()

    for fileName in os.listdir(path):
        print fileName 

        fileloc = os.path.join(path, fileName)
        article = open(fileloc, 'r').read()

        #separate the words
        words = SeparateWords(article, stopWords)

        #remove numbers and single char words, compute the term frequency
        findNumber=re.compile('[0-9|-]+')
        thisDoc=[]
        for word in words:
            if (findNumber.search(word) == None) and len(word) > 1:
                thisDoc.append(word)

        likelihood = []
        for class_i in classProb:
            currLogProb = 0
            for word in thisDoc:
                if word in model[class_i]:
                    currLogProb += log(float(model[class_i][word]))
                else:
                    currLogProb += log(1.0/(wordCounts[class_i]+VocabSize))
            currLogProb += log(float(classProb[class_i]))

            likelihood.append((currLogProb, class_i))
 
        likelihood.sort()
        likelihood.reverse()
        print likelihood
    
if (__name__ == '__main__'):   

    # Learning Step
    classProb, model, wordCounts, VocabSize = Learn('experiment/training/')

    # Classification Step
    Classify('experiment/testing/', classProb, model, wordCounts, VocabSize)
