import datetime

# Given a set of time intervals, design an algorithm to figure out
# the interval where they overlap and the # of intervals that are in that overlap

# An event has the "'start'" time, "'end'" time, and "amount" of events in that intersection
# An event that has an amount of 0, means that from the 'start' to 'end', there are no overlapping times

#=========== SIMPLE TEST CASES: Two Events ===========#
eventList0 = [
    {'start': 0, 'end': 4, 'weight':5},
    {'start': 1, 'end': 6, 'weight':10},
]

# Test Case where events overlap partially
eventList1 = [
    {'start': datetime.datetime(2020,6,5,10,0,0,0), 'end': datetime.datetime(2020,6,5,11,0,0,0)},
    {'start': datetime.datetime(2020,6,5,10,30,0,0), 'end': datetime.datetime(2020,6,5,11,30,0,0)},
    {'start': datetime.datetime(2020,6,5,10,45,0,0), 'end': datetime.datetime(2020,6,5,11,45,0,0)},

]

# Desired Output:
# {'start': 2, 'end': 3, amount: 2}


# Test Case where events are completely overlapped
eventList2 = [
    {'start': datetime.datetime(2020,6,5,10,0,0,0), 'end': datetime.datetime(2020,6,5,11,0,0,0)},
    {'start': datetime.datetime(2020,6,5,11,0,0,0), 'end': datetime.datetime(2020,6,5,11,30,0,0)},
]

# Desired Output:
# {'start': 1, 'end': 2, amount: 2}

# Test Case where no events overlap
eventList3 = [
  {'start': 1, 'end': 3},
  {'start': 3, 'end': 6}
]

# Desired Output:
# {'start': 1, 'end': 6, amount: 0}


def findOverlap(eventList):
    intervalList = []
    intervalCounterList = list()
    eventCounter = 0

    for event in eventList:
        intervalList.append((event['start'], 's'))
        intervalList.append((event['end'], 'e'))

    intervalList.sort()
    for index in range(len(intervalList)):
        # We do not need to calculate the interval for the very end of the list
        # We do not need to calculate the interval if the start and end times are the same
        if (index == len(intervalList) - 1):
            return intervalCounterList
        if 's' in intervalList[index]:
            eventCounter += 1
            timeInterval = {
                'start': intervalList[index][0],
                'end': intervalList[index + 1][0],
                'eventCounter': eventCounter
            }
            if(timeInterval['start'] != timeInterval['end']):
                intervalCounterList.append(timeInterval)

        elif 'e' in intervalList[index]:
            eventCounter -= 1
            timeInterval = {
                'start': intervalList[index][0],
                'end': intervalList[index + 1][0],
                'eventCounter': eventCounter
            }
            if(timeInterval['start'] != timeInterval['end']):
                intervalCounterList.append(timeInterval)

    return intervalCounterList

test = findOverlap(eventList1)
print(test)


'''
Weighted Merge - deprecated
Reason: O(n^2) algo, will be costly to scale
'''
def findWeightedMerge(data):
    result = list()
    times = list()

    for event in data:
        times.append(event["start"])
        times.append(event["end"])
    times = list(dict.fromkeys(times))
    times.sort()

    for i in range(0, len(times)-1):
        result.append({"start": times[i], "end": times[i+1]})

    for item in result:
        weight = 0
        for event in data:
            if item["start"] >= event["start"] and item["start"] < event["end"]:
                weight += event["weight"]
        item["weight"] = weight

    return result

arr = [{"start": 0, "end": 4, "weight": 5},
       {"start": 1, "end": 6, "weight": 10}]

print(findWeightedMerge(arr))
