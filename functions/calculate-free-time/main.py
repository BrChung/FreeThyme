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
from datetime import datetime, timedelta

client = firestore.Client()

def find_free_time(busy_times, meetingLength):
    freetime_list = list()

    meetingLengthDelta = timedelta(minutes=meetingLength)
    print(meetingLengthDelta)
    # freetime start = the end of the last event
    # freetime end = the beginning of the next event
    for eventIndex in range(len(busy_times)):

        # We calculate intervals between events, therefore we don't need to calculate the last one
        if (eventIndex + 1 != len(busy_times)):
            # Calculate time in between events
            timeDelta = busy_times[eventIndex + 1]['start'] - busy_times[eventIndex]['end']
            print("Test: ", timeDelta, " vs ", meetingLengthDelta )

            # This means that the calculated free time interval is greater than the desired meeting length
            if (timeDelta > meetingLengthDelta):
                time_interval = {
                    'start': busy_times[eventIndex]['end'],
                    'end': busy_times[eventIndex + 1]['start']
                }
                freetime_list.append(time_interval)

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
    group_cal_ref = client.document(u'rooms/{roomID}/entire-cal/merged'.format(roomID = path_parts[1]))
    room_info_snapshot = client.document(u'rooms/{roomID}'.format(roomID = path_parts[1])).get()

    room_info_data = room_info_snapshot.to_dict()

    # transaction = client.transaction()
    # print("just created a transaction theoreotically")

    # @firestore.transactional
    def set_freetime(group_cal_ref, room_info_data):
        group_cal_snapshot = group_cal_ref.get()
        data = group_cal_snapshot.to_dict()

        if group_cal_snapshot.exists:
            print("I'm in the snapshot transaction function WOO!!!")
            freetime = find_free_time(data["events"], room_info_data['meetingLength'])
            print("here is the freetime list")
            client.document(u'rooms/{roomID}/entire-cal/freetime'.format(roomID = path_parts[1])).set({"events": freetime})
            print("boom just added to the database beeotches")


    set_freetime(group_cal_ref, room_info_data)
