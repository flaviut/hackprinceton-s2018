#include <Stepper.h>

#define STEPS 32

Stepper stepperLock(STEPS, 9, 11, 8, 10);
Stepper stepperUnlock(STEPS, 8, 10, 9, 11);
int val = 512;

void lock() {
  stepperLock.step(val);
}

void unlock() {
  stepperUnlock.step(val);
}

void setup() {
  Serial.begin(9600);
  stepperLock.setSpeed(500);
  stepperUnlock.setSpeed(500);

  lock();
  
  unlock();
  
  lock();
  
  unlock();
}

void loop() {
  //    val = Serial.parseInt();
//  stepper.step(val);
  Serial.println(val);
}

