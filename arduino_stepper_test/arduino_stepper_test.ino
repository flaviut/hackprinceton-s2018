#include <Stepper.h>

#define STEPS 32

Stepper stepperLock(STEPS, 9, 11, 8, 10);
Stepper stepperUnlock(STEPS, 8, 10, 9, 11);
int val = 600;

void lock() {
  stepperLock.step(val);
}

void unlock() {
  stepperUnlock.step(val);
}

void setup() {
  Serial.begin(115200);
  stepperLock.setSpeed(500);
  stepperUnlock.setSpeed(500);

}

void loop() {
  int action = Serial.parseInt();
  if(action == 1) {
    lock();
  } else if (action == 2) {
    unlock();
  }
}

