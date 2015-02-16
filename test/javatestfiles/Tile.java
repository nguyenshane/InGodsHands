package com.example.android.opengl;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

import javax.microedition.khronos.opengles.GL10;

public class Tile {
	short vertexIndices[] = new short[3];
	
	int neighborIndices[] = new int[3];
	
	ShortBuffer indexBuffer;
	
	FloatBuffer vertexBuffer;
	
	FloatBuffer colorBuffer;
	
	GlobeAttributeHandle handle;
	
	Tile neighbora;
	Tile neighborb;
	Tile neighborc;
	
	int normalIndex;
	
	Vector3f normal;
	
	Boolean isOcean;
	
	Boolean hasHuman;
	
	Boolean divided;
	
	public Tile(GlobeAttributeHandle attrHandle, int vertexa, int vertexb, int vertexc) {
		//vertexBuffer = vertices;
		
		//colorBuffer = colors;
		
		isOcean = (Math.random() > .008) ? true : false;
		
		handle = attrHandle;
		
		divided = false;
		
		hasHuman = false;
		
		vertexIndices[0] = (short)vertexa;
		vertexIndices[1] = (short)vertexb;
		vertexIndices[2] = (short)vertexc;
		
		//normalIndex = normal;
		
		
		
		/*while (fb.hasRemaining()) {
		      System.out.println(fb.position() + " -> " + fb.get());
		}*/
		
		
	}
	
	public void bufferIndices() {
		// initialize vertex byte buffer for shape coordinates
		ByteBuffer bb = ByteBuffer.allocateDirect(vertexIndices.length * 4);
		bb.order(ByteOrder.nativeOrder());
		indexBuffer = bb.asShortBuffer();
		indexBuffer.put(vertexIndices);
				
		indexBuffer.position(0);
		

	}
	
	public void calculateNormal() {
		//Vector3f vectora = new Vector3f(handle.vertices[vertexIndices[0] * 3], handle.vertices[vertexIndices[0] * 3 + 1], handle.vertices[vertexIndices[0] * 3 + 2]);
		//Vector3f vectorb = new Vector3f(handle.vertices[vertexIndices[1] * 3], handle.vertices[vertexIndices[1] * 3 + 1], handle.vertices[vertexIndices[1] * 3 + 2]);
		//Vector3f vectorc = new Vector3f(handle.vertices[vertexIndices[2] * 3], handle.vertices[vertexIndices[2] * 3 + 1], handle.vertices[vertexIndices[2] * 3 + 2]);
		
		Vector3f vectora = handle.getVertex(indexBuffer.get(0));
		Vector3f vectorb = handle.getVertex(indexBuffer.get(1));
		Vector3f vectorc = handle.getVertex(indexBuffer.get(2));
		
		//System.out.println(vectora + ", " + vectorb + ", " + vectorc);
		
		vectorb.subtractBy(vectora);
		vectorc.subtractBy(vectora);
		
		normal = vectorb.crossMultiply(vectorc);
		
		normal.normalize();
		
		//System.out.println(normal);
		//handle.normalBuffer.put(vertexIndices[0]);
		
		//normal = new Vector3f(0, 0, 1);
		
		// Test Oceans
		if (!neighbora.isOcean || !neighborb.isOcean || !neighborc.isOcean) {
			isOcean = false;
			if (!neighborb.isOcean && !neighborc.isOcean)
				handle.setVertexMagnitude(indexBuffer.get(0), (float) (Math.random()/10 + 1));
			if (!neighbora.isOcean && !neighborc.isOcean)
				handle.setVertexMagnitude(indexBuffer.get(1), (float) (Math.random()/10 + 1));
			if (!neighbora.isOcean && !neighborb.isOcean)
				handle.setVertexMagnitude(indexBuffer.get(2), (float) (Math.random()/10 + 1));

			neighbora.isOcean = false;
			neighborb.isOcean = false;
			neighborc.isOcean = false;
		}
		
	}
	
	public void setNeighbors(int a, int b, int c) {
		neighbora = handle.tiles[a];
		neighborb = handle.tiles[b];
		neighborc = handle.tiles[c];
		neighborIndices[0] = a;
		neighborIndices[1] = b;
		neighborIndices[2] = c;
	}
	
