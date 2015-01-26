#include <PinChangeInt.h>

/* interrupt routine for Rotary Encoders
   tested with Noble RE0124PVB 17.7FINB-24 http://www.nobleusa.com/pdf/xre.pdf - available at pollin.de
   and a few others, seems pretty universal

   The average rotary encoder has three pins, seen from front: A C B
   Clockwise rotation A(on)->B(on)->A(off)->B(off)
   CounterCW rotation B(on)->A(on)->B(off)->A(off)

   and may be a push switch with another two pins, pulled low at pin 8 in this case
   raf@synapps.de 20120107

*/

// usually the rotary encoders three pins have the ground pin in the middle
enum PinAssignments {
  encoderPinA_T = 2,
  encoderPinB_T = 3,
  
  encoderPinA_A = 4,
  encoderPinB_A = 5,
  
  encoderPinA_P = 6,
  encoderPinB_P = 7,
  
  encoderPinA_E = 8,
  encoderPinB_E = 9,
  
  encoderPinA_W = 15,
  encoderPinB_W = 16,
  
  clearButton = 14
};

volatile unsigned int encoderPos_T = 100;  // a counter for T
volatile unsigned int encoderPos_A = 100;  // a counter for A
volatile unsigned int encoderPos_P = 100;  // a counter for P
volatile unsigned int encoderPos_E = 100;  // a counter for Evv
volatile unsigned int encoderPos_W = 100;  // a counter for W

unsigned int lastReportedPos_T = 101;   // change management for T
unsigned int lastReportedPos_A = 101;   // change management for A
unsigned int lastReportedPos_P = 101;   // change management for P
unsigned int lastReportedPos_E = 101;   // change management for E
unsigned int lastReportedPos_W = 101;   // change management for W

static boolean rotating_T = false;      // debounce management for T
static boolean rotating_A = false;      // debounce management for A
static boolean rotating_P = false;      // debounce management for P
static boolean rotating_E = false;      // debounce management for E
static boolean rotating_W = false;      // debounce management for W


// interrupt service routine vars
boolean A_set_T = false;              
boolean B_set_T = false;
boolean A_set_A = false;              
boolean B_set_A = false;
boolean A_set_P = false;              
boolean B_set_P = false;
boolean A_set_E = false;              
boolean B_set_E = false;
boolean A_set_W = false;              
boolean B_set_W = false;

// KeyCommand
void keyCommand(uint8_t modifiers, uint8_t keycode1, uint8_t keycode2 = 0, uint8_t keycode3 = 0, 
                uint8_t keycode4 = 0, uint8_t keycode5 = 0, uint8_t keycode6 = 0) {
  Serial.write(0xFD);       // Adafruit command
  Serial.write(modifiers);  // modifier!
  Serial.write((byte)0x00); // 0x00  
  Serial.write(keycode1);   // key code #1
  Serial.write(keycode2); // key code #2
  Serial.write(keycode3); // key code #3
  Serial.write(keycode4); // key code #4
  Serial.write(keycode5); // key code #5
  Serial.write(keycode6); // key code #6
  
}

