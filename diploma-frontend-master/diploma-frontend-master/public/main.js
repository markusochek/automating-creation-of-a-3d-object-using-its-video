// const div = document.createElement("div");
// const input = document.createElement("input");
// input.type = "file";
// input.accept = ".pdf, .png, .jpg, .jpeg, .gif, .mp4";
// input.onchange = async (event) => {
//     const file = event.target["files"][0];
//     if (!file) throw new Error("File not found")
//     const formData = new FormData()
//     formData.append("file", file)
    // await Server.POSTFormData("videos", formData).then((response) => {
        const canvas = document.createElement("canvas")
        document.body.appendChild(canvas)

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.shadowMap.enabled = true;

        let fov = 75;
        const aspect = 2;
        const near = 0.1;
        const far = 50;
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.x = 0;
        camera.position.y = 15;
        camera.position.z = 0;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffb7c5);

        const skyColor = "lightblue";
        const intensity = 4;

        let light1 = new THREE.AmbientLight(skyColor, intensity);
        scene.add(light1);

        const light = new THREE.HemisphereLight(0xffffbb, 0xffffbb, 3);
        // light.target.position.set(0, 0, 0);
        // light.position.set(5, 10, 10);

        // light1.castShadow = true;
        //
        // light1.shadow.mapSize.width = 512;
        // light1.shadow.mapSize.height = 512;

        // scene.add(light.target);
        // scene.add(light);

        const controls = new THREE.OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();


        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
        const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

        // response.arrayBuffer().then(array => {
        //     let blob = new Blob([array]);
        //     let url = window.URL.createObjectURL(blob);
        (new THREE.GLTFLoader()).load("cat.glb", (object) => {
                let box = new THREE.Box3().setFromObject( object.scene );
                let center = new THREE.Vector3();
                box.getCenter( center );
                object.scene.position.sub( center ); // center the model
                object.scene.rotation.y = Math.PI;   // rotate the model
                scene.add( object.scene );
            // object.scene.scale.set(2, 2, 2);
            // object.scene.position.set(0, 0, 0);
            // scene.add(object.scene);
        })

        requestAnimationFrame(() => render(renderer, camera, cubeCamera, scene));

        // })
    // })
// }

// div.appendChild(input)
// document.body.appendChild(div)

function render(renderer, camera, cubeCamera, scene) {
    cubeCamera.update(renderer, scene);
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(renderer, camera, cubeCamera, scene));
}