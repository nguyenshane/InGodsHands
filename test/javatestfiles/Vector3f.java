package com.example.android.opengl;

public class Vector3f {
	public float x;
	public float y;
	public float z;
	
	/*** Constructors ***/

	public Vector3f() {
	    this.x = 0;
	    this.y = 0;
	    this.z = 0;
	}

	public Vector3f(float x, float y, float z) {
	    this.x = x;
	    this.y = y;
	    this.z = z;
	}
	
	/*** Arithmetic ***/
	
	 // Vector addition
	public Vector3f add(Vector3f other) {
	    Vector3f newVector = new Vector3f();
	    newVector.x = x + other.x;
	    newVector.y = y + other.y;
	    newVector.z = z + other.z;
	    return newVector;
	}
	// Vector subtraction
	public Vector3f subtract(Vector3f other) {
	    Vector3f newVector = new Vector3f();
	    newVector.x = x - other.x;
	    newVector.y = y - other.y;
	    newVector.z = z - other.z;
	    return newVector;
	}
	// Scalar float multiplication
	public Vector3f multiply(float scale) {
	    Vector3f newVector = new Vector3f();
	    newVector.x = x * scale;
	    newVector.y = y * scale;
	    newVector.z = z * scale;
	    return newVector;
	}
	// Scalar float division
	Vector3f divide(float scale) {
	    Vector3f newVector = new Vector3f();
	    newVector.x = x / scale;
	    newVector.y = y / scale;
	    newVector.z = z / scale;
	    return newVector;
	}
	// Cross multiplication
	public Vector3f crossMultiply(Vector3f other) {
	    Vector3f newVector = new Vector3f();
	    newVector.x = y * other.z - z * other.y;
	    newVector.y = z * other.x - x * other.z;
	    newVector.z = x * other.y - y * other.x;
	    return newVector;
	}
	// Destructive vector addition
	public Vector3f addBy(Vector3f other) {
	    x = x + other.x;
	    y = y + other.y;
	    z = z + other.z;
	    return this;
	}
	// Destructive vector subtraction
	public Vector3f subtractBy(Vector3f other) {
	    x = x - other.x;
	    y = y - other.y;
	    z = z - other.z;
	    return this;
	}
	// Destructive scalar float multiplication
	public Vector3f multiplyBy(float scale) {
	    x = x * scale;
	    y = y * scale;
	    z = z * scale;
	    return this;
	}
	// Destructive scalar float division
	public Vector3f divideBy(float scale) {
	    x = x / scale;
	    y = y / scale;
	    z = z / scale;
	    return this;
	}
	// Destructive cross multiplication
	public Vector3f crossMultiplyBy(Vector3f other) {
	    x = y * other.z - z * other.y;
	    y = z * other.x - x * other.z;
	    z = x * other.y - y * other.x;
	    return this;
	}


	/*** Comparison operators ***/
	public Boolean equals(Vector3f v){
		Boolean equal = true;
		if(x != v.x) equal = false;
		if(y != v.y) equal = false;
		if(z != v.z) equal = false;
		return(equal);
	}

	public Boolean doesNotEqual(Vector3f v){
		if(x != v.x) return(true);
		if(y != v.y) return(true);
		if(z != v.z) return(true);
		return(false);
	}

	public Boolean isLessThan(Vector3f v){
		return(length() < v.length());
	}

	public Boolean isGreaterThan(Vector3f v){
		return(length() > v.length());
	}

	public Boolean isLessThanOrEqualTo(Vector3f v){
		return(length() <= v.length());
	}

	public Boolean isGreaterThanOrEqualTo(Vector3f v){
		return(length() >= v.length());
	}



	/*** Class functions ***/

	public void normalize() {
		float length = this.length();
		if(length == 0){
			x = 0;
			y = 0;
			z = 0;
			return;
		}
	    this.divideBy(length);
		
		/*float length = (float) Math.sqrt(x * x + y * y + z * z);
		if(length == 0){
			x = 0;
			y = 0;
			z = 0;
			return;
		}	
			
		float tempx = x / length;
	    float tempy = y / length;
	    float tempz = z / length;
	    x = tempx;
	    y = tempy;
	    z = tempz;*/
	}
	
	public void normalize(float magnitude) {
		this.normalize();
		this.multiplyBy(magnitude);
	}

	public void reflect(Vector3f normal) {
	    this.subtractBy(normal.multiply(2 * dot(this, normal)));
	}

	public Boolean isNormal() {
	    return (this.length() == 1);
	}

	public float length() {
		float sum = x * x + y * y + z * z;
		if(sum == 0) return(0);
		float length = (float) Math.sqrt(sum);
	    return(length); 
	}

	public Boolean isZero(){
		return(x == 0 && y == 0 && z == 0);
	}
	
	public String toString() {
		return "(" + x + ", " + y + ", " + z + ")";
	}
	
	public



	/*** Utility functions ***/

	Vector3f normalize(Vector3f vector) {
		float length = vector.length();
		if(length == 0) return(new Vector3f(0,0,0));
	    Vector3f newVector = vector.divide(length);
		return newVector;
	}

	Vector3f reflect(Vector3f input, Vector3f normal) {
	    return(input.subtract(normal.multiply(2 * dot(input, normal))));
	}

	// Return the vector projection of vector b onto vector a
	Vector3f project(Vector3f b, Vector3f a){
		return(normalize(a).multiplyBy(dot(a, b) / a.length()) ); 
	}

	float dot(Vector3f v1, Vector3f v2) {
		return(v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
	}
}