	public void setNeighbor(int neighbor, int index) {
		if (neighbor == 0) {
			neighbora = handle.tiles[index];
		} else if (neighbor == 1) {
			neighborb = handle.tiles[index];
		} else if (neighbor == 2) {
			neighborc = handle.tiles[index];
		}
	}
	
	public int getVertexIndex(Vector3f vertex) {
		if (vertex.x == handle.vertices[vertexIndices[0] * 3]
				&& vertex.y == handle.vertices[vertexIndices[0] * 3 + 1]
				&& vertex.z == handle.vertices[vertexIndices[0] * 3 + 2]) {
			return (int)vertexIndices[0];
		} else if (vertex.x == handle.vertices[vertexIndices[1] * 3]
				&& vertex.y == handle.vertices[vertexIndices[1] * 3 + 1]
				&& vertex.z == handle.vertices[vertexIndices[1] * 3 + 2]) {
			return (int)vertexIndices[1];
		} else if (vertex.x == handle.vertices[vertexIndices[2] * 3]
				&& vertex.y == handle.vertices[vertexIndices[2] * 3 + 1]
				&& vertex.z == handle.vertices[vertexIndices[2] * 3 + 2]) {
			return (int)vertexIndices[2];
		}
		return -1;
	}
	
	public Vector3f getMidpoint(int verta, int vertb) {
		Vector3f midpoint = new Vector3f(handle.vertices[vertexIndices[verta] * 3], handle.vertices[vertexIndices[verta] * 3 + 1], handle.vertices[vertexIndices[verta] * 3 + 2]);
		Vector3f vert2 = new Vector3f(handle.vertices[vertexIndices[vertb] * 3], handle.vertices[vertexIndices[vertb] * 3 + 1], handle.vertices[vertexIndices[vertb] * 3 + 2]);
		midpoint.addBy(vert2);
		midpoint.divideBy(2);
		return midpoint;
	}
	
	public Vector3f getCenter() {
		Vector3f center = getMidpoint(0, 1);
		Vector3f vert = new Vector3f(handle.vertices[vertexIndices[2] * 3], handle.vertices[vertexIndices[2] * 3 + 1], handle.vertices[vertexIndices[2] * 3 + 2]);
		center.addBy(vert);
		center.divideBy(2);
		return center;
	}
	
	public void draw(GL10 gl) {
		if (hasHuman) {
			gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);

	        gl.glColor4f(1.0f, 0.0f, 0.0f, 1.0f);
	        // draw the shape
	        gl.glNormal3f(normal.x, normal.y, normal.z);
	        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, handle.vertexBuffer);
			gl.glDrawElements(GL10.GL_TRIANGLES, 3, GL10.GL_UNSIGNED_SHORT, indexBuffer);
			
			// Disable vertex array drawing to avoid
	        // conflicts with shapes that don't use it
	        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
		} else if (isOcean) {
			gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);

	        gl.glColor4f(0.0f, 0.0f, 1.0f, 1.0f);
	        // draw the shape
	        gl.glNormal3f(normal.x, normal.y, normal.z);
	        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, handle.vertexBuffer);
			gl.glDrawElements(GL10.GL_TRIANGLES, 3, GL10.GL_UNSIGNED_SHORT, indexBuffer);
			
			// Disable vertex array drawing to avoid
	        // conflicts with shapes that don't use it
	        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
		} else {
		// Since this shape uses vertex arrays, enable them
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glEnableClientState(GL10.GL_COLOR_ARRAY);
        //gl.glEnableClientState(GL10.GL_NORMAL_ARRAY);

        //gl.glColor4f(handle.colorBuffer.get(vertexIndices[0]), handle.colorBuffer.get(vertexIndices[0] + 1), handle.colorBuffer.get(vertexIndices[0] + 2), (float) 1.0);
        // draw the shape
        gl.glNormal3f(normal.x, normal.y, normal.z);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, handle.vertexBuffer);
        gl.glColorPointer(4, GL10.GL_FLOAT, 0, handle.colorBuffer);
        //gl.glNormalPointer(GL10.GL_FLOAT, 0, handle.normalBuffer);
		gl.glDrawElements(GL10.GL_TRIANGLES, 3, GL10.GL_UNSIGNED_SHORT, indexBuffer);
		
		// Disable vertex array drawing to avoid
        // conflicts with shapes that don't use it
        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glDisableClientState(GL10.GL_COLOR_ARRAY);
        //gl.glDisableClientState(GL10.GL_NORMAL_ARRAY);
		}
	}
	
	
}
