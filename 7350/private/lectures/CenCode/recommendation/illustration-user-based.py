# user based recommendations
import pprint
from math import sqrt

# load database and construct the  nested dictionary
def loadMovies():

  #Get movie titles
  movies={}
  for line in open('movies.dat'):
    (id, title) = line.split('|')[0:2]
    movies[id] = title

  #load data
  prefs={}
  for line in open('test.dat'):
    (usr, movieid, rating, ts) = line.split('\t')
    prefs.setdefault(usr, {})
    prefs[usr][movies[movieid]]=float(rating)
  return (movies, prefs)

# compute the Euclidean distance between two person's preferences
def sim_distance(prefs, person1, person2):

  #Get the list of shared items
  si = {}
  for it in prefs[person1]:
    if it in prefs[person2]:
      si[it]=1

  #if they have no ratings in common, return 0
  if (len(si) == 0): return 0

  # Add up the squares of all the differences
  euclidean_distance = sqrt(sum([pow(prefs[person1][it] - prefs[person2][it], 2) 
                    for it in si]))

  similarity = 1/(1+euclidean_distance)
  return similarity

# compute the pearson correlation coefficient
def sim_pearson(prefs, person1, person2):
 
  #Get the list of shared items
  si = {}
  for it in prefs[person1]:
    if it in prefs[person2]:
      si[it]=1
  
  # Find the number of elements
  n = len(si)

  # if they have no ratings in common, return 0
  if n==0:  return 0

  # sum
  sum1 = sum([prefs[person1][it] for it in si])
  sum2 = sum([prefs[person2][it] for it in si])

  # sum of the squares
  sum1Square = sum([pow(prefs[person1][it], 2) for it in si])
  sum2Square = sum([pow(prefs[person2][it], 2) for it in si])

  # sum up the products
  pSum = sum([prefs[person1][it]*prefs[person2][it] for it in si])

  # compute the correlation coefficient
  num = pSum - (sum1*sum2/n)
  denom = sqrt((sum1Square - pow(sum1, 2)/n)*(sum2Square - pow(sum2, 2)/n))

  if denom == 0: return 0

  pearson_correlation = num/denom

  return pearson_correlation

# return the top N most similar person/items
def topMatches(prefs, person, n=5, similarity=sim_pearson):
  scores=[(similarity(prefs, person, other), other)
             for other in prefs if other != person]

  # sort the list so the highest scores appear at the top
  scores.sort()
  scores.reverse()

  return scores[0:n]

# Get recommendations for a person by using a weighted average
# of every other user's ranking
def getRecommendations(prefs, person, similarity=sim_pearson):

  totals={}
  simSums = {}

  for other in prefs:
    toPrint = []
    # don't compare one to himself
    if other == person:
      continue

    sim = similarity(prefs, person, other)
    #print '%s\t%f\t' % (other, sim)
    toPrint.append(other)
    toPrint.append(sim)
  
    #ignore scores of zero or lower
    if sim < 0: 
      continue

    for item in prefs[other]:
      #only score movies I have not seen before
      if item not in prefs[person] or prefs[person][item]==0:
        print item
        totals.setdefault(item, 0)
        
        #simiarity * score
        totals[item] += prefs[other][item]*sim
        toPrint.append(totals[item])
        #print '%f\t' % totals[item]

        #sum of similarities
        simSums.setdefault(item, 0)
        simSums[item] += sim

    print toPrint
    for (item, total) in totals.items():
      print '%f\t' % total 
    print "\n"

  ## !! indentation
  # Create the normalized list
  rankings=[(total/(simSums[item]), item)
              for item, total in totals.items()]

  # Retrn the sorted list
  rankings.sort()
  rankings.reverse()
    
  return rankings

# main function
if __name__ == '__main__':

  movies, prefs = loadMovies()
  pp = pprint.PrettyPrinter(indent=2)
  print "List of movies are:\n"
  pp.pprint(movies)

  print "\nThe preference list is:\n"
  pp.pprint(prefs)

  recommendations = getRecommendations(prefs, '1', sim_distance)
  print recommendations
  
