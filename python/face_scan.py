import pprint
import time

import cognitive_face as CF
import cv2

from connect import MotorController

subscription_key = "22c83acf03654264809ff64693f7dd99"
base_url = "https://eastus.api.cognitive.microsoft.com/face/v1.0"

frame_count = 0;

CF.Key.set(subscription_key)
CF.BaseUrl.set(base_url)

# img_url = "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png"

capture = cv2.VideoCapture(0)
mc = MotorController()
state, last_change = "locked", time.time()


def check_face(img):
    results = CF.face.detect(img)
    person_groups = CF.person_group.lists()

    face_ids = []
    identify_confidence = None
    confidence = None

    if results:
        face_ids = [result['faceId'] for result in results]
        identify_confidence = CF.face.identify(face_ids=face_ids,
                                               person_group_id='lockpeople')

    if identify_confidence:
        candidates = identify_confidence[0]['candidates']

        if candidates:
            confidence = candidates[0]['confidence']

    global last_change, state

    if confidence and confidence > .50:
        print("should be unlocked")
        last_change = time.time()
        if state == 'locked':
            print("unlocking")
            state = 'unlocked'
            mc.unlock()
    else:
        if (time.time() - last_change) > 15 and state == 'unlocked':
            print("lock timeout")
            state = 'locked'
            mc.lock()

    print(face_ids, confidence)


if __name__ == '__main__':
    while True:
        ret, frame = capture.read()

        color_image = cv2.cvtColor(frame, cv2.IMREAD_COLOR)

        cv2.imshow('frame', color_image)

        if frame_count >= 60:
            frame_count = 0

            cv2.imwrite('capture.png', color_image)

            with open('capture.png', 'rb') as img:
                check_face(img)

        frame_count += 1

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    capture.release()

    # with open('capture.png', 'rb') as img:
    #     check_face(img)
