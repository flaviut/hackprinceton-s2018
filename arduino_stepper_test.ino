#include <Stepper.h>

#define STEPS 32

Stepper stepper(STEPS, 8, 10, 9, 11);
int val = 60;

void setup() {
  Serial.begin(9600);
  stepper.setSpeed(500);
}

void loop() {
  //    val = Serial.parseInt();
  stepper.step(val);
  Serial.println(val);
}

