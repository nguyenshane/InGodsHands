package com.example.android.opengl;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.opengles.GL10;

public class GlobeAttributeHandle {
	float[] vertices, colors, normals;
	
	Tile[] tiles;
	
	int numVerts, numFaces, currentVerts, currentFaces;
	
	public FloatBuffer vertexBuffer, colorBuffer, normalBuffer;
	
	
	public GlobeAttributeHandle(int recursionLevel) {
		
		float t = (float) ((1.0 + Math.sqrt(5.0)) / 2.0);
		
		float[] startingVerts = {
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

		
		numVerts = calculateNumVerts(12, 20, recursionLevel);
		numFaces = (numVerts - 2) * 2;

		System.out.println(numVerts);
		System.out.println(numFaces);
		
		vertices = new float[numVerts * 3];
		colors = new float[numVerts * 4];
		normals = new float[numFaces];
		tiles = new Tile[numFaces];
		
		currentVerts = 0;
		currentFaces = 20;
		
		for (; currentVerts < startingVerts.length/3; ++currentVerts) {
			vertices[currentVerts * 3] = startingVerts[currentVerts * 3];
			vertices[currentVerts * 3 + 1] = startingVerts[currentVerts * 3 + 1];
			vertices[currentVerts * 3 + 2] = startingVerts[currentVerts * 3 + 2];
		}
		
		
		
		for (int i = 0; i < numVerts * 4; i += 4) {
			colors[i] = (float) Math.random();
			colors[i + 1] = 1.0f;
			colors[i + 2] = 0.0f;
			colors[i + 3] = 1.0f;
			
		}
        
        tiles[0] = new Tile(this, 0, 11, 5);
		tiles[1] = new Tile(this, 0, 5, 1);
		tiles[2] = new Tile(this, 0, 1, 7);
		tiles[3] = new Tile(this, 0, 7, 10);
		tiles[4] = new Tile(this, 0, 10, 11);
		        // 5 adjacent faces
		tiles[5] = new Tile(this, 1, 5, 9);
		tiles[6] = new Tile(this, 5, 11, 4);
		tiles[7] = new Tile(this, 11, 10, 2);
		tiles[8] = new Tile(this, 10, 7, 6);
		tiles[9] = new Tile(this, 7, 1, 8);
		        // 5 faces around point 3
		tiles[10] = new Tile(this, 3, 9, 4);
		tiles[11] = new Tile(this, 3, 4, 2);
		tiles[12] = new Tile(this, 3, 2, 6);
		tiles[13] = new Tile(this, 3, 6, 8);
		tiles[14] = new Tile(this, 3, 8, 9);
		        // 5 adjacent faces
		tiles[15] = new Tile(this, 4, 9, 5);
		tiles[16] = new Tile(this, 2, 4, 11);
		tiles[17] = new Tile(this, 6, 2, 10);
		tiles[18] = new Tile(this, 8, 6, 7);
		tiles[19] = new Tile(this, 9, 8, 1);
		
		tiles[0].setNeighbors(6, 1, 4);
		tiles[1].setNeighbors(5, 2, 0);
		tiles[2].setNeighbors(9, 3, 1);
		tiles[3].setNeighbors(8, 4, 2);
		tiles[4].setNeighbors(7, 0, 3);
		
		tiles[5].setNeighbors(15, 19, 1);
		tiles[6].setNeighbors(16, 15, 0);
		tiles[7].setNeighbors(17, 16, 4);
		tiles[8].setNeighbors(18, 17, 3);
		tiles[9].setNeighbors(19, 18, 2);
		
		tiles[10].setNeighbors(15, 11, 14);
		tiles[11].setNeighbors(16, 12, 10);
		tiles[12].setNeighbors(17, 13, 11);
		tiles[13].setNeighbors(18, 14, 12);
		tiles[14].setNeighbors(19, 10, 13);
		
		tiles[15].setNeighbors(5, 6, 10);
		tiles[16].setNeighbors(6, 7, 11);
		tiles[17].setNeighbors(7, 8, 12);
		tiles[18].setNeighbors(8, 9, 13);
		tiles[19].setNeighbors(9, 5, 14);
		
        for (int i = 1; i < recursionLevel; ++i) {
        	int jMax = currentFaces;
        	for (int j = 0; j < jMax; ++j) {
        		subdivideFace(j);
        		//System.out.println("Subbed.");
        	}
        	for (int j = 0; j < jMax; ++j) {
        		tiles[j].divided = false;
        	}
        }
        
        
        
        
        

		// initialize vertex byte buffer for shape coordinates
        ByteBuffer bb = ByteBuffer.allocateDirect(
                // (number of coordinate values * 4 bytes per float)
                vertices.length * 4);
        bb.order(ByteOrder.nativeOrder());

        // create a floating point buffer from the ByteBuffer
        vertexBuffer = bb.asFloatBuffer();
        // add the coordinates to the FloatBuffer
        vertexBuffer.put(vertices);
        // set the buffer to read the first coordinate
        vertexBuffer.position(0);
        
     // initialize vertex byte buffer for shape coordinates
        ByteBuffer cbb = ByteBuffer.allocateDirect(
                // (number of coordinate values * 4 bytes per float)
                colors.length * 4);
        cbb.order(ByteOrder.nativeOrder());

        // create a floating point buffer from the ByteBuffer
        colorBuffer = cbb.asFloatBuffer();
        // add the coordinates to the FloatBuffer
        colorBuffer.put(colors);
        // set the buffer to read the first coordinate
        colorBuffer.position(0);
        
        for (int i = 0; i < currentFaces; ++i) {
        	tiles[i].bufferIndices();
        }
        
        for (int i = 0; i < numVerts; ++i) {
        	this.setVertexMagnitude(i, 1.0f);
        }
        
        for (int i = 0; i < currentFaces; ++i) {
        	tiles[i].calculateNormal();
        }
        
	}
	
	public int calculateNumVerts(int currentVertices, int currentFaces, int recursionLevel) {
		if (recursionLevel == 0) return 0;
		return currentVertices + calculateNumVerts((int)(currentFaces * 1.5), currentFaces * 4, recursionLevel - 1);
	}
	
	
	
	public void subdivideFace(int index) {
		Vector3f midpointc = tiles[index].getMidpoint(0, 1);
		int vertexc;
		if (tiles[index].neighborc.divided == true) {
			vertexc = tiles[index].neighborc.getVertexIndex(midpointc);
			if (vertexc == -1) {
				System.out.println("Vertex c at tile " + index + ": " + midpointc + "not found.");
			}
		} else {
			vertexc = currentVerts;
			vertices[currentVerts * 3] = midpointc.x;
			vertices[currentVerts * 3 + 1] = midpointc.y;
			vertices[currentVerts * 3 + 2] = midpointc.z;
			++currentVerts;
		}
		
		Vector3f midpointb = tiles[index].getMidpoint(0, 2);
		int vertexb;
		if (tiles[index].neighborb.divided == true) {
			vertexb = tiles[index].neighborb.getVertexIndex(midpointb);
			if (vertexb == -1) {
				System.out.println("Vertex b at tile " + index + ": " + midpointb + "not found.");
			}
		} else {
			vertexb = currentVerts;
			vertices[currentVerts * 3] = midpointb.x;
			vertices[currentVerts * 3 + 1] = midpointb.y;
			vertices[currentVerts * 3 + 2] = midpointb.z;
			++currentVerts;
		}
		
		Vector3f midpointa = tiles[index].getMidpoint(1, 2);
		int vertexa;
		if (tiles[index].neighbora.divided == true) {
			vertexa = tiles[index].neighbora.getVertexIndex(midpointa);
			if (vertexa == -1) {
				System.out.println("Vertex a at tile " + index + ": " + midpointa + "not found.");
			}
		} else {
			vertexa = currentVerts;
			vertices[currentVerts * 3] = midpointa.x;
			vertices[currentVerts * 3 + 1] = midpointa.y;
			vertices[currentVerts * 3 + 2] = midpointa.z;
			++currentVerts;
		}
		
		
		Tile tilea = tiles[currentFaces++] = new Tile(this, tiles[index].vertexIndices[0], vertexc, vertexb);
		Tile tileb = tiles[currentFaces++] = new Tile(this, tiles[index].vertexIndices[1], vertexa, vertexc);
		Tile tilec = tiles[currentFaces++] = new Tile(this, tiles[index].vertexIndices[2], vertexb, vertexa);
		
		tilea.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
		tileb.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
		tilec.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
		
		if (tiles[index].neighborc.divided == true) {
			Tile ac = null, bb = null;
			
			if (tiles[index].neighborc.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighbora;
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighbora.vertexIndices[0]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighbora.vertexIndices[1]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighbora.vertexIndices[2]));
			} if (tiles[index].neighborc.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighborb;
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborb.vertexIndices[0]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborb.vertexIndices[1]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborb.vertexIndices[2]));
			} if (tiles[index].neighborc.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighborc;
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborc.vertexIndices[0]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborc.vertexIndices[1]));
				//System.out.println(getUnbufferedVertex(tiles[index].vertexIndices[0]) + ", " + getUnbufferedVertex(tiles[index].neighborc.neighborc.vertexIndices[2]));
			}
			if (ac == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at ac.");
			}
			tilea.neighborc = ac;
			ac.neighborb = tilea;
			
			if (tiles[index].neighborc.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighbora;
			} else if (tiles[index].neighborc.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighborb;
			} else if (tiles[index].neighborc.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighborc;
			}
			if (bb == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at bb.");
			}
			tileb.neighborb = bb;
			bb.neighborc = tileb;
		}
		
		if (tiles[index].neighborb.divided == true) {
			Tile ab = null, cc = null;
			
			if (tiles[index].neighborb.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighbora;
			} else if (tiles[index].neighborb.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighborb;
			} else if (tiles[index].neighborb.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighborc;
			}
			if (ab == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at ab.");
			}
			tilea.neighborb = ab;
			ab.neighborc = tilea;
			
			if (tiles[index].neighborb.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighbora;
			} else if (tiles[index].neighborb.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighborb;
			} else if (tiles[index].neighborb.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighborc;
			}
			if (cc == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at cc.");
			}
			tilec.neighborc = cc;
			cc.neighborb = tilec;
		}
		
		if (tiles[index].neighbora.divided == true) {
			Tile bc = null, cb = null;
			
			if (tiles[index].neighbora.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighbora;
			} else if (tiles[index].neighbora.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighborb;
			} else if (tiles[index].neighbora.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighborc;
			}
			if (bc == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at bc.");
			}
			tileb.neighborc = bc;
			bc.neighborb = tileb;
			
			if (tiles[index].neighbora.neighbora.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighbora;
			} else if (tiles[index].neighbora.neighborb.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighborb;
			} else if (tiles[index].neighbora.neighborc.getVertexIndex(getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighborc;
			}
			if (cb == null) {
				System.out.println("Tile " + index + " has poor neighbor structure at cb.");
			}
			tilec.neighborb = cb;
			cb.neighborc = tilec;
		}
		

		tiles[index].vertexIndices[0] = (short) vertexa;
		tiles[index].vertexIndices[1] = (short) vertexb;
		tiles[index].vertexIndices[2] = (short) vertexc;
		
		tilea.neighbora = tiles[index];
		tileb.neighbora = tiles[index];
		tilec.neighbora = tiles[index];
		
		tiles[index].neighbora = tilea;
		tiles[index].neighborb = tileb;
		tiles[index].neighborc = tilec;
		
		tiles[index].divided = true;
	}
	
	public Vector3f getVertex(int i) {
		return new Vector3f(vertexBuffer.get(i * 3), vertexBuffer.get((i * 3) + 1), vertexBuffer.get((i * 3) + 2));
	}
	
	public Vector3f getUnbufferedVertex(int i) {
		return new Vector3f(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
	}
	
	public void setVertex(int i, Vector3f newCoords) {
		vertexBuffer.put(i * 3, newCoords.x);
		vertexBuffer.put((i * 3) + 1, newCoords.y);
		vertexBuffer.put((i * 3) + 2, newCoords.z);
	}
	
	public void setVertexMagnitude(int index, float magnitude) {
		Vector3f vert = new Vector3f(vertexBuffer.get(index * 3), vertexBuffer.get((index * 3) + 1), vertexBuffer.get((index * 3) + 2));
		vert.normalize(Math.max(1, Math.min(2, magnitude)));
		vertexBuffer.put(index * 3, vert.x);
		vertexBuffer.put((index * 3) + 1, vert.y);
		vertexBuffer.put((index * 3) + 2, vert.z);
		
	}
	
	public void setVertexColor(int index, float magnitude) {
		//Vector3f color = new Vector3f(colorBuffer.get(index * 4), colorBuffer.get((index * 4) + 1), colorBuffer.get((index * 4) + 2));
		//vert.normalize(magnitude);
		
		colorBuffer.put(index * 4, Math.max(0, Math.min(1, magnitude*30 - 31)));
		
	}
	
	public void drawTiles(GL10 gl) {
		for (int i = 0; i < currentFaces; ++i) {
			tiles[i].draw(gl);
		}
	}
	
	public Tile findLand(Tile tile, int recursions) {
		if (!tile.isOcean) {
			return tile;
		} else if (recursions == 0) {
			return null;
		}
		
		Tile tilea = findLand(tile.neighbora, recursions - 1);
		if (tilea != null)
			return tilea;
		Tile tileb = findLand(tile.neighborb, recursions - 1);
		if (tileb != null)
			return tileb;
		Tile tilec = findLand(tile.neighborc, recursions - 1);
		if (tilec != null)
			return tilec;
		return null;
	}
	
	public String toString() {
		String temp = new String();
		
		temp = temp + "{\"vertices\":[";
		for (int i = 0; i < vertices.length - 1; ++i) {
			temp = temp + vertices[i] + ", ";
		}
		temp = temp + vertices[vertices.length - 1] + "]} ";
		
		temp = temp + "{\"normals\":[";
		for (int i = 0; i < normals.length; ++i) {
			temp = temp + normals[i] + ", ";
		}
		temp = temp + normals[normals.length - 1] + "]} ";
		
		temp = temp + "{\"tiles\":[";
		for (int i = 0; i < tiles.length; ++i) {
			temp = temp + "{\"vertexIndices\": [";
			temp = temp + tiles[i].vertexIndices[0] + ", ";
			temp = temp + tiles[i].vertexIndices[1] + ", ";
			temp = temp + tiles[i].vertexIndices[2] + "], ";
			
			temp = temp + "{\"neighborIndices\": [";
			temp = temp + tiles[i].neighborIndices[0] + ", ";
			temp = temp + tiles[i].neighborIndices[1] + ", ";
			if (i == tiles.length - 1)
				temp = temp + tiles[i].neighborIndices[2] + "]}, ";
			else
				temp = temp + tiles[i].neighborIndices[2] + "]}}";
		}
		return temp;
	}
}