void setup() {

  pinMode(encoderPinA_T, INPUT); 
  pinMode(encoderPinB_T, INPUT); 
  pinMode(encoderPinA_A, INPUT); 
  pinMode(encoderPinB_A, INPUT); 
  pinMode(encoderPinA_P, INPUT); 
  pinMode(encoderPinB_P, INPUT); 
  pinMode(encoderPinA_W, INPUT); 
  pinMode(encoderPinB_W, INPUT); 
  
  pinMode(clearButton, INPUT);
  
 // turn on pullup resistors
  digitalWrite(encoderPinA_T, HIGH);
  digitalWrite(encoderPinB_T, HIGH);
  digitalWrite(encoderPinA_A, HIGH);
  digitalWrite(encoderPinB_A, HIGH);
  digitalWrite(encoderPinA_P, HIGH);
  digitalWrite(encoderPinB_P, HIGH);
  digitalWrite(encoderPinA_E, HIGH);
  digitalWrite(encoderPinB_E, HIGH);
  digitalWrite(encoderPinA_W, HIGH);
  digitalWrite(encoderPinB_W, HIGH);
  
  digitalWrite(clearButton, HIGH);

// encoder pin on interrupt
  attachPinChangeInterrupt(encoderPinA_T, doEncoderA_T, CHANGE);
  attachPinChangeInterrupt(encoderPinB_T, doEncoderB_T, CHANGE);
  
  attachPinChangeInterrupt(encoderPinA_A, doEncoderA_A, CHANGE);
  attachPinChangeInterrupt(encoderPinB_A, doEncoderB_A, CHANGE);
  
  attachPinChangeInterrupt(encoderPinA_P, doEncoderA_P, CHANGE);
  attachPinChangeInterrupt(encoderPinB_P, doEncoderB_P, CHANGE);
  
  attachPinChangeInterrupt(encoderPinA_E, doEncoderA_E, CHANGE);
  attachPinChangeInterrupt(encoderPinB_E, doEncoderB_E, CHANGE);
  
  attachPinChangeInterrupt(encoderPinA_W, doEncoderA_W, CHANGE);
  attachPinChangeInterrupt(encoderPinB_W, doEncoderB_W, CHANGE);
  //Keyboard.begin();

  Serial.begin(9600);  // output
}

// main loop, work is done by interrupt service routines, this one only prints stuff
void loop() { 
  rotating_T = true;  // reset the debouncer
  rotating_A = true;  // reset the debouncer
  rotating_P = true;  // reset the debouncer
  rotating_E = true;  // reset the debouncer
  rotating_W = true;  // reset the debouncer

  if (lastReportedPos_T != encoderPos_T) {
    //Serial.print("T_Index:");
    //Serial.println(encoderPos_T, DEC);
    if(lastReportedPos_T > encoderPos_T) { Serial.print("a"); }//keyCommand(0,4); keyCommand(0,0);}
    if(lastReportedPos_T < encoderPos_T) { Serial.print("d"); }//keyCommand(0,7); keyCommand(0,0);}
    lastReportedPos_T = encoderPos_T;
  }//else keyCommand(0,0); 
  
  if (lastReportedPos_A != encoderPos_A) {
    //Serial.print("A_Index:");
    //Serial.println(encoderPos_A, DEC);
    if(lastReportedPos_A > encoderPos_A) { Serial.print("w"); }//keyCommand(0,26); keyCommand(0,0);}
    if(lastReportedPos_A < encoderPos_A) { Serial.print("s"); }//keyCommand(0,22); keyCommand(0,0);}
    lastReportedPos_A = encoderPos_A;
  }//else keyCommand(0,0); 

  if (lastReportedPos_P != encoderPos_P) {
    //Serial.print("P_Index:");
    //Serial.println(encoderPos_P, DEC);
    if(lastReportedPos_P > encoderPos_P) { Serial.print("j"); }//keyCommand(0,13); keyCommand(0,0);}
    if(lastReportedPos_P < encoderPos_P) { Serial.print("l"); }//keyCommand(0,15); keyCommand(0,0);}
    lastReportedPos_P = encoderPos_P;
  }//else keyCommand(0,0); 
  
  if (lastReportedPos_E != encoderPos_E) {
    //Serial.print("E_Index:");
    //Serial.println(encoderPos_E, DEC);
    if(lastReportedPos_E > encoderPos_E) { Serial.print("i"); }//keyCommand(0,12); keyCommand(0,0);}
    if(lastReportedPos_E < encoderPos_E) { Serial.print("k"); }//keyCommand(0,14); keyCommand(0,0);}
    lastReportedPos_E = encoderPos_E;
  }//else keyCommand(0,0); 
  
  if (lastReportedPos_W != encoderPos_W) {
    //Serial.print("W_Index:");
    //Serial.println(encoderPos_W, DEC);
    if(lastReportedPos_W > encoderPos_W) { Serial.print("v"); }//keyCommand(0,25); keyCommand(0,0);}
    if(lastReportedPos_W < encoderPos_W) { Serial.print("n"); }//keyCommand(0,17); keyCommand(0,0);}
    lastReportedPos_W = encoderPos_W;
  }//else keyCommand(0,0); 
  
  
  if (digitalRead(clearButton) == LOW )  {
    encoderPos_T = encoderPos_A = encoderPos_P = encoderPos_E = encoderPos_W = 0;
  }
  

}

