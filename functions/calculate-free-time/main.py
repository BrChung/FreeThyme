'''
 PURPOSE:
    -This file is responsible for getting suggesting meeting times in the group calendars based on
     remaining free time in the group calendar and the meetingLength defined in the group calendar room
 ARGS:
    - meetingLength /rooms/{roomid}/meetingLength
    - mergedCalendar /rooms/{roomid}/calendar
 DEPLOY:
    - gcloud functions deploy calculate_free_time --runtime python37 --trigger-event providers/cloud.firestore/eventTypes/document.write --trigger-resource "projects/freethyme-269222/databases/(default)/documents/rooms/{roomID}/entire-cal/merged"
'''
from google.cloud import firestore
from datetime import datetime

client = firestore.Client()

def find_free_time(busy_times):
    freetime_list = list()
    # freetime start = the end of the last event
    # freetime end = the beginning of the next event
    for eventIndex in range(len(busy_times)):
        # if its the first event, then the start time is right now
        if eventIndex == 0:
            time_interval = {
                'start': datetime.now(datetime.timezone.utc),
                'end': busy_times[eventIndex]['start'],
            }
            print("edge case: just added the first time inteval haha", time_interval)
            freetime_list.append(time_interval)
        # if is the last event, then the end time is 11:59 PM of that day
        elif eventIndex == (len(busy_times) - 1):
            time_interval = {
                'start': busy_times[eventIndex]['end'],
                'end': busy_times[eventIndex]['end'].replace(hour=11, minute=59),
            }
            print("edge case: just added the last time inteval haha", time_interval)
            freetime_list.append(time_interval)
        # If its in the middle calculations
        else:
            time_interval = {
                'start': busy_times[eventIndex]['end'],
                'end': busy_times[eventIndex + 1]['start']
            }
            print("normal case: just found the time in between events interval haha", time_interval)
            freetime_list.append(time_interval)
    print("aha yo here's the freetime_list", freetime_list)
    return freetime_list

def calculate_free_time(data, context):
    ''' TRIGGERED by a change to the mergedCalendar (room calendar)
        ARGS:
            - data (dict): the event payload
            - context (google.cloud.functions.Context): Metadata for the event
        0 = rooms
        1 = {roomid}
        2 = calendars
        3 = {uid}
    '''
    path_parts = context.resource.split('/documents/')[1].split('/')

    # Make a Reference to the group calendar, contains
    group_cal_ref = client.docuemnt(u'rooms/{roomID}/entire-cal/merged'.format(roomID = path_parts[1]))

    transaction = client.transaction()
    print("just created a transaction theoreotically")
    @firestore.transactional
    def set_freetime(transaction, group_cal_ref):
        group_cal_snapshot = group_cal_ref.get(transaction = transaction)
        data = group_cal_snapshot.to_dict()

        if group_cal_snapshot.exists:
            print("I'm in the snapshot transaction function WOO!!!")
            freetime = find_free_time(data["events"])
            print("here is the freetime list")
            client.document(u'rooms/{roomID}/entire-cal/freetime'.format(roomID = path_parts[1])).set({"events": freetime})
            print("boom just added to the database beeotches")


    set_freetime(transaction, group_cal_ref)
