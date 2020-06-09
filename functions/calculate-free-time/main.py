'''
 PURPOSE:
    -This file is responsible for getting suggesting meeting times in the group calendars based on
     remaining free time in the group calendar and the meetingLength defined in the group calendar room
 ARGS:
    - meetingLength /rooms/{roomid}/meetingLength
    - mergedCalendar /rooms/{roomid}/calendar
 DEPLOY:

'''
from google.cloud import firestore
import datetime
client = firestore.client()


def calculate_free_time(data, context):
    ''' TRIGGERED by a change to the mergedCalendar (room calendar)
        ARGS:
            - data (dict): the event payload
            - context (google.cloud.functions.Context): Metadata for the event
    '''

    '''
        0 = rooms
        1 = {roomid}
        2 = calendars
        3 = {uid}
    '''
    path_parts = context.resource.split('/documents/')[1].split('/')

    # Make a Reference to the group calendar, contains
    group_cal_ref = client.collection(u'rooms/{roomID}/entire-cal/merged/calendar'.format(roomID = path_parts[1]))

    # # Make a Reference to the meetingLength
    # meetingLength_ref = client.collection(u'rooms/{roomID}/meetingLength'.format(roomID = path_parts[1]))

    # group_cal_query = group_cal_ref.limit(100)

    # We need a start date to have a comparison
    # for the free time range before their first busy event
    startDate = datetime.now()

    # End date to use as comparison to calculate free time range after
    # their last busy event
    endDate = datetime.now()

    for doc in group_cal_query:



    client.document(u'rooms/{roomID}/entire-cal/freetime'.format(roomID = path_parts[1])).set({"calendar": freetime})
