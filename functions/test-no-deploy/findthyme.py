from datetime import datetime, timezone, time

meetingLength = time(1)
given = [{"start": datetime(2020, 6, 7, 12, 30, tzinfo=timezone.utc), "end": datetime(2020, 6, 7, 12, 30,  tzinfo=timezone.utc)}]

testCondition = given[0]['start']
print ('Before: ', testCondition)

testCondition = testCondition.replace(hour=12, minute=0)

print('After: ', testCondition)


meetingTimes = []

# Times to check 12PM?
# Events per day 3
# Middle out on 10am, 12pm, 2pm <=> 



findClosest(preferred, eventRange):
    # If preferred time is not located in the eventRange;
    # ex: 12 pm < 3 pm (start) or 12 pm > 11 am (end)
    # Move preferred to whichever is close -> eventRange['start'] or eventRange['end]
    if preferred < eventRange["start"] or preferred > eventRange["end"]:
        
        return None
    else:
        # Find times from middle out
        # Going iteratively from preferred --> eventRange[start] + preferred --> eventRange[end]
        return preferred
        

for eventRange in given:
    if len(meetingTimes > 10):
        break
    ### Hard Stuff ###
    
    



print(meetingTimes)
    
