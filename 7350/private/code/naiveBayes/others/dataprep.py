# to run the program:
# 1) set the path to the directory containing the datafiles
# 2) the datafile directory should have two sub-directories: positive and negative, each has
#    a number of documents
# 3) run the program with python 2.6 for using numpy

#!/usr/bin/env python

import numpy as np  
import os
import re
import math
import sys
import htmlentitydefs   # contains nbsp, etc.
from math import log

MinimumProb = 1.0e-10

#remove all tags, return a list of words (one word per line)
#from the text content of the html file
def GetTextOnly(soup):
   v = soup.string
   if v==None:
       c = soup.contents
       resulttext = ''
       for t in c:
           subtext = GetTextOnly(t)
           resulttext +=subtext + '\n'
       return resulttext
   else:
       return v.strip()

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

def Learning(path):

    # Step 1:  Learning step
    # 1. for K classes (stored in K directories):
    #    1.a for each file in the kth class:
    #        1.a.1 find each word in the file
    #        1.a.2 cumulate the frequency of the word in this class
    #    1.b compute the probabilites of all the words in the kth class
    #
    termFreq = {}  # collect counts of terms in each document
    totalFileCount = 0  # total number of files read

    stopWords = ReadStopWords()

    # read and process the data files in each of the class directories one-by-one
    dir = os.listdir(path)   # find the classes

    fileCounts = {}  # p(Ck)
    model = {}  # P(Wi | Ck) each class has a corresponding table of 
                  # probabilities of the words seen for this class
    for classN in dir:
 
        fileCount = 0 # number of files in this class
        if (classN == '.DS_Store'):
            continue
  
        wordCount = 0  # number of valid words in the current document

        posPath = os.path.join(path, classN)
        for fileName in os.listdir(posPath):

            fileCount += 1  # one more document in this class
 
            if (fileName == '.DS_Store'): 
               continue
   
            fileloc = os.path.join(posPath, fileName)
            article = open(fileloc, 'r').read()

            #separate the words
            words = SeparateWords(article, stopWords)

            #remove numbers and single char words
            #compute the term frequency
            findNumber=re.compile('[0-9|-]+')
            for w in words:
               if (findNumber.search(w) == None) and len(w) > 1:

                 wordCount += 1   # another valid word

                 if (w in termFreq.keys()):
                     termFreq[w] += 1
                 else:  # w first seen, count is 1
                     termFreq[w] = 1  

        totalFileCount += fileCount
       
        #print termFreq
        #compute the probabilites based on the termFreq
        fileCounts[classN] = fileCount
        model[classN] = {}
        for word in termFreq:
             model[classN][word] = float(termFreq[word])/wordCount

    for m in model:
        fileCounts[m] = float(fileCounts[m]) / totalFileCount

    return fileCounts, model 
                
# perform classification
def Classify(path, classProb, model):
  
    # read the stop words
    stopWords = ReadStopWords()

    # classify documents in the testing directories one by one
    for fileName in os.listdir(path):

        # read one test article 
        fileloc = os.path.join(path, fileName)
        article = open(fileloc, 'r').read()

        #collect the words in the article
        words = SeparateWords(article, stopWords)

        #remove numbers and single char words, and compute the frequency of each word
        findNumber=re.compile('[0-9|-]+')  # regular expression pattern to remove numbers
        thisDoc=[]   # thisDoc contains the list of filtered words from the current article
        for w in words:   # only retain non-number words and words having more than 1 character
            if (findNumber.search(w) == None) and len(w) > 1:
                thisDoc.append(w)

        likelihood = [] # compute the posterior probability of the article given each of the available classes
        for cl in classProb:
            currLogProb = 0
            for w in thisDoc:  # compute Sum(logP(C_k)) + Sum(logP(Word_w | C_k))
                if w in model[cl]:
                    currLogProb += log(float(model[cl][w]))
                #else:
                #   currLogProb += log(float(MinimumProb))

            likelihood.append( (currLogProb, cl))
 
        likelihood.sort()
        likelihood.reverse()
        print likelihood
    
#main function
if (__name__ == '__main__'):   

    path = 'training/' # path to the data directory

    classProb, model = Learning(path)

    Classify('testing/', classProb, model)
