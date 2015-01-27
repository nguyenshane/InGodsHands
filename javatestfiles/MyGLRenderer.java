/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.android.opengl;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.opengl.GLSurfaceView;
import android.opengl.GLU;

/**
 * Provides drawing instructions for a GLSurfaceView object. This class
 * must override the OpenGL ES drawing lifecycle methods:
 * <ul>
 *   <li>{@link android.opengl.GLSurfaceView.Renderer#onSurfaceCreated}</li>
 *   <li>{@link android.opengl.GLSurfaceView.Renderer#onDrawFrame}</li>
 *   <li>{@link android.opengl.GLSurfaceView.Renderer#onSurfaceChanged}</li>
 * </ul>
 */
public class MyGLRenderer implements GLSurfaceView.Renderer {

    private Triangle mTriangle;
    private Square mSquare;
    private Globe mGlobe;
    private float mAngle;

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        // Set the background frame color
        gl.glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        
        
        float lightPosition[] = { 7.0f, 0.0f, 5.0f, 0.0f };
        float lightAmbience[] = { 0.1f, 0.1f, 0.1f, 0.5f };
        float lightSpecular[] = { 1.0f, 1.0f, 1.0f, 0.5f };
        FloatBuffer lightPositionBuffer;
        FloatBuffer lightAmbienceBuffer;
        FloatBuffer lightSpecularBuffer;
        
        ByteBuffer position = ByteBuffer.allocateDirect(lightPosition.length * 4);
        position.order(ByteOrder.nativeOrder());
        lightPositionBuffer = position.asFloatBuffer();
        lightPositionBuffer.put(lightPosition);
        lightPositionBuffer.position(0);
        
        ByteBuffer ambience = ByteBuffer.allocateDirect(lightAmbience.length * 4);
        ambience.order(ByteOrder.nativeOrder());
        lightAmbienceBuffer = ambience.asFloatBuffer();
        lightAmbienceBuffer.put(lightAmbience);
        lightAmbienceBuffer.position(0);
        
        ByteBuffer specular = ByteBuffer.allocateDirect(lightSpecular.length * 4);
        specular.order(ByteOrder.nativeOrder());
        lightSpecularBuffer = specular.asFloatBuffer();
        lightSpecularBuffer.put(lightSpecular);
        lightSpecularBuffer.position(0);

        gl.glLightfv(GL10.GL_LIGHT0, GL10.GL_POSITION, lightPositionBuffer);
        gl.glLightfv(GL10.GL_LIGHT0, GL10.GL_AMBIENT, lightAmbienceBuffer);
        gl.glLightfv(GL10.GL_LIGHT0, GL10.GL_DIFFUSE, lightSpecularBuffer);
        //gl.glShadeModel(GL10.GL_SMOOTH);

        gl.glEnable(GL10.GL_LIGHTING);
        gl.glEnable(GL10.GL_LIGHT0);
        
        gl.glEnable(GL10.GL_COLOR_MATERIAL);
        
     // Enable depth test
        gl.glEnable(GL10.GL_DEPTH_TEST);
        // Accept fragment if it closer to the camera than the former one
        gl.glDepthFunc(GL10.GL_LESS);
        
        gl.glEnable(GL10.GL_CULL_FACE);
        //gl.glCullFace(GL10.GL_FRONT);

        mTriangle = new Triangle();
        mSquare = new Square();
        mGlobe = new Globe(4);
    }

    @Override
    public void onDrawFrame(GL10 gl) {

        // Draw background color
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);

        // Set GL_MODELVIEW transformation mode
        gl.glMatrixMode(GL10.GL_MODELVIEW);
        gl.glLoadIdentity();   // reset the matrix to its default state

        // When using GL_MODELVIEW, you must set the view point
        GLU.gluLookAt(gl, 0, 0, (float) -4.5, 0f, 0f, 0f, 0f, 1.0f, 0.0f);

        // Draw square
        //mSquare.draw(gl);

        // Create a rotation for the triangle

        // Use the following code to generate constant rotation.
        // Leave this code out when using TouchEvents.
        // long time = SystemClock.uptimeMillis() % 4000L;
        // float angle = 0.090f * ((int) time);

        gl.glRotatef(mAngle, 0.0f, 1.0f, 0.0f);

        //mGlobe.pullVertTest(mAngle/3000 + 1);
        // Draw triangle
        mGlobe.draw(gl);
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        // Adjust the viewport based on geometry changes
        // such as screen rotations
        gl.glViewport(0, 0, width, height);

        // make adjustments for screen ratio
        float ratio = (float) width / height;
        gl.glMatrixMode(GL10.GL_PROJECTION);        // set matrix to projection mode
        gl.glLoadIdentity();                        // reset the matrix to its default state
        gl.glFrustumf(-ratio, ratio, -1, 1, 3, 6);  // apply the projection matrix
    }

    /**
     * Returns the rotation angle of the triangle shape (mTriangle).
     *
     * @return - A float representing the rotation angle.
     */
    public float getAngle() {
        return mAngle;
    }

    /**
     * Sets the rotation angle of the triangle shape (mTriangle).
     */
    public void setAngle(float angle) {
        mAngle = angle;
    }
}