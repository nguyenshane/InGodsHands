package com.example.android.opengl;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.opengles.GL10;

public class Globe {

	
	GlobeAttributeHandle handle;
	
	TestHuman human;
	
	
	public Globe(int recursionLevel) {
		

		handle = new GlobeAttributeHandle(recursionLevel);

		
		human = new TestHuman(handle.findLand(handle.tiles[0], 10));
        
		Writer writer = null;

		try {
		    writer = new BufferedWriter(new OutputStreamWriter(
		          new FileOutputStream("System Drive/Users/chasebradbury/Documents/workspace/OpenGLES10Activity/myFirstJSONFile.txt"), "utf-8"));
		    writer.write(handle.toString());
		} catch (IOException ex) {
		  // report
		} finally {
		   try {writer.close();} catch (Exception ex) {}
		}
		
		
        System.out.println(handle);
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
