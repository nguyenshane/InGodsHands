


#define encoder0PinA 2

#define encoder0PinB 3

volatile unsigned int encoder0Pos = 0;

void setup() {

  pinMode(encoder0PinA, INPUT); 
  digitalWrite(encoder0PinA, HIGH);
  pinMode(encoder0PinB, INPUT); 
  digitalWrite(encoder0PinB, HIGH);
// encoder pin on interrupt 0 (pin 2)

  attachInterrupt(0, doEncoderA, CHANGE);
// encoder pin on interrupt 1 (pin 3)

  attachInterrupt(1, doEncoderB, CHANGE); 
  Keyboard.begin();
  Serial.begin (300);
}

void loop(){  
  if(digitalRead(encoder0PinA)==LOW){
    //Send an ASCII 'D', 
    //Keyboard.write('d');
  }
  if(digitalRead(encoder0PinB)==LOW){
    //Send an ASCII 'S', 
    //Keyboard.write('s');
  }

}

void doEncoderA(){
  Serial.println("A");
  // look for a low-to-high on channel A
  if (digitalRead(encoder0PinA) == HIGH) { 
    // check channel B to see which way encoder is turning
    if (digitalRead(encoder0PinB) == LOW) {  
      encoder0Pos = encoder0Pos + 1;         // CW
      Keyboard.write('d');
    } 
    else {
      encoder0Pos = encoder0Pos - 1;         // CCW
      Keyboard.write('s');
    }
  }
  else   // must be a high-to-low edge on channel A                                       
  { 
    // check channel B to see which way encoder is turning  
    if (digitalRead(encoder0PinB) == HIGH) {   
      encoder0Pos = encoder0Pos + 1;          // CW
      Keyboard.write('d');
    } 
    else {
      encoder0Pos = encoder0Pos - 1;          // CCW
      Keyboard.write('s');
    }
  }
  Serial.println (encoder0Pos, DEC);          
  // use for debugging - remember to comment out
}

void doEncoderB(){
  Serial.println("B");
  
  // look for a low-to-high on channel B
  if (digitalRead(encoder0PinB) == HIGH) {   
   // check channel A to see which way encoder is turning
    if (digitalRead(encoder0PinA) == HIGH) {  
      encoder0Pos = encoder0Pos + 1;         // CW
      Keyboard.write('d');
    } 
    else {
      encoder0Pos = encoder0Pos - 1;         // CCW
      Keyboard.write('s');
    }
  }
  // Look for a high-to-low on channel B
  else { 
    // check channel B to see which way encoder is turning  
    if (digitalRead(encoder0PinA) == LOW) {   
      encoder0Pos = encoder0Pos + 1;          // CW
      Keyboard.write('d');
    } 
    else {
      encoder0Pos = encoder0Pos - 1;          // CCW
      Keyboard.write('s');
    }
  }
  Serial.println (encoder0Pos, DEC);    
}