// Interrupt on A changing state
void doEncoderA_T(){
  // debounce
  if ( rotating_T ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change? 
  if( digitalRead(encoderPinA_T) != A_set_T ) {  // debounce once more
    A_set_T = !A_set_T;

    // adjust counter + if A leads B
    if ( A_set_T && !B_set_T ) 
      encoderPos_T += 1;

    rotating_T = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB_T(){
  if ( rotating_T ) delay (1);
  if( digitalRead(encoderPinB_T) != B_set_T ) {
    B_set_T = !B_set_T;
    //  adjust counter - 1 if B leads A
    if( B_set_T && !A_set_T ) 
      encoderPos_T -= 1;

    rotating_T = false;
  }
}


// Interrupt on A changing state
void doEncoderA_A(){
  // debounce
  if ( rotating_A ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change? 
  if( digitalRead(encoderPinA_A) != A_set_A ) {  // debounce once more
    A_set_A = !A_set_A;

    // adjust counter + if A leads B
    if ( A_set_A && !B_set_A ) 
      encoderPos_A += 1;

    rotating_A = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB_A(){
  if ( rotating_A ) delay (1);
  if( digitalRead(encoderPinB_A) != B_set_A ) {
    B_set_A = !B_set_A;
    //  adjust counter - 1 if B leads A
    if( B_set_A && !A_set_A ) 
      encoderPos_A -= 1;

    rotating_A = false;
  }
}


// Interrupt on A changing state
void doEncoderA_P(){
  // debounce
  if ( rotating_P ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change? 
  if( digitalRead(encoderPinA_P) != A_set_P ) {  // debounce once more
    A_set_P = !A_set_P;

    // adjust counter + if A leads B
    if ( A_set_P && !B_set_P ) 
      encoderPos_P += 1;

    rotating_P = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB_P(){
  if ( rotating_P ) delay (1);
  if( digitalRead(encoderPinB_P) != B_set_P ) {
    B_set_P = !B_set_P;
    //  adjust counter - 1 if B leads A
    if( B_set_P && !A_set_P ) 
      encoderPos_P -= 1;

    rotating_P = false;
  }
}

// Interrupt on A changing state
void doEncoderA_E(){
  // debounce
  if ( rotating_E ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change? 
  if( digitalRead(encoderPinA_E) != A_set_E ) {  // debounce once more
    A_set_E = !A_set_E;

    // adjust counter + if A leads B
    if ( A_set_E && !B_set_E ) 
      encoderPos_E += 1;

    rotating_E = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB_E(){
  if ( rotating_E ) delay (1);
  if( digitalRead(encoderPinB_E) != B_set_E ) {
    B_set_E = !B_set_E;
    //  adjust counter - 1 if B leads A
    if( B_set_E && !A_set_E ) 
      encoderPos_E -= 1;

    rotating_E = false;
  }
}


// Interrupt on A changing state
void doEncoderA_W(){
  // debounce
  if ( rotating_W ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change? 
  if( digitalRead(encoderPinA_W) != A_set_W ) {  // debounce once more
    A_set_W = !A_set_W;

    // adjust counter + if A leads B
    if ( A_set_W && !B_set_W ) 
      encoderPos_W += 1;

    rotating_W = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB_W(){
  if ( rotating_W ) delay (1);
  if( digitalRead(encoderPinB_W) != B_set_W ) {
    B_set_W = !B_set_W;
    //  adjust counter - 1 if B leads A
    if( B_set_W && !A_set_W ) 
      encoderPos_W -= 1;

    rotating_W = false;
  }
}
