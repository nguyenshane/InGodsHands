package com.example.android.opengl;

public class TestHuman {
	Tile tile;
	
	public TestHuman(Tile startingTile) {
		tile = startingTile;
		tile.hasHuman = true;
	}
	
	public void moveRandom() {
		//if (System.currentTimeMillis()%10 != 0) return;
		
		float moveTo = (float) Math.random();
		
		if (moveTo < .33 && !tile.neighbora.isOcean) {
			tile.hasHuman = false;
			tile = tile.neighbora;
			tile.hasHuman = true;
		} else if (moveTo < .66 && !tile.neighborb.isOcean) {
			tile.hasHuman = false;
			tile = tile.neighborb;
			tile.hasHuman = true;
		} else if (!tile.neighborc.isOcean) {
			tile.hasHuman = false;
			tile = tile.neighborc;
			tile.hasHuman = true;
		}
	}
}
