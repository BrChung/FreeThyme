from google.cloud import firestore
client = firestore.Client()

'''
Purpose:
    - Queries up to 100 calendars written to /rooms/{roomID}/calendars/{uid} to and writes the merged calendar to the room document.
Deploy:
    - gcloud functions deploy merge_calendar --runtime python37 --trigger-event providers/cloud.firestore/eventTypes/document.write --trigger-resource "projects/freethyme-269222/databases/(default)/documents/rooms/{roomID}/calendars/{uid}"
'''

def find_overlap(event_list):
    """ Finds the union of all busy times and also tracks the count of overlaping events.
    Args:
        - event_list (list): The list of all events
    """
    interval_list = []
    interval_counter_list = list()
    count = 0

    for event in event_list:
        interval_list.append((event['start'], 's'))
        interval_list.append((event['end'], 'e'))

    interval_list.sort()
    for index in range(len(interval_list)):
        # We do not need to calculate the interval for the very end of the list
        # We do not need to calculate the interval if the start and end times are the same
        if (index == len(interval_list) - 1):
            return interval_counter_list
        if 's' in interval_list[index]:
            count += 1
            time_interval = {
                'start': interval_list[index][0],
                'end': interval_list[index + 1][0],
                'count': count
            }
            if(time_interval['start'] != time_interval['end']):
                interval_counter_list.append(time_interval)

        elif 'e' in interval_list[index]:
            count -= 1
            time_interval = {
                'start': interval_list[index][0],
                'end': interval_list[index + 1][0],
                'count': count
            }
            if((time_interval['start'] != time_interval['end']) and (time_interval["count"] > 0)):
                interval_counter_list.append(time_interval)

    return interval_counter_list

def merge_calendar(data, context):
    """ TRIGGERED by a change to a "calendars" document. Whenever a calendar is added, updated, or removed.
    ARGS:
        data (dict): The event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """

    path_parts = context.resource.split('/documents/')[1].split('/')

    calendar_collection_ref = client.collection(u'rooms/{roomID}/calendars'.format(roomID = path_parts[1]))

    calendar_query = calendar_collection_ref.limit(100)
    calendar_docs = calendar_query.stream()

    all_events = list()

    for doc in calendar_docs:
        data = doc.to_dict()
        all_events.extend(data["events"] if "events" in data else [])
        all_events.extend(data["ft_events"] if "ft_events" in data else [])

    merged_cal = find_overlap(all_events)

    room_doc_snapshot = client.document(u'rooms/{roomID}'.format(roomID = path_parts[1])).get()
    if(room_doc_snapshot.exists):
        client.document(u'rooms/{roomID}/entire-cal/merged'.format(roomID = path_parts[1])).set({"events": merged_cal})
