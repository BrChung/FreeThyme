from google.cloud import firestore
client = firestore.Client()

'''
Purpose: Queries and stores the top 5 users written to /rooms/{roomID}/users/{uid} to room document.
    Client does not need to query members collection or read multiple docs
Deploy:
gcloud functions deploy room_user --runtime python37 --trigger-event providers/cloud.firestore/eventTypes/document.write --trigger-resource "projects/freethyme-269222/databases/(default)/documents/rooms/{roomID}/members/{uid}"
'''
def room_user(data, context):
    """ Triggered by a change to a member document.
    Args:
        data (dict): The event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """

    if(data["oldValue"] and data["value"]):
        # A Member doc has been updated
        old_data = data["oldValue"]["fields"]
        new_data = data["value"]["fields"]

        try:
            del old_data["favorite"]
            del old_data["lastAccessed"]
            del new_data["favorite"]
            del new_data["lastAccessed"]
        except KeyError:
            print("Error: Keys were not found")

        # Only favorite or lastAccessed fields were altered, no need to continue function
        if(old_data == new_data):
            return


    transaction = client.transaction()

    path_parts = context.resource.split('/documents/')[1].split('/')

    room_ref = client.collection(u'rooms').document(path_parts[1])
    member_collection_ref = client.collection(u'rooms/{roomID}/members'.format(roomID = path_parts[1]))
    member_ref = member_collection_ref.document(path_parts[3])

    # Create Combined Index for Member
    @firestore.transactional
    def update_combined_index(transaction, member_ref):
        member_snapshot = member_ref.get(transaction=transaction)

        if member_snapshot.exists:
            roles = member_snapshot.get("roles")
            if roles["admin"]: index = 1
            elif roles["member"]: index = 2
            else: index = 3
            transaction.update(member_ref, {
                u'combined': '{idx}_{name}.'.format(idx = index, name = member_snapshot.get("nickname"))
            })

    # Update Room Details with Top 5 Members
    @firestore.transactional
    def update_room(transaction, room_ref):
        room_snapshot = room_ref.get(transaction=transaction)

        if(room_snapshot.exists):
            member_query = member_collection_ref.order_by('combined').limit(5)
            member_docs = member_query.stream()
            member_data = list()
            profile_images = dict()
            for doc in member_docs:
                member_data.append(doc.to_dict())
                user_ref = client.collection('users').document(doc.id)
                user_doc = user_ref.get()
                if user_doc.exists:
                    profile_images[doc.id] = user_doc.get('photoURL')
            print(member_data)
            transaction.update(room_ref, {
                u'members': member_data,
                u'profileImages': profile_images
            })
            return True;
        else:
            return False;

    update_combined_index(transaction, member_ref)
    result = update_room(transaction, room_ref)

    if result:
        return;
    else:
        print('Room (ID: {}) no longer exists'.format(path_parts[1]))