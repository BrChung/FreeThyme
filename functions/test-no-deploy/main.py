# With a given list of free time ranges, desired meeting length, preferred times
# Return a list of 3 free times per day with as much preferred times as possible

# If no preferred time is found, then find the time within the free time range closest to the preferred,
# If there are no free time ranges, check the events with the least amount of overlap

'''
Use Cases:

ASSUMES: desiredMeetingLength is 1 hour
    [1]
    - A free time range could be entirely free
    ex: Free time range: [July 9th, 8:00 AM - July 9th, 10:00 PM]

    [2]
    - A free time range could only have one suggested time
    ex: Free time range: [July 9th, 8:30 AM - July 9th, 9:30 AM]
    ex: Free time range: [July 9th, 8:00 AM - July 9th, 9:30 AM]

    [3]
    - A free time range could be divided into smaller free time ranges
    ex: Free time range: [{July 9th, 8:30 AM- 11:30 AM}, {July 9th, 4:00 PM - 10:00 PM}]

    [4]
    - A free time range doesn't exist
    ex: Free time range: []
'''

from datetime import datetime, time,timezone

# ALL giventimes are represented as a datetime object with tz = utc
# Use Case 1:
givenTime1 = [
    {'start': datetime(2020, 7, 10, 8, tzinfo=timezone.utc),
        'end': datetime(2020, 7, 10, 22, tzinfo=timezone.utc)
    }
    ]

# Use Case 2:
givenTime2 = [
    {'start': datetime(2020, 7, 10, 8, 30, tzinfo=timezone.utc),
        'end': datetime(2020, 7, 10, 9, 30, tzinfo=timezone.utc)
    },
    {'start': datetime(2020, 7, 10, 8, tzinfo=timezone.utc),
        'end': datetime(2020, 7, 10, 9, 30, tzinfo=timezone.utc)
    }
    ]

# Use Case 3:
givenTime3 = [
    {'start': datetime(2020, 7, 10, 8, tzinfo=timezone.utc),
        'end': datetime(2020, 7, 10, 22, tzinfo=timezone.utc)
    }
    ]
# Use Case 4:
givenTime4 = []

# Our preferred times are ideally 10am - 2pm
PREFERRED_TIMES = [time(10), time(14)]

# 1 hour meeting
MEETING_LENGTH = time(1)

def main():
    '''
    suggestions1 = suggestMeetingTimes(givenTime1, MEETING_LENGTH)
    print("expected: ")
    print("received: ", suggestions1)

    suggestions2 = suggestMeetingTimes(givenTime2, MEETING_LENGTH)
    print("expected: ")
    print("received: ", suggestions2)

    suggestions3 = suggestMeetingTimes(givenTime3, MEETING_LENGTH)
    print("expected: ")
    print("received: ", suggestions3)

    suggestions4 = suggestMeetingTimes(givenTime4, MEETING_LENGTH)
    print("expected: ")
    print("received: ", suggestions4)
    '''
    print(givenTime1[0]['start'].date())

def suggestMeetingTimes(givenFreeTime, meetingLength):
    # Each day has a limit of 3 suggested times
    currentDaySuggestedCount = 0
    currentDay = date()
    suggestedtimes = []

    # If there is no free time range,
    # then check the least busiest days
    if (givenFreeTime):
        pass
    else:
        # pass
        for freeTimeRange in givenFreeTime:
            # Check if the time range is still within the same day:
            # If it's a new day, then change the currentDay and reset the currentDaySuggestedCount
            if currentDay != freeTimeRange['start'].date():
                currentDay = freeTimeRange['start'].date()
                currentDaySuggestCount = 0
            elif currentDay == freeTimeRange['start'].date():
            # If the time range is still within the same day,
            # then check if the daySuggestedCount < 3
                # If the daySuggestedCount < 3,
                # then try adding the preferred times

                    # [HARD PART] If you cannot add preferred time, try adding the nearest time
                    # increment the daySuggestCount


                currentDaySuggestedCount += 1
                if currentDaySuggestedCount < 3:

                # else: move on to next time range
                else:
                    continue
if __name__ == "__main__":
    main()
