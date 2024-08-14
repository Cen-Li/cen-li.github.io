#This is the program written by Sachintha Pitigala
#Data Mining - CSCI 7350

# user based recommendations

#!/usr/bin/python
from __future__ import division
import sys,os, math
from math import sqrt

# load database and construct the  nested dictionary
def loadMovies(path):	
	#Get movie titles
	movies={}
	
	for line in open(path+'/u.item'):
		(id, title) = line.split('|')[0:2]
		movies[id] = title

	#load data
	prefs={}
	
	for line in open(path+'/u.data'):
		(usr, movieid, rating, ts) = line.split('\t')
		prefs.setdefault(usr, {})
		prefs[usr][movies[movieid]]=float(rating)
	
	return prefs

# compute the cosine similarity between two person's preferences
def sim_cosine(prefs, person1, person2):

	#Get the list of shared items
	si = {}
	for it in prefs[person1]:
		if it in prefs[person2]:
			si[it]=1

	#if they have no ratings in common, return 0
	if (len(si) == 0): return 0

	# calculate the norm of two vectors
	norm1=sqrt(sum([pow(prefs[person1][it],2) for it in prefs[person1]]))
	norm2=sqrt(sum([pow(prefs[person2][it],2) for it in prefs[person2]]))
	denom=norm1*norm2
	
	# calculate the dot product of two vectors
	num=sum([prefs[person1][it] *prefs[person2][it] for it in si])
	
	if denom==0:
		similarity=0.0
	else:
		similarity=num/denom

	return similarity
		
# Get recommendations for a person by using a weighted average
# of every other user's ranking
def getRecommendations(prefs, person, similarity=sim_cosine):

	totals={}
	simSums = {}
	out={}

	for other in prefs:
		# don't compare one to himself
		if other == person:
			continue

		sim = similarity(prefs, person, other)

		#ignore scores of zero or lower
		if sim < 0: 
			continue

		for item in prefs[other]:
			#only score movies I have not seen before
			#if item not in prefs[person] or prefs[person][item]==0:
			if item not in prefs[person] :
				totals.setdefault(item, 0)

				#simiarity * score
				totals[item] += prefs[other][item]*sim

				#sum of similarities
				simSums.setdefault(item, 0)
				simSums[item] += sim

	# Create the normalized list
	rankings=[(item,total/(1+simSums[item])) for item, total in totals.items()]

	return rankings

# main function
if __name__ == '__main__':

	prefs = loadMovies('movies100K')

	#building the training set
	trainingsetsize=100
	training={}
	size=0
	
	#copy the first 100 person into training list
	for person in prefs:
		training[person]=prefs[person]
		size+=1
		if size==trainingsetsize:
			break;
			
	id=0
	corrlation_val=[]
	
	print "______________________________________________________"
	print "    \t Person \t Pearson Correlation value \t"
	print "______________________________________________________"
	
	for person in training:
		#remove the person from the main dictionary
		prefs.pop(person)
		
		#to store original ratings
		originalrating={}
		#to store the new calculated ratings
		newrating={}
		#store the copy of persons data
		copy={}
		itemsforperson=[]
		
		copy[person]=training[person]
		
		#get the item list for the person
		for item in training[person]:
			itemsforperson.append(item)
			
		for item in itemsforperson:
			recommendations=[]
			#store the person original rating
			originalrating[item]=copy[person][item]
			#remove the rating 
			copy[person].pop(item)
			#add the modified person record to the prefs
			prefs[person]=copy[person]

			recommendations = getRecommendations(prefs, person, sim_cosine)

			#search for the calculated ratings
			for v,k in recommendations:
				if v==item:
					newrating[item]=k
			
			#remove the person
			prefs.pop(person)
			copy[person][item]=originalrating[item]

		#calculate the pearson correlation value for the person
		n=len(originalrating)
		
		sum1=sum([originalrating[it] for it in originalrating])
		sum2=sum([newrating[it] for it in newrating])
		
		sum1square=sum([pow(originalrating[it],2) for it in originalrating])
		sum2square=sum([pow(newrating[it],2) for it in newrating])

		pSum=sum([originalrating[it]*newrating[it] for it in newrating])
			
		num=pSum-(sum1*sum2/n)
		denom=sqrt((sum1square-pow(sum1,2)/n)*(sum2square-pow(sum2,2)/n))
		
		if denom==0:
			pearson_cor=0.0
		else:
			pearson_cor=num/denom
		
		id+=1

		print "%3d \t %5s \t \t %1.10f"%(id,person,pearson_cor)
		corrlation_val.append(pearson_cor)
		
		#add person back to the dictionary
		prefs[person]=training[person]
		
	avearge=sum(corrlation_val)/len(corrlation_val)
	print "______________________________________________________"
	print "                                                      "
	print "Average correlation value for %d instances is %1.20f"%(len(corrlation_val),avearge)
	
