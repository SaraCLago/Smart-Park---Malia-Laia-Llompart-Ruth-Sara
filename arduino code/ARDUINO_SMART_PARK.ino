#include <SimpleWebSerial.h>

SimpleWebSerial WebSerial;
int Ldr[] = {A0, A1, A2, A3};  // LDR sensors
int GreenLeds[] = {8, 6, 4, 10};  // Green LEDs (free parking)
int RedLeds[] = {9, 7, 5, 11};  // Red LEDs (occupied parking)

int threshold = 20;  // Threshold for sensor response
int sensorValue;

void setup() {
  Serial.begin(9600);

  // Configure LEDs
  for (int i = 0; i < 4; i++) {
    pinMode(GreenLeds[i], OUTPUT);
    pinMode(RedLeds[i], OUTPUT);
  }
}

void loop() {
  for (int i = 0; i < 4; i++) {
    sensorValue = analogRead(Ldr[i]);  // Read LDR sensor value
    delay(10);  // Short delay for stability
    
    Serial.print("Sensor ");
    Serial.print(i);   
    Serial.print(" Value: ");
    Serial.println(sensorValue);

    // Create parking identifier string
    String parking = "parking" + String(i);  // Convert i to string for concatenation

    // Check if the parking spot is occupied
    if (sensorValue > threshold) {
      // Send message that the parking is occupied
      WebSerial.send(parking.c_str(), "true");
      digitalWrite(GreenLeds[i], LOW);  // Turn off the green LED
      digitalWrite(RedLeds[i], HIGH);  // Turn on the red LED
    } else {
      // Send message that the parking is free
      WebSerial.send(parking.c_str(), "false");
      digitalWrite(RedLeds[i], LOW);  // Turn off the red LED
      digitalWrite(GreenLeds[i], HIGH);  // Turn on the green LED
    }
  }
  Serial.println("-------------------");  // Separator for readability
  delay(500);  // General delay
}