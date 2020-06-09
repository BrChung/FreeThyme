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

client = firestore.client()

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
    group_cal_ref = client.collection(u'rooms/{roomID}/entire-cal/merged/calendar'.format(roomID = path_parts[1]))

    transaction = client.transaction()

    @firestore.transactional
    def find_free_time(transaction, group_cal_ref):
        freetime_list = list()
        group_cal_snapshot = group_cal_ref.get(transaction = transaction)

        if group_cal_snapshot.exists:
            # freetime start = the end of the last event
            # freetime end = the beginning of the next event
            for doc_index in range(len(group_cal_ref)):
                # if its the first event, then the start time is right now
                if doc_index == 0:
                    time_interval = {
                        'start': datetime.now(datetime.timezone.utc),
                        'end': group_cal_ref[doc_index]['start'],
                    }
                    freetime_list.append(time_interval)
                # if is the last event, then the end time is 11:59 PM of that day
                elif doc_index == (len(group_cal_ref) - 1):
                    time_interval = {
                        'start': group_cal_ref[doc_index]['end'],
                        'end': group_cal_ref[doc_index]['end'].replace(hour=11, minute=59),
                    }
                    freetime_list.append(time_interval)
                # If its in the middle calculations
                else:
                    time_interval = {
                        'start': group_cal_ref[doc_index]['end'],
                        'end': group_cal_ref[doc_index + 1]['start']
                    }
                    freetime_list.append(time_interval)
            return freetime_list

    freetime = find_free_time(transaction, group_cal_ref)

    client.document(u'rooms/{roomID}/entire-cal/freetime'.format(roomID = path_parts[1])).set({"calendar": freetime})
