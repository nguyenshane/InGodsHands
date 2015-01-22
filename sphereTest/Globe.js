

    var TriangleIndices

    {

        var v1;

        var v2;

        var v3;

 
       //  TriangleIndices(var v1, var v2, var v3)

       // {

        //    this.v1 = v1;

         //   this.v2 = v2;

         //   this.v3 = v3;

        //}

    }

    MeshGeometry3D geometry;
     var index;
     Dictionary<var64, var> middlePovarIndexCache; //change this line somehow
 
    // add vertex to mesh, fix position to be on unit sphere, return index
    function addVertex(Povar3D p)

    {

        double length = Math.Sqrt(p.X * p.X + p.Y * p.Y + p.Z * p.Z);
        geometry.Positions.Add(new Povar3D(p.X/length, p.Y/length, p.Z/length));

        return index++;

    }

    // return index of povar in the middle of p1 and p2

     function getMiddlePovar(var p1, var p2)

    {

        // first check if we have it already

        bool firstIsSmaller = p1 < p2;
        var smallerIndex = firstIsSmaller ? p1 : p2;
        var greaterIndex = firstIsSmaller ? p2 : p1;
        var key = (smallerIndex << 32) + greaterIndex;

        var ret;
        if (this.middlePovarIndexCache.TryGetValue(key, out ret))

        {

            return ret;
        }
 

        // not in cache, calculate it
        Povar3D povar1 = this.geometry.Positions[p1];
        Povar3D povar2 = this.geometry.Positions[p2];
        Povar3D middle = new Povar3D(

            (povar1.X + povar2.X) / 2.0,
            (povar1.Y + povar2.Y) / 2.0,
            (povar1.Z + povar2.Z) / 2.0);
 
        // add vertex makes sure povar is on unit sphere
        var i = addVertex(middle);
 
        // store it, return index
        this.middlePovarIndexCache.Add(key, i);
        return i;

    }

     function Create(var recursionLevel)
    {
        this.geometry = new MeshGeometry3D();
        this.middlePovarIndexCache = new Dictionary<long, var>();
        this.index = 0;
 
        // create 12 vertices of a icosahedron
        var t = (1.0 + Math.Sqrt(5.0)) / 2.0;
 
        addVertex(new Povar3D(-1,  t,  0));

        addVertex(new Povar3D( 1,  t,  0));

        addVertex(new Povar3D(-1, -t,  0));

        addVertex(new Povar3D( 1, -t,  0));

        addVertex(new Povar3D( 0, -1,  t));

        addVertex(new Povar3D( 0,  1,  t));
        addVertex(new Povar3D( 0, -1, -t));

        addVertex(new Povar3D( 0,  1, -t));
        addVertex(new Povar3D( t,  0, -1));

        addVertex(new Povar3D( t,  0,  1));
        addVertex(new Povar3D(-t,  0, -1));

        addVertex(new Povar3D(-t,  0,  1));

        // create 20 triangles of the icosahedron

        var faces = new List<TriangleIndices>();

        // 5 faces around povar 0

        faces.Add(new TriangleIndices(0, 11, 5));

        faces.Add(new TriangleIndices(0, 5, 1));

        faces.Add(new TriangleIndices(0, 1, 7));

        faces.Add(new TriangleIndices(0, 7, 10));

        faces.Add(new TriangleIndices(0, 10, 11));

        // 5 adjacent faces

        faces.Add(new TriangleIndices(1, 5, 9));
        faces.Add(new TriangleIndices(5, 11, 4));

        faces.Add(new TriangleIndices(11, 10, 2));

        faces.Add(new TriangleIndices(10, 7, 6));

        faces.Add(new TriangleIndices(7, 1, 8));
        // 5 faces around povar 3

        faces.Add(new TriangleIndices(3, 9, 4));

        faces.Add(new TriangleIndices(3, 4, 2));

        faces.Add(new TriangleIndices(3, 2, 6));

        faces.Add(new TriangleIndices(3, 6, 8));

        faces.Add(new TriangleIndices(3, 8, 9));

        // 5 adjacent faces

       faces.Add(new TriangleIndices(4, 9, 5));

        faces.Add(new TriangleIndices(2, 4, 11));

        faces.Add(new TriangleIndices(6, 2, 10));

        faces.Add(new TriangleIndices(8, 6, 7));

        faces.Add(new TriangleIndices(9, 8, 1));

        // refine triangles
        for (var i = 0; i < recursionLevel; i++)
        {
            var faces2 = new List<TriangleIndices>();
            foreach (var tri in faces)
            {
                // replace triangle by 4 triangles
                var a = getMiddlePovar(tri.v1, tri.v2);
                var b = getMiddlePovar(tri.v2, tri.v3);
                var c = getMiddlePovar(tri.v3, tri.v1);
                faces2.Add(new TriangleIndices(tri.v1, a, c));
                faces2.Add(new TriangleIndices(tri.v2, b, a));
                faces2.Add(new TriangleIndices(tri.v3, c, b));
                faces2.Add(new TriangleIndices(a, b, c));
            }

            faces = faces2;
        }

        // done, now add triangles to mesh
        foreach (var tri in faces)
        {

            this.geometry.TriangleIndices.Add(tri.v1);
            this.geometry.TriangleIndices.Add(tri.v2);
            this.geometry.TriangleIndices.Add(tri.v3);
        }
 
        return this.geometry;       
    }
}
