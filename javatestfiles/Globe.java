package com.example.android.opengl;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import javax.microedition.khronos.opengles.GL10;

public class Globe {

	float t = (float) ((1.0 + Math.sqrt(5.0)) / 2.0);
	
	float[] vertices = {
			-1, t, 0,
			1, t, 0,
			-1, -t, 0,
			1, -t, 0,
			
			0, -1, t,
			0, 1, t,
			0, -1, -t,
			0, 1, -t,
			
			t, 0, -1,
			t, 0, 1,
			-t, 0, -1,
			-t, 0, 1
	};
	
	float[] colors = {
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			
			0, 0, 1,
			0, 1, 0,
			0, 1, 0,
			0, 0, 1,
			
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 1, 0
	};

	FloatBuffer vertexBuffer, colorBuffer;
	
	Tile[] tiles = new Tile[20];
	
	GlobeAttributeHandle handle;
	
	TestHuman human;
	
	
	public Globe(int recursionLevel) {
		

		handle = new GlobeAttributeHandle(recursionLevel, vertices, tiles);

		
		human = new TestHuman(handle.findLand(handle.tiles[0], 10));
        
        
	}
	
	public void draw(GL10 gl) {
		handle.drawTiles(gl);
		
		human.moveRandom();
	}
	
	public void pullVertTest(float magnitude) {
		//vertexBuffer.put(2, magnitude/30);
		handle.setVertexMagnitude(2, magnitude);
		handle.setVertexMagnitude(34, magnitude);
		handle.setVertexMagnitude(13, magnitude);
		handle.setVertexMagnitude(4, magnitude);
		handle.setVertexMagnitude(5, magnitude);
		handle.setVertexMagnitude(103, magnitude);
		handle.setVertexMagnitude(35, magnitude);
		//handle.setVertexMagnitude(384, magnitude);
		handle.setVertexMagnitude(96, magnitude);
		//handle.setVertexMagnitude(590, magnitude);
		handle.setVertexColor(2, magnitude);
		handle.setVertexColor(34, magnitude);
		handle.setVertexColor(13, magnitude);
		handle.setVertexColor(4, magnitude);
		handle.setVertexColor(5, magnitude);
		handle.setVertexColor(103, magnitude);
		handle.setVertexColor(35, magnitude);
		//handle.setVertexMagnitude(384, magnitude);
		handle.setVertexColor(96, magnitude);
	}
}
