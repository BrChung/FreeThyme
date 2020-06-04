from google.cloud import firestore
import json
client = firestore.Client()

# Updates the top 5 users added to /rooms/{roomID}/users/{uid} on room details
def room_user(data, context):
    """ Triggered by a change to a Firestore document.
    Args:
        data (dict): The event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    trigger_resource = context.resource

    print('Function triggered by change to: %s' % trigger_resource)

    print('\nNew value:')
    print(json.dumps(data["value"]))

